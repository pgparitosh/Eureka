import React, { Component } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  AsyncStorage
} from "react-native";
import Constants from "expo-constants";

import AuthService from "../services/AuthService";
import { Button, Block, Input, Text } from "../components";
import { theme } from "../constants";

const { width, height } = Dimensions.get("window");

const VALID_MOBILE = "";
const VALID_PASSWORD = "";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  state = {
    mobile: VALID_MOBILE,
    password: VALID_PASSWORD,
    errors: [],
    loading: false
  };

  async handleLogin() {
    this.setState({ loading: true });
    const { navigation } = this.props;
    const { mobile, password } = this.state;
    const errors = [];

    Keyboard.dismiss();

    // check with backend API or with some static data
    if (mobile.trim() === "") {
      errors.push("mobile");
    }
    if (password.trim() === "") {
      errors.push("password");
    }

    if (!errors.length) {
      // Make service call. If service call is successful, navigate user to the application
      var inputObj = {
        json: {
          username: mobile,
          password: password,
          installation_id: Constants.installationId,
          device_name: Constants.deviceName
        }
      };
      AuthService.login(JSON.stringify(inputObj))
        .then(res => {
          if (res.status) {
            // navigate the user to the main app
            let apiKey = res.api_key;
            AsyncStorage.setItem("userToken", apiKey)
              .then(() => {
                navigation.navigate("BasicDetails");
              })
              .catch(error => {
                this.setState({ loading: false });
                console.log(error);
              });
          } else {
            this.setState({ loading: false });
            Alert.alert("Failed!", res.message);
          }
        })
        .catch(error => {
          console.log(error);
          this.setState({ loading: false });
          Alert.alert("An error has occured. Please try again.");
        });
    } else {
      this.setState({ errors, loading: false });
    }
  }

  render() {
    const { navigation } = this.props;
    const { loading, errors } = this.state;
    const hasErrors = key => (errors.includes(key) ? styles.hasErrors : null);
    return (
      <KeyboardAvoidingView style={styles.login} behavior="padding">
        <Block padding={[0, theme.sizes.base * 2]}>
          <Text h2 bold>
            Login
          </Text>
          <Block middle>
            <Input
              label="Mobile Number"
              error={hasErrors("mobile")}
              number
              style={[styles.input, hasErrors("mobile")]}
              defaultValue={this.state.mobile}
              onChangeText={text => this.setState({ mobile: text })}
            />
            <Input
              secure
              label="Password"
              error={hasErrors("password")}
              style={[styles.input, hasErrors("password")]}
              defaultValue={this.state.password}
              onChangeText={text => this.setState({ password: text })}
            />
            <Button gradient onPress={() => this.handleLogin()}>
              {this.state.loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text bold white center>
                  Login
                </Text>
              )}
            </Button>
            <Button onPress={() => navigation.navigate("Forgot")}>
              <Text
                gray
                caption
                center
                style={{ textDecorationLine: "underline" }}
              >
                Forgot your password?
              </Text>
            </Button>
          </Block>
        </Block>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  login: {
    flex: 1,
    justifyContent: "center"
  },
  input: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  hasErrors: {
    borderBottomColor: theme.colors.accent
  }
});
