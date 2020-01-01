import React, { Component } from "react";
import {
  Alert,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Image,
  Dimensions
} from "react-native";
import Constants from "expo-constants";

import { Button, Block, Input, Text } from "../components";
import { theme } from "../constants";
import AuthService from "../services/AuthService";

const { width, height } = Dimensions.get("window");

export default class SignUp extends Component {
  state = {
    mobile: "",
    firstName: "",
    lastName: "",
    password: "",
    errors: [],
    loading: false
  };

  handleSignUp() {
    this.setState({ loading: true });
    const { navigation } = this.props;
    const { mobile, password, firstName, lastName } = this.state;
    const errors = [];

    Keyboard.dismiss();
    this.setState({ loading: true });

    // check with backend API or with some static data
    if (mobile.trim() === "") errors.push("mobile");
    if (password.trim() === "") errors.push("password");
    if (firstName.trim() === "") errors.push("firstName");
    if (lastName.trim() === "") errors.push("lastName");

    if (!errors.length) {
      var inputObj = {
        json: {
          firstname: firstName,
          lastname: lastName,
          mobile: mobile,
          password: password,
          installation_id: Constants.installationId,
          device_name: Constants.deviceName
        }
      };
      AuthService.signUp(JSON.stringify(inputObj))
        .then(res => {
          if (res.status) {
            this.setState({ loading: false });
            Alert.alert(
              "Success!",
              "Your account has been created",
              [
                {
                  text: "Continue",
                  onPress: () => {
                    navigation.navigate("BasicDetails");
                  }
                }
              ],
              { cancelable: false }
            );
          } else {
            this.setState({ loading: false });
            Alert.alert("Failed!", res.message);
          }
        })
        .catch(error => {
          console.log(error);
          this.setState({ loading: false });
          Alert.alert(
            "Failed!",
            "Something went wrong. Please try again after some time."
          );
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
      <KeyboardAvoidingView style={styles.signup} behavior="padding">
        <Block padding={[0, theme.sizes.base * 2]}>
          <Text h2 bold>
            Sign Up
          </Text>
          <Block>
            {/* <Image
              source={require("../assets/images/illustration_2.png")}
              resizeMode="contain"
              style={{
                width,
                height: height / 4,
                alignSelf: "center",
                marginBottom: 10
              }}
            /> */}
            <Input
              label="First Name"
              error={hasErrors("firstName")}
              style={[styles.input, hasErrors("firstName")]}
              defaultValue={this.state.firstName}
              onChangeText={text => this.setState({ firstName: text })}
            />
            <Input
              label="Last Name"
              error={hasErrors("lastName")}
              style={[styles.input, hasErrors("lastName")]}
              defaultValue={this.state.lastName}
              onChangeText={text => this.setState({ lastName: text })}
            />
            <Input
              label="Mobile Number"
              number
              error={hasErrors("mobile")}
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
            <Button gradient onPress={() => this.handleSignUp()}>
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text bold white center>
                  Sign Up
                </Text>
              )}
            </Button>

            <Button onPress={() => navigation.navigate("Login")}>
              <Text
                gray
                caption
                center
                style={{ textDecorationLine: "underline" }}
              >
                Back to Login
              </Text>
            </Button>
          </Block>
        </Block>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  signup: {
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
