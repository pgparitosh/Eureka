import React, { Component } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import Constants from "expo-constants";
import { DOMAIN } from "../constants/applicationConstants";
import { Block, Text, Card } from "../components";
import { theme, mocks } from "../constants";
import CoursesService from "../services/CoursesService";

const { width } = Dimensions.get("window");

class CourseList extends Component {
  state = {
    headerText: "",
    courses: null,
    category: null
  };

  async componentDidMount() {
    const { params } = this.props.navigation.state;
    const category = params.category;
    // service call to get the courses of the category
    await AsyncStorage.getItem("userToken")
      .then(userToken => {
        var inputObj = {
          json: {
            api_key: userToken,
            installation_id: Constants.installationId,
            device_name: Constants.deviceName,
            course_id: category.id,
            standard_id: "3" // TODO: currently hardcoded. To be removed once API gets updated
          }
        };
        CoursesService.getChapteresList(inputObj)
          .then(res => {
            var rawChapters = res.data;
            var allChapters = [];
            if (rawChapters && rawChapters.length > 0) {
              rawChapters.forEach(element => {
                var chapter = {
                  id: element.chapter_id,
                  name: element.chapter_name,
                  count: element.videos_count,
                  desc:
                    element.description === null ||
                    element.description.Trim() === ""
                      ? "Description not available"
                      : element.description,
                  image:
                    DOMAIN +
                    element.icon_path +
                    element.chapter_icon +
                    "?random_number=" +
                    new Date().getTime()
                };
                allChapters.push(chapter);
              });
              this.setState({
                courses: allChapters,
                category: category,
                headerText: category.name
              });
            } else {
              this.setState({
                courses: [],
                category: category,
                headerText: category.name
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
    const coursesList = this.state.courses;
    if (coursesList === null) return null;
    return (
      <Block>
        <Block flex={false} row center space="between" style={styles.header}>
          <Text h2 bold>
            {this.state.headerText}
          </Text>
        </Block>
        <Block
          style={{
            marginVertical: theme.sizes.base,
            marginHorizontal: theme.sizes.base
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <FlatList
              pagingEnabled
              scrollEnabled
              showsHorizontalScrollIndicator={false}
              snapToAlignment="center"
              data={coursesList}
              keyExtractor={(item, index) => `${index}`}
              renderItem={({ item }) => (
                <Card shadow style={styles.category}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("CourseDetails", {
                        course: item
                      })
                    }
                    style={styles.courseContainer}
                  >
                    <Block style={styles.imageBlock}>
                      <Image
                        source={{ uri: item.image }}
                        style={{ height: 45, width: 45 }}
                      />
                    </Block>
                    <Block style={styles.textBlock}>
                      <Text medium height={18}>
                        {item.name}
                      </Text>
                      <Text gray caption>
                        {item.count} video(s)
                      </Text>
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
    paddingHorizontal: theme.sizes.base * 2
    // marginBottom: 10,
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
    flex: 0.8
  }
});

export default CourseList;
