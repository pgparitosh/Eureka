import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  Platform
} from "react-native";
import * as Icon from "@expo/vector-icons";

import { Divider, Button, Block, Text, Switch } from "../components";
import { theme, mocks } from "../constants";
// import DeviceInfo from 'react-native-device-info';

class Settings extends Component {
  state = {
    budget: 850,
    monthly: 1700,
    notifications: true,
    newsletter: false,
    editing: null,
    profile: {}
  };

  componentDidMount() {
    this.setState({ profile: this.props.profile });
    //console.log(DeviceInfo.getDevice);
    //console.log(DeviceInfo.getDeviceId);
  }

  handleEdit(name, text) {
    const { profile } = this.state;
    profile[name] = text;

    this.setState({ profile });
  }

  toggleEdit(name) {
    const { editing } = this.state;
    this.setState({ editing: !editing ? name : null });
  }

  renderEdit(name) {
    const { profile, editing } = this.state;

    if (editing === name) {
      return (
        <TextInput
          defaultValue={profile[name]}
          onChangeText={text => this.handleEdit([name], text)}
        />
      );
    }

    return <Text bold>{profile[name]}</Text>;
  }

  render() {
    const { profile, editing } = this.state;
    if (profile === {}) return null;
    // const registeredDevices = profile.registeredDevices;

    return (
      <Block>
        <Block flex={false} row center space="between" style={styles.header}>
          <Text h2 bold>
            Settings
          </Text>
        </Block>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Block style={styles.inputs}>
            <Button>
              <Block row center space="between">
                <Text semibold>Profile and Preferences</Text>
                <Icon.Ionicons
                  style={{ marginRight: 10 }}
                  color={theme.colors.gray}
                  size={theme.sizes.font * 1.5}
                  name={Platform.OS === "ios" ? "ios-contact" : "md-contact"}
                />
              </Block>
            </Button>
          </Block>

          <Divider />

          <Block style={styles.operations}>
            <Button>
              <Block row center space="between">
                <Text semibold>Subscription Details</Text>
                <Icon.Ionicons
                  style={{ marginRight: 10 }}
                  color={theme.colors.gray}
                  size={theme.sizes.font * 1.5}
                  name={Platform.OS === "ios" ? "ios-card" : "md-card"}
                />
              </Block>
            </Button>
          </Block>

          <Divider />

          <Block style={styles.operations}>
            <Button>
              <Block row center space="between">
                <Text semibold>Registered Devices</Text>
                <Icon.Ionicons
                  style={{ marginRight: 10 }}
                  color={theme.colors.gray}
                  size={theme.sizes.font * 1.5}
                  name={
                    Platform.OS === "ios"
                      ? "ios-phone-portrait"
                      : "md-phone-portrait"
                  }
                />
              </Block>
            </Button>
          </Block>

          <Divider />

          <Block style={styles.operations}>
            <Button>
              <Block row center space="between">
                <Text semibold>Help and Support</Text>
                <Icon.Ionicons
                  style={{ marginRight: 10 }}
                  color={theme.colors.gray}
                  size={theme.sizes.font * 1.5}
                  name={Platform.OS === "ios" ? "ios-help" : "md-help"}
                />
              </Block>
            </Button>
          </Block>

          <Divider />

          <Block style={styles.operations}>
            <Button>
              <Block row center space="between">
                <Text semibold>Feedback</Text>
                <Icon.Ionicons
                  style={{ marginRight: 10 }}
                  color={theme.colors.gray}
                  size={theme.sizes.font * 1.5}
                  name={Platform.OS === "ios" ? "ios-paper" : "md-paper"}
                />
              </Block>
            </Button>
          </Block>

          <Divider />

          <Block style={styles.operations}>
            <Button>
              <Block row center space="between">
                <Text semibold>Report a Bug</Text>
                <Icon.Ionicons
                  style={{ marginRight: 10 }}
                  color={theme.colors.gray}
                  size={theme.sizes.font * 1.5}
                  name={Platform.OS === "ios" ? "ios-bug" : "md-bug"}
                />
              </Block>
            </Button>
          </Block>

          <Divider />

          <Block style={styles.operations}>
            <Button onPress={() => this.props.navigation.navigate("Welcome")}>
              <Block
                row
                center
                space="between"
              >
                <Text semibold color={"red"}>
                  Logout
                </Text>
                <Icon.Ionicons
                  style={{ marginRight: 10 }}
                  color={theme.colors.accent}
                  size={theme.sizes.font * 1.5}
                  name={Platform.OS === "ios" ? "ios-power" : "md-power"}
                />
              </Block>
            </Button>
          </Block>
        </ScrollView>
      </Block>
    );
  }
}

Settings.defaultProps = {
  profile: mocks.profile
};

export default Settings;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.sizes.base * 2
  },
  avatar: {
    height: theme.sizes.base * 2.2,
    width: theme.sizes.base * 2.2
  },
  inputs: {
    marginTop: theme.sizes.base * 0.7,
    paddingHorizontal: theme.sizes.base * 2
  },
  operations: {
    // marginTop: 10,
    paddingHorizontal: theme.sizes.base * 2
  },
  inputRow: {
    alignItems: "flex-end"
  },
  sliders: {
    marginTop: theme.sizes.base * 0.7,
    paddingHorizontal: theme.sizes.base * 2
  },
  thumb: {
    width: theme.sizes.base,
    height: theme.sizes.base,
    borderRadius: theme.sizes.base,
    borderColor: "white",
    borderWidth: 3,
    backgroundColor: theme.colors.secondary
  },
  toggles: {
    marginTop: 10,
    paddingHorizontal: theme.sizes.base * 2
  }
});
