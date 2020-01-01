import React, { Component } from "react";
import {
  Animated,
  Dimensions,
  Image,
  FlatList,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator
} from "react-native";
import * as Facebook from "expo-facebook";
import * as Google from "expo-google-app-auth";
import { Button, Block, Text } from "../components";
import { theme } from "../constants";
import AuthService from "../services/AuthService";
import { DOMAIN } from "../constants/applicationConstants";

const { width, height } = Dimensions.get("window");
const FacebookAppId = "379158996129505";
const GoogleAndroidId =
  "730844057336-j04q7fia9euj1fvfgh93l7s89vb3ttas.apps.googleusercontent.com";
const GoogleExpoId =
  "730844057336-f3qji8ilvgftue1d1gfonintoqoigdob.apps.googleusercontent.com";

const googleConfig = {
  expoClientId: GoogleExpoId,
  androidClientId: GoogleAndroidId
};

class Welcome extends Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    header: null
  };

  scrollX = new Animated.Value(0);

  state = {
    showTerms: false,
    banners: []
  };

  componentDidMount() {
    AuthService.getBanners()
      .then(res => {
        if (res.status) {
          var banners = [];
          var rawBanners = res.data;
          if (rawBanners && rawBanners.length > 0) {
            var index = 0;
            rawBanners.forEach(element => {
              var banner = {
                id: index,
                source: DOMAIN + element
              };
              banners.push(banner);
              ++index;
            });
            this.setState({ banners: banners });
          }
        } else {
          Alert.alert(
            "Error!",
            "Something went wrong. Please try again after sometime"
          );
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  async loginWithFacebook() {
    try {
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions
      } = await Facebook.logInWithReadPermissionsAsync(FacebookAppId, {
        permissions: ["public_profile"]
      });
      if (type === "success") {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}`
        );
        // Make a service call to save the response on server and navigate to app
        Alert.alert("Logged in!", `Hi ${(await response.json()).name}!`);

        this.props.navigation.navigate("BrowseStudent");
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  async loginWithGoogle() {
    try {
      const { type, accessToken, user } = await Google.logInAsync(googleConfig);

      if (type === "success") {
        // Then you can use the Google REST API
        let userInfoResponse = await fetch(
          "https://www.googleapis.com/userinfo/v2/me",
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
        console.log(await userInfoResponse.json());
      }
    } catch ({ message }) {
      alert(`Google Login Error: ${message}`);
    }
  }

  renderTermsService() {
    return (
      <Modal
        animationType="slide"
        visible={this.state.showTerms}
        onRequestClose={() => this.setState({ showTerms: false })}
      >
        <Block
          padding={[theme.sizes.padding * 2, theme.sizes.padding]}
          space="between"
        >
          <Text h2 light>
            Terms of Service
          </Text>

          <ScrollView style={{ marginVertical: theme.sizes.padding }}>
            <Text
              caption
              gray
              height={24}
              style={{ marginBottom: theme.sizes.base }}
            >
              1. Your use of the Service is at your sole risk. The service is
              provided on an "as is" and "as available" basis.
            </Text>
            <Text
              caption
              gray
              height={24}
              style={{ marginBottom: theme.sizes.base }}
            >
              2. Support for Expo services is only available in English, via
              e-mail.
            </Text>
            <Text
              caption
              gray
              height={24}
              style={{ marginBottom: theme.sizes.base }}
            >
              3. You understand that Expo uses third-party vendors and hosting
              partners to provide the necessary hardware, software, networking,
              storage, and related technology required to run the Service.
            </Text>
            <Text
              caption
              gray
              height={24}
              style={{ marginBottom: theme.sizes.base }}
            >
              4. You must not modify, adapt or hack the Service or modify
              another website so as to falsely imply that it is associated with
              the Service, Expo, or any other Expo service.
            </Text>
            <Text
              caption
              gray
              height={24}
              style={{ marginBottom: theme.sizes.base }}
            >
              5. You may use the Expo Pages static hosting service solely as
              permitted and intended to host your organization pages, personal
              pages, or project pages, and for no other purpose. You may not use
              Expo Pages in violation of Expo's trademark or other rights or in
              violation of applicable law. Expo reserves the right at all times
              to reclaim any Expo subdomain without liability to you.
            </Text>
            <Text
              caption
              gray
              height={24}
              style={{ marginBottom: theme.sizes.base }}
            >
              6. You agree not to reproduce, duplicate, copy, sell, resell or
              exploit any portion of the Service, use of the Service, or access
              to the Service without the express written permission by Expo.
            </Text>
            <Text
              caption
              gray
              height={24}
              style={{ marginBottom: theme.sizes.base }}
            >
              7. We may, but have no obligation to, remove Content and Accounts
              containing Content that we determine in our sole discretion are
              unlawful, offensive, threatening, libelous, defamatory,
              pornographic, obscene or otherwise objectionable or violates any
              party's intellectual property or these Terms of Service.
            </Text>
            <Text
              caption
              gray
              height={24}
              style={{ marginBottom: theme.sizes.base }}
            >
              8. Verbal, physical, written or other abuse (including threats of
              abuse or retribution) of any Expo customer, employee, member, or
              officer will result in immediate account termination.
            </Text>
            <Text
              caption
              gray
              height={24}
              style={{ marginBottom: theme.sizes.base }}
            >
              9. You understand that the technical processing and transmission
              of the Service, including your Content, may be transferred
              unencrypted and involve (a) transmissions over various networks;
              and (b) changes to conform and adapt to technical requirements of
              connecting networks or devices.
            </Text>
            <Text
              caption
              gray
              height={24}
              style={{ marginBottom: theme.sizes.base }}
            >
              10. You must not upload, post, host, or transmit unsolicited
              e-mail, SMSs, or "spam" messages.
            </Text>
          </ScrollView>

          <Block middle padding={[theme.sizes.base / 2, 0]}>
            <Button
              gradient
              onPress={() => this.setState({ showTerms: false })}
            >
              <Text center white>
                I understand
              </Text>
            </Button>
          </Block>
        </Block>
      </Modal>
    );
  }

  renderIllustrations() {
    const illustrations = this.state.banners;
    if (illustrations.length === 0)
      return (
        <ActivityIndicator
          style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
        />
      );

    return (
      <FlatList
        horizontal
        pagingEnabled
        scrollEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        snapToAlignment="center"
        data={illustrations}
        extraDate={this.state}
        keyExtractor={(item, index) => {
          return index.toString();
        }}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.source }}
            resizeMode="contain"
            style={{
              width,
              height: height / 2.8,
              overflow: "visible",
              marginTop: theme.sizes.base
            }}
          />
        )}
        onScroll={Animated.event([
          {
            nativeEvent: { contentOffset: { x: this.scrollX } }
          }
        ])}
      />
    );
  }

  renderSteps() {
    const illustrations = this.state.banners;
    if (illustrations && illustrations.length === 0) return null;
    const stepPosition = Animated.divide(this.scrollX, width);
    return (
      <Block row center middle style={styles.stepsContainer}>
        {illustrations.map((item, index) => {
          const opacity = stepPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.4, 1, 0.4],
            extrapolate: "clamp"
          });

          return (
            <Block
              animated
              flex={false}
              key={`step-${index}`}
              color="gray"
              style={[styles.steps, { opacity }]}
            />
          );
        })}
      </Block>
    );
  }

  render() {
    const { navigation } = this.props;

    return (
      <Block>
        <Block center bottom flex={0.4}>
          <Text h1 center bold>
            Education
            <Text h1 primary>
              {" "}
              Anywhere.
            </Text>
          </Text>
          <Text h3 gray2 style={{ marginTop: theme.sizes.padding / 2 }}>
            Learn Anytime.
          </Text>
        </Block>
        <Block center middle>
          {this.renderIllustrations()}
          {this.renderSteps()}
        </Block>
        <Block middle flex={1} margin={[0, theme.sizes.padding]}>
          <Button
            color={theme.colors.accent}
            onPress={this.loginWithGoogle.bind(this)}
          >
            <Text center semibold white>
              Login with Google
            </Text>
          </Button>
          <Button color={"#29487d"} onPress={this.loginWithFacebook.bind(this)}>
            <Text center semibold white>
              Login with Facebook
            </Text>
          </Button>
          <Button gradient onPress={() => navigation.navigate("Login")}>
            <Text center semibold white>
              Login using Mobile
            </Text>
          </Button>
          <Button shadow onPress={() => navigation.navigate("SignUp")}>
            <Text center semibold>
              Signup using Mobile
            </Text>
          </Button>
          <Button onPress={() => this.setState({ showTerms: true })}>
            <Text center caption gray>
              Terms of service
            </Text>
          </Button>
        </Block>
        {this.renderTermsService()}
      </Block>
    );
  }
}

export default Welcome;

const styles = StyleSheet.create({
  stepsContainer: {
    position: "absolute",
    bottom: theme.sizes.base * 2,
    right: 0,
    left: 0
  },
  steps: {
    width: 5,
    height: 5,
    borderRadius: 5,
    marginHorizontal: 2.5
  }
});
