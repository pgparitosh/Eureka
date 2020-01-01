import React, { Component } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableWithoutFeedback,
  Alert,
  AsyncStorage
} from "react-native";
import Constants from "expo-constants";
import { DOMAIN, AWS_DOMAIN } from "../constants/applicationConstants";
import { Block, Text, Card, Button } from "../components";
import { theme, mocks, applicaitonConstants } from "../constants";
import { Notifications } from "expo";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";

import CoursesService from "../services/CoursesService";
import Toast, { DURATION } from "react-native-easy-toast";
import { colors } from "../constants/theme";

const { width } = Dimensions.get("window");

async function getiOSNotificationPermission() {
  const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  if (status !== "granted") {
    await Permissions.askAsync(Permissions.NOTIFICATIONS);
  }
}

class CourseVideos extends Component {
  isDownloadPage = null;

  constructor(props) {
    super(props);
    this.listenForNotifications = this.listenForNotifications.bind(this);
    this.openFile = this.openFile.bind(this);
    this.getDownloadedFiles = this.getDownloadedFiles.bind(this);
    this.getAllDownloadedFiles = this.getAllDownloadedFiles.bind(this);
  }

  state = {
    videos: [],
    filePreviewText: "",
    downloadedFiles: [],
    selected: false,
    loading: false
  };

  async componentDidMount() {
    // make a service call to get all the videos for the particular course
    const { params } = this.props.parentNav.state;
    const course = params.course;

    await AsyncStorage.getItem("userToken")
      .then(userToken => {
        var inputObj = {
          json: {
            api_key: userToken,
            installation_id: Constants.installationId,
            device_name: Constants.deviceName,
            chapter_id: course.id
          }
        };
        CoursesService.getVideosList(inputObj)
          .then(res => {
            var rawVideos = res.data;
            var allVideos = [];
            if (rawVideos && rawVideos.length > 0) {
              rawVideos.forEach(element => {
                var video = {
                  videoId: element.video_id,
                  videoTitle: element.title,
                  videoDesc: element.description,
                  thumbnailUrl:
                    DOMAIN +
                    element.thumbnail_path +
                    "?random_number=" +
                    new Date().getTime(),
                  videoUrl: AWS_DOMAIN + element.video_path,
                  availableOffline: false,
                  isDownloading: false,
                  offlineUrl: ""
                };
                allVideos.push(video);
              });
              this.setState({
                videos: allVideos
              });
              this.getDownloadedFiles();
            } else {
              this.setState({
                videos: []
              });
              this.getDownloadedFiles();
            }
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(err => {
        console.log(err);
        const parentNav = this.props.navigation.dangerouslyGetParent();
        AsyncStorage.clear().then(() => {
          parentNav.navigate("AuthLoading");
        });
      });
  }

  async getAllDownloadedFiles() {
    videos = [];
    allFileNames = [];
    await FileSystem.readDirectoryAsync(FileSystem.documentDirectory)
      .then(files => {
        files.forEach(function(value, index) {
          var fileNamePieces = value.split(/[\s.]+/);
          allFileNames.push(fileNamePieces[0]);
        });
        var uniqueFiles = allFileNames.filter(function(item, pos) {
          return files.indexOf(item) == pos;
        });
        uniqueFiles.forEach(function(value, index) {
          FileSystem.readAsStringAsync(value + ".txt")
            .then(content => {
              var video = {
                videoId: index + 1,
                videoTitle: content,
                thumbnailUrl: value + ".png",
                availableOffline: true,
                offlineUrl: value + ".mp4"
              };
              videos.push(video);
            })
            .catch(error => console.log(error));
        });
      })
      .catch(error => console.log(error));
    this.setState({
      videos: videos,
      selected: false
    });
  }

  async getDownloadedFiles() {
    var vids = this.state.videos;
    if (vids !== null && vids.length > 0) {
      await FileSystem.readDirectoryAsync(FileSystem.documentDirectory)
        .then(files => {
          if (files.length > 0) {
            vids.forEach(element => {
              var fileName = this.getFileName(element.videoUrl);
              if (files.indexOf(fileName) > -1) {
                element.availableOffline = true;
                element.offlineUrl = FileSystem.documentDirectory + fileName;
              } else {
                element.availableOffline = false;
                element.offlineUrl = "";
              }
            });
            this.setState({
              downloadedFiles: files,
              videos: vids,
              selected: false
            });
          } else {
            // for the last download, the flatlist would not re render
            vids.forEach(element => {
              element.availableOffline = false;
              element.offlineUrl = "";
            });
            this.setState({
              downloadedFiles: files,
              videos: vids,
              selected: false
            });
          }
        })
        .catch(error => console.log(error));
    }
  }

  getFileName(url) {
    var urlPieces = url.split(/[\s/]+/);
    return urlPieces[urlPieces.length - 1];
  }

  getFileNameWithoutExtenstion(fileName) {
    return fileName
      .split(".")
      .slice(0, -1)
      .join(".");
  }

  handleDownload(item) {
    let vids = this.state.videos;
    vids.forEach(vid => {
      if (vid.videoId === item.videoId) {
        item.isDownloading = true;
        return false;
      }
    });
    this.setState({ videos: vids });
    if (item.availableOffline) {
      // delete the thumbnail
      FileSystem.deleteAsync(
        this.getFileNameWithoutExtenstion(item.offlineUrl) + ".png"
      )
        .then(() => {})
        .catch(error => console.log(error));

      //delete the text file
      FileSystem.deleteAsync(
        this.getFileNameWithoutExtenstion(item.offlineUrl) + ".txt"
      )
        .then(() => {})
        .catch(error => console.log(error));

      // delete the video
      FileSystem.deleteAsync(item.offlineUrl)
        .then(() => {
          Alert.alert("Success!", "Download removed successfully");
          this.getDownloadedFiles()
            .then(() => {
              vids = this.state.videos;
              vids.forEach(vid => {
                if (vid.videoId === item.videoId) {
                  item.isDownloading = false;
                  return false;
                }
              });
              this.setState({ videos: vids });
            })
            .catch(error => {
              vids = this.state.videos;
              vids.forEach(vid => {
                if (vid.videoId === item.videoId) {
                  item.isDownloading = false;
                  return false;
                }
              });
              this.setState({ videos: vids });
              console.log(error);
            });
        })
        .catch(error => console.log(error));
    } else {
      let fileName = this.getFileName(item.videoUrl);
      let thumbnailUri =
        FileSystem.documentDirectory +
        this.getFileNameWithoutExtenstion(fileName) +
        ".png";
      let fileUri = FileSystem.documentDirectory + fileName;
      let metadataUri =
        FileSystem.documentDirectory +
        this.getFileNameWithoutExtenstion(fileName) +
        ".txt";
      // Start the download for thumbnail first
      FileSystem.downloadAsync(item.thumbnailUrl, thumbnailUri)
        .then(({ uri }) => {})
        .catch(error => console.log(error));

      // Create a text file to contain the meta data of the file
      FileSystem.writeAsStringAsync(
        metadataUri,
        item.videoTitle + applicaitonConstants.saltSeparator + item.videoDesc
      )
        .then(() => {})
        .catch(error => console.log(error));

      // Download the video file and show notification to the user
      FileSystem.downloadAsync(item.videoUrl, fileUri)
        .then(({ uri }) => {
          console.log("Finished downloading to ", uri);

          const localnotification = {
            title: "Download has finished",
            body: fileName + " has been downloaded. Tap to open file.",
            android: {
              sound: true
            },
            ios: {
              sound: true
            },
            data: {
              fileUri: uri
            }
          };
          localnotification.data.title = localnotification.title;
          localnotification.data.body = localnotification.body;
          let sendAfterFiveSeconds = Date.now();
          sendAfterFiveSeconds += 1000;

          const schedulingOptions = { time: sendAfterFiveSeconds };
          Notifications.scheduleLocalNotificationAsync(
            localnotification,
            schedulingOptions
          );
          Alert.alert("Success!", "File Downloaded Successfully");
          this.getDownloadedFiles()
            .then(() => {})
            .catch(error => console.log(error));
          vids = this.state.videos;
          vids.forEach(vid => {
            if (vid.videoId === item.videoId) {
              item.isDownloading = false;
              return false;
            }
          });
          this.setState({ videos: vids });
        })
        .catch(error => {
          vids = this.state.videos;
          vids.forEach(vid => {
            if (vid.videoId === item.videoId) {
              item.isDownloading = false;
              return false;
            }
          });
          this.setState({ videos: vids });
          console.error(error);
          Alert.alert("Failed!", error);
        });
    }
  }

  listenForNotifications() {
    const _this = this;
    Notifications.addListener(notification => {
      if (notification.origin === "received") {
        // We could also make our own design for the toast
        // _this.refs.toast.show(<View><Text>hello world!</Text></View>);
        const toastDOM = (
          <TouchableWithoutFeedback
            onPress={() => {
              this.openFile(notification.data.fileUri);
            }}
            style={{ padding: "10", backgroundColor: "green" }}
          >
            <Text style={styles.toastText}>{notification.data.body}</Text>
          </TouchableWithoutFeedback>
        );

        //_this.toast.show(toastDOM, DURATION.FOREVER);
      } else if (notification.origin === "selected") {
        console.log(notification.data.fileUri);
        this.openFile(notification.data.fileUri);
      }
    });
  }

  componentWillMount() {
    getiOSNotificationPermission();
    this.listenForNotifications();
  }

  playVideoComp(item) {
    this.props.parentNav.navigate("VideoPlayerComp", {
      url: item.availableOffline ? item.offlineUrl : item.videoUrl
    });
  }

  openFile(fileUri) {
    console.log("Opening file " + fileUri);
    FileSystem.readAsStringAsync(fileUri).then(fileContents => {
      this.setState({ filePreviewText: fileContents });
    });
    this.props.parentNav.navigate("VideoPlayerComp", { url: fileUri });
  }

  render() {
    if (this.state.videos === undefined || this.state.videos === null)
      return null;
    return (
      <Block style={{ flex: 1, marginLeft: 10 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Toast ref={ref => (this.toast = ref)} />
          <FlatList
            pagingEnabled
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            data={this.state.videos}
            extraData={this.state}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({ item }) => (
              <Card shadow style={styles.category}>
                <Block style={styles.imageBlock}>
                  <Image
                    source={{ uri: item.thumbnailUrl }}
                    style={styles.image}
                  />
                </Block>
                <Block style={styles.textBlock}>
                  <Text primary bold size={16}>
                    {item.videoTitle}
                  </Text>
                  <Text gray caption>
                    {item.videoDesc}
                  </Text>
                </Block>
                <Block middle flex={0.5} margin={5}>
                  <Button gradient onPress={() => this.playVideoComp(item)}>
                    <Text center semibold white>
                      {item.availableOffline ? "Play Offline" : "Play Online"}
                    </Text>
                  </Button>
                  <Button shadow onPress={() => this.handleDownload(item)}>
                    {item.isDownloading ? (
                      <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                      <Text center semibold>
                        {item.availableOffline ? "Remove Download" : "Download"}
                      </Text>
                    )}
                  </Button>
                </Block>
              </Card>
            )}
          />
        </ScrollView>
      </Block>
    );
  }
}

export default CourseVideos;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.sizes.base * 2,
    marginBottom: 10
  },
  category: {
    minWidth: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2,
    maxWidth: width - theme.sizes.base,
    marginLeft: 5,
    marginRight: 10
    // maxHeight: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
  },
  image: {
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
    height: 150,
    width: "95%"
  },
  imageBlock: {
    flex: 0.2,
    justifyContent: "center",
    alignContent: "center"
  },
  textBlock: {
    margin: 5,
    flex: 0.8
  },
  button: {}
});
