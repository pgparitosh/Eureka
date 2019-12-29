import React, { Component } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableWithoutFeedback
} from "react-native";
import { Block, Text, Card } from "../components";
import { mocks, theme } from "../constants";

const { width } = Dimensions.get("window");

class CourseDescription extends Component {
  state = {
    reviews: [],
    course: null
  };

  componentDidMount() {
    // make a service call to get the course description and reviews
    this.setState({ reviews: mocks.reviews, course: this.props.course });
  }

  render() {
    const { course, reviews } = this.state;
    if (course === null) return null;
    return (
      <Block>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Card
            shadow
            style={[
              styles.category,
              {
                marginVertical: theme.sizes.base,
                marginHorizontal: theme.sizes.base
              }
            ]}
          >
            <Text size={16} medium secondary style={{ marginBottom: 10 }}>
              Course Description
            </Text>
            <Text body size={13}>
              {course.desc}
            </Text>
          </Card>
          {/* 
          Hiding the reviews as of now as we are not providing the teacher's login section
          to be removed later 
          */}
          {/* <Card
            shadow
            style={[
              styles.category,
              {
                marginVertical: theme.sizes.base,
                marginHorizontal: theme.sizes.base
              }
            ]}
          >
            <Text size={16} medium secondary style={{ marginBottom: 10 }}>
              Reviews
            </Text>
            <FlatList
              pagingEnabled
              scrollEnabled
              showsHorizontalScrollIndicator={false}
              snapToAlignment="center"
              data={reviews}
              keyExtractor={(item, index) => `${index}`}
              renderItem={({ item }) => (
                <Card shadow style={styles.reviews}>
                  <TouchableWithoutFeedback>
                    <Block style={styles.courseContainer}>
                      <Block style={styles.imageBlock}>
                        <Image
                          source={item.avatar}
                          style={{ height: 45, width: 45 }}
                        />
                      </Block>
                      <Block style={styles.textBlock}>
                        <Text medium height={16}>
                          {item.reviewBy}
                        </Text>
                        <Text gray caption>
                          {item.reviewText}
                        </Text>
                      </Block>
                    </Block>
                  </TouchableWithoutFeedback>
                </Card>
              )}
            />
          </Card> */}
        </ScrollView>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  category: {
    marginLeft: 10,
    minWidth: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2,
    maxWidth: width - theme.sizes.base
    // backgroundColor: '#efefef',
    // maxHeight: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
  },
  reviews: {
    minWidth: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2,
    maxWidth: width - theme.sizes.base
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

export default CourseDescription;
