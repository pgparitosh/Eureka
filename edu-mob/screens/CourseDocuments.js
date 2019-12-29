import React, { Component } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
  AsyncStorage
} from "react-native";
import Constants from "expo-constants";
import { DOMAIN, AWS_DOMAIN } from "../constants/applicationConstants";
import { Block, Text, Card, Button } from "../components";
import { mocks, theme } from "../constants";
import * as WebBrowser from "expo-web-browser";
import Icon from "react-native-vector-icons/FontAwesome";
import * as FileSystem from "expo-file-system";
import CoursesService from "../services/CoursesService";

const { width } = Dimensions.get("window");

class CourseDocuments extends Component {
  state = {
    documents: []
  };

  openDocument(url) {
    //this.props.parentNav.navigate('PdfViewer', {url: url});
    WebBrowser.openBrowserAsync(url);
  }

  async componentDidMount() {
    // make a service call to get all the videos for the particular course
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
        CoursesService.getDocumentsList(inputObj)
          .then(res => {
            var rawDocuments = res.data;
            var allDocuments = [];
            if (rawDocuments && rawDocuments.length > 0) {
              rawDocuments.forEach(element => {
                var document = {
                  documentId: element.document_id,
                  documentTitle: element.title,
                  documentUrl:
                    DOMAIN + element.document_path + element.document_name,
                  doucmentType: "pdf"
                };
                allDocuments.push(document);
              });
              this.setState({
                documents: allDocuments
              });
            } else {
              this.setState({
                documents: []
              });
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

  render() {
    const { documents } = this.state;
    if (documents === null || documents.length === 0) return null;
    return (
      <Block>
        <Block>
          <ScrollView showsVerticalScrollIndicator={false}>
            <FlatList
              pagingEnabled
              scrollEnabled
              showsHorizontalScrollIndicator={false}
              snapToAlignment="center"
              data={documents}
              keyExtractor={(item, index) => `${index}`}
              renderItem={({ item }) => (
                <Card shadow style={styles.category}>
                  <TouchableOpacity
                    style={styles.courseContainer}
                    onPress={() => this.openDocument(item.documentUrl)}
                  >
                    <Block style={styles.imageBlock}>
                      <Image
                        source={require("../assets/icons/pdf.png")}
                        style={{ height: 45, width: 45 }}
                      />
                    </Block>
                    <Block style={styles.textBlock}>
                      <Text size={14}>{item.documentTitle}</Text>
                    </Block>
                  </TouchableOpacity>
                </Card>
              )}
            />
          </ScrollView>
        </Block>
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
    marginLeft: 10,
    marginRight: 10,
    minWidth: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2,
    maxWidth: width - theme.sizes.base,
    maxHeight: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2
  },
  courseContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start"
  },
  imageBlock: {
    flex: 0.2,
    justifyContent: "center",
    alignContent: "center"
  },
  textBlock: {
    flex: 0.7,
    justifyContent: "center"
    // alignContent: "center",
  },
  downloadBlock: {
    flex: 0.1,
    justifyContent: "center",
    alignContent: "center"
  }
});

export default CourseDocuments;
