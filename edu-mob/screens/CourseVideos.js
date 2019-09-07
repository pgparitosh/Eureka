import React, { Component } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert
} from "react-native";
import { Block, Text, Card, Button } from "../components";
import { theme, mocks } from "../constants";
import { Notifications, Constants } from "expo";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
import Toast, { DURATION } from "react-native-easy-toast";
import * as WebBrowser from "expo-web-browser";

const { width } = Dimensions.get("window");

async function getiOSNotificationPermission() {
  const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  if (status !== "granted") {
    await Permissions.askAsync(Permissions.NOTIFICATIONS);
  }
}

class CourseVideos extends Component {
  constructor(props) {
    super(props);
    this.listenForNotifications = this.listenForNotifications.bind(this);
    this.openFile = this.openFile.bind(this);
    this.getDownloadedFiles = this.getDownloadedFiles.bind(this);
  }

  state = {
    videos: [],
    filePreviewText: "",
    downloadedFiles: [],
    selected: false
  };

  async componentDidMount() {
    // make a service call to get all the videos for the particular course
    // this.setState({ videos: mocks.videos });
    this.getDownloadedFiles();
  }

  async getDownloadedFiles() {
    var vids = this.state.videos;
    if (vids === null || vids.length === 0) vids = mocks.videos;
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
            selected: !this.state.selected
          });
        }
      })
      .catch(error => console.log(error));
  }

  getFileName(url) {
    var urlPieces = url.split(/[\s/]+/);
    return urlPieces[urlPieces.length - 1];
  }

  handleDownload(item) {
    var alertMessage = "";
    if (item.availableOffline) {
      FileSystem.deleteAsync(item.offlineUrl)
        .then(() => {
          Alert.alert("Download removed successfully");
          this.getDownloadedFiles()
            .then(() => {})
            .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
    } else {
      let fileName = this.getFileName(item.videoUrl);
      let fileUri = FileSystem.documentDirectory + fileName;
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
          Alert.alert("File Downloaded Successfully");
          this.getDownloadedFiles()
            .then(() => {})
            .catch(error => console.log(error));
        })
        .catch(error => {
          console.error(error);
          Alert.alert(error);
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
              console.log("pressed");
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
                    <Text center semibold>
                      {item.availableOffline ? "Remove Download" : "Download"}
                    </Text>
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
