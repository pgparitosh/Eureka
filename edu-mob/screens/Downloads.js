import React, { Component } from "react";
import { Block, Text, Card, Button } from "../components";
import {
  FlatList,
  Alert,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ActivityIndicator
} from "react-native";
import * as FileSystem from "expo-file-system";
import Toast, { DURATION } from "react-native-easy-toast";
import { theme, applicaitonConstants } from "../constants";
import { colors } from "../constants/theme";

const { width } = Dimensions.get("window");

export default class Downloads extends Component {
  constructor(props) {
    super(props);
    this.getAllDownloadedFiles = this.getAllDownloadedFiles.bind(this);
  }

  state = {
    videos: [],
    selected: false
  };

  componentDidMount() {
    this.getAllDownloadedFiles();
  }

  async getAllDownloadedFiles() {
    var videos = [];
    var itemsProcessed = 0;
    allFileNames = [];
    await FileSystem.readDirectoryAsync(FileSystem.documentDirectory)
      .then(files => {
        files.forEach(function(value, index) {
          var fileNamePieces = value.split(/[\s.]+/);
          allFileNames.push(fileNamePieces[0]);
        });
        var uniqueFiles = allFileNames.filter((v, i, a) => a.indexOf(v) === i);
        uniqueFiles.forEach((value, index) => {
          FileSystem.readAsStringAsync(
            FileSystem.documentDirectory + value + ".txt"
          )
            .then(content => {

              var titleAndDesc = content.split(applicaitonConstants.saltSeparator);

              var video = {
                videoId: index + 1,
                videoTitle: titleAndDesc[0],
                videoDesc: titleAndDesc[1],
                thumbnailUrl: FileSystem.documentDirectory + value + ".png",
                availableOffline: true,
                offlineUrl: FileSystem.documentDirectory + value + ".mp4"
              };
              videos.push(video);
              itemsProcessed++;

              if (itemsProcessed === uniqueFiles.length) {
                this.setState({ videos: videos });
              }
            })
            .catch(error => console.log(error));
        });
      })
      .catch(error => {
        Alert.alert("Something went wrong. Please try again");
        console.log(error);
      });
  }

  getFileNameWithoutExtenstion(fileName) {
    return fileName
      .split(".")
      .slice(0, -1)
      .join(".");
  }

  handleDownload(item) {
    let vids = this.state.videos;
    if (item.availableOffline) {
      let indexOfItemToRemove = -1;
      vids.forEach(vid => {
        if (vid.videoId === item.videoId) {
          indexOfItemToRemove = vids.indexOf(vid);
          return false;
        }
      });

      vids.splice(indexOfItemToRemove, 1);

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

      FileSystem.deleteAsync(
        this.getFileNameWithoutExtenstion(item.offlineUrl) + ".mp4"
      )
        .then(() => {})
        .catch(error => console.log(error));

      this.setState({
        videos: vids,
        selected: false
      });
    }
  }

  render() {
    if (
      this.state.videos === undefined ||
      this.state.videos === null ||
      this.state.videos.length <= 0
    ) {
      console.log("Videos object is found null. No downloads present.");
      return (
        <Block>
          <Block flex={false} row center space="between" style={styles.header}>
            <Text h2 bold>
              All Downloads
            </Text>
          </Block>
          <Block flex={false} row center space="between" style={styles.header}>
            <Text body>No downloads available.</Text>
          </Block>
        </Block>
      );
    }
    return (
      <Block style={{ flex: 1, marginLeft: 10 }}>
        <Text h2 bold style={{marginLeft: 10, marginBottom: 15}}>
          All Downloads
        </Text>
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
