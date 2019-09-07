import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Block, Button, Text } from "../components";
import { theme } from "../constants";

export default class Subscribe extends Component {
  // static navigationOptions = {
  // header: <View style={{height: theme.sizes.base* 4}}></View>
  // }

  constructor(props) {
    super(props);
  }

  handleSubscription() {
    // show the details in a web view
    // make payment service call and send all the details
    // if successful navigate to the browse student courses page
    this.props.navigation.navigate('BrowseStudent');
  }

  render() {
    return (
      <Block padding={[0, theme.sizes.base * 2]}>
        <Text h2 bold>
          Choose Subscription Model
        </Text>
        {/* <Text small gray>Get your subscription model that suits your requirement</Text> */}
        <Block style={styles.subscriptionsBlock} middle>
          <Button gradient style={styles.buttonHeight} onPress={() => this.handleSubscription()}>
            <Block padding={[0, theme.sizes.base]}>
              <Text white h3 bold style={styles.buttonTextHead}>
                ₹99 for 1 Month
              </Text>
              <Text white size={13}>
                Get unlimited access to all our courses for your selected
                standard for 1 month. Maximum of 2 devices allowed.
              </Text>
            </Block>
          </Button>
          <Button gradient style={styles.buttonHeight} onPress={() => this.handleSubscription()}>
            <Block padding={[0, theme.sizes.base]}>
              <Text h3 white bold style={styles.buttonTextHead}>
                ₹499 for 6 Months
              </Text>
              <Text size={13} white>
                Get unlimited access to all our courses for your selected
                standard for 6 months. Maximum of 2 devices allowed.
              </Text>
            </Block>
          </Button>
          <Button gradient style={styles.buttonHeight} onPress={() => this.handleSubscription()}>
            <Block padding={[0, theme.sizes.base]}>
              <Text white h3 bold style={styles.buttonTextHead}>
                ₹899 for 1 Year
              </Text>
              <Text white size={13}>
                Get unlimited access to all our courses for your selected
                standard for an year. Maximum of 2 devices allowed.
              </Text>
            </Block>
          </Button>
          <Text center h3 bold>
            OR
          </Text>
          <Button gradient style={styles.buttonHeight} onPress={() => this.handleSubscription()}>
            <Block padding={[0, theme.sizes.base]}>
              <Text white h3 bold style={styles.buttonTextHead}>
                Try 1 Month for Free
              </Text>
              <Text white size={13}>
                Get unlimited access to all our courses for your selected
                standard for 1 month. Maximum of 2 devices allowed.
              </Text>
            </Block>
          </Button>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  subscriptionsBlock: {
    marginTop: 10
  },
  buttonHeight: {
    height: 140,
    elevation: 4
  },
  buttonTextHead: {
    marginBottom: 10,
    marginTop: 15
  }
});
