import React, { Component } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import GestureRecognizer, {
  swipeDirections
} from "react-native-swipe-gestures";

import { Card, Badge, Button, Block, Text } from "../components";
import { theme, mocks } from "../constants";

import CourseDescription from "./CourseDescription";
import CourseVideos from "./CourseVideos";
import CourseDocuments from "./CourseDocuments";

const { width } = Dimensions.get("window");

class CourseList extends Component {
  state = {
    active: "Course Details",
    course: null,
    videos: [],
    documents: [],
    courseDetails: null
  };

  constructor(props) {
    super(props);
    this.onSwipe = this.onSwipe.bind(this);
    this.onSwipeDown = this.onSwipeDown.bind(this);
    this.onSwipeLeft = this.onSwipeLeft.bind(this);
    this.onSwipeRight = this.onSwipeRight.bind(this);
    this.onSwipeUp = this.onSwipeUp.bind(this);
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    // make service call
    this.setState({ course: params.course });
  }

  onSwipeUp(gestureState) {
    this.setState({ myText: "You swiped up!" });
  }

  onSwipeDown(gestureState) {
    this.setState({ myText: "You swiped down!" });
  }

  onSwipeLeft(gestureState) {
    this.setState({ myText: "You swiped left!" });
  }

  onSwipeRight(gestureState) {
    this.setState({ myText: "You swiped right!" });
  }

  onSwipe(gestureName, gestureState) {
    const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
    this.setState({ gestureName: gestureName });
    switch (gestureName) {
      case SWIPE_UP:
        break;
      case SWIPE_DOWN:
        break;
      case SWIPE_LEFT: {
        if (this.state.active === "Course Details") {
          this.handleTab("Videos");
          break;
        }
        if (this.state.active === "Videos") {
          this.handleTab("Documents");
          break;
        }
        if (this.state.active === "Documents") break;
      }
      case SWIPE_RIGHT:
        if (this.state.active === "Course Details") break;
        if (this.state.active === "Videos") {
          this.handleTab("Course Details");
          break;
        }
        if (this.state.active === "Documents") {
          this.handleTab("Videos");
          break;
        }
    }
  }

  renderTabData() {
    const activeTab = this.state.active;
    if (activeTab === "Course Details") {
      return (
        <CourseDescription
          parentNav={this.props.navigation}
          course={this.state.course}
        />
      );
    } else if (activeTab === "Videos") {
      return (
        <CourseVideos
          parentNav={this.props.navigation}
          isDownloadPage={false}
          course={this.state.course}
        />
      );
    } else if (activeTab === "Documents") {
      return (
        <CourseDocuments
          parentNav={this.props.navigation}
          course={this.state.course}
        />
      );
    } else {
      return null;
    }
  }

  handleTab = tab => {
    const { categories, mycourses } = this.props;
    if (tab === "Course Details")
      this.setState({ active: tab, categories: mycourses });
    else this.setState({ active: tab, categories: categories });
  };

  renderTab(tab) {
    const { active } = this.state;
    const isActive = active === tab;

    return (
      <TouchableOpacity
        key={`tab-${tab}`}
        onPress={() => this.handleTab(tab)}
        style={[styles.tab, isActive ? styles.active : null]}
      >
        <Text size={15} medium gray={!isActive} secondary={isActive}>
          {tab}
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };
    const tabs = ["Course Details", "Videos", "Documents"];
    const course = this.state.course;

    if (course === null) return null;
    return (
      <GestureRecognizer
        onSwipe={this.onSwipe}
        onSwipeUp={this.onSwipeUp}
        onSwipeDown={this.onSwipeDown}
        onSwipeLeft={this.onSwipeLeft}
        onSwipeRight={this.onSwipeRight}
        config={config}
        style={{
          flex: 1,
          backgroundColor: this.state.backgroundColor
        }}
      >
        <Block>
          <Block flex={false} row center space="between" style={styles.header}>
            <Text h3 bold>
              {course.name}
            </Text>
          </Block>
          <Block flex={false} row space="between" style={styles.tabs}>
            {tabs.map(tab => this.renderTab(tab))}
          </Block>
          {this.renderTabData()}
        </Block>
      </GestureRecognizer>
    );
  }
}

export default CourseList;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.sizes.base * 2
  },
  tabs: {
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: theme.sizes.base,
    marginHorizontal: theme.sizes.base * 2
  },
  tab: {
    marginRight: theme.sizes.base * 2,
    paddingBottom: theme.sizes.base
  },
  active: {
    borderBottomColor: theme.colors.secondary,
    borderBottomWidth: 3
  }
});
