import React, { Component } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform
} from "react-native";
import * as Icon from "@expo/vector-icons";

import { Card, Badge, Button, Block, Text } from "../components";
import { theme, mocks } from "../constants";

const { width } = Dimensions.get("window");

class BrowseStudent extends Component {
  state = {
    active: "Explore Courses",
    categories: []
  };

  componentDidMount() {
    this.setState({ categories: this.props.categories });
  }

  handleTab = tab => {
    const { categories, mycourses } = this.props;
    if (tab === "My Courses")
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
    const { profile, navigation } = this.props;
    const { categories } = this.state;
    const tabs = ["Explore Courses", "My Courses"];

    return (
      <Block>
        <Block flex={false} row center space="between" style={styles.header}>
          {/* <Image source={require('../assets/icons/back.png')} /> */}
          <Block>
            <Text h2 bold>
              Browse
            </Text>
          </Block>
          <Block>
            <Block row center justifyContent="flex-end">
              <Button onPress={() => navigation.navigate("Downloads", {isDownloadPage: true})}>
                <Icon.Ionicons
                  style={{ marginRight: 20, fontWeight: "bold" }}
                  size={theme.sizes.font * 1.7}
                  name={
                    Platform.OS === "ios"
                      ? "ios-cloud-download"
                      : "md-cloud-download"
                  }
                />
              </Button>
              <Button onPress={() => navigation.navigate("Settings")}>
                <Image
                  source={require("../assets/images/settings.png")}
                  style={styles.avatar}
                />
              </Button>
            </Block>
          </Block>
        </Block>

        <Block flex={false} row space="between" style={styles.tabs}>
          {tabs.map(tab => this.renderTab(tab))}
          <Image
            source={require("../assets/icons/search.png")}
            style={{ height: 22, width: 22, marginVertical: 5 }}
          />
        </Block>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingVertical: theme.sizes.base * 2 }}
        >
          <Block flex={false} row space="between" style={styles.categories}>
            {categories.map(category => (
              <TouchableOpacity
                key={category.name}
                onPress={() => navigation.navigate("CourseList", { category })}
              >
                <Card center middle shadow style={styles.category}>
                  <Badge
                    margin={[0, 0, 15]}
                    size={50}
                    color="rgba(41,216,143,0.20)"
                  >
                    <Image
                      source={category.image}
                      style={{ height: 30, width: 30 }}
                    />
                  </Badge>
                  <Text medium height={20}>
                    {category.name}
                  </Text>
                  <Text gray caption>
                    {category.count} courses
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </Block>
        </ScrollView>
      </Block>
    );
  }
}

BrowseStudent.defaultProps = {
  profile: mocks.profile,
  categories: mocks.categories,
  mycourses: mocks.mycourses
};

export default BrowseStudent;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.sizes.base * 2
  },
  avatar: {
    height: theme.sizes.base * 1.25,
    width: theme.sizes.base * 1.25
    // marginLeft: 10
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
  },
  categories: {
    flexWrap: "wrap",
    paddingHorizontal: theme.sizes.base * 2,
    marginBottom: theme.sizes.base * 3.5
  },
  category: {
    // this should be dynamic based on screen width
    minWidth: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2,
    maxWidth: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2,
    maxHeight: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2
  }
});
