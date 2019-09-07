import React, { Component } from "react";
import { StyleSheet, Picker, Keyboard, Dimensions } from "react-native";
import { Block, Button, Text, Input } from "../components";
import { theme, mocks } from "../constants";

const { width } = Dimensions.get("window");

export default class BasicDetails extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    firstName: "Paritosh",
    lastName: "Gohel",
    gender: "",
    academicPreference: "",
    errors: []
  };

  componentDidMount() {
    // make a service call to get the first name and last name if the user chose to log in with google or facebook
    // set the same to state to display it to the user
  }

  handleSave() {
    const { navigation } = this.props;
    const { firstName, lastName, academicPreference } = this.state;
    const errors = [];

    Keyboard.dismiss();
    this.setState({ loading: true });

    // check with backend API or with some static data
    if (firstName.trim() === "") {
      errors.push("firstName");
    }
    if (lastName.trim() === "") {
      errors.push("lastName");
    }

    this.setState({ errors, loading: false });

    if (!errors.length) {
      // Make service call. If service call is successful, navigate user to the application
      navigation.navigate("Subscribe");
    }
  }

  render() {
    const academicPreferences = mocks.academicPreferences;
    const { loading, errors } = this.state;
    const hasErrors = key => (errors.includes(key) ? styles.hasErrors : null);

    return (
      <Block padding={[0, theme.sizes.base * 2]}>
        <Text h2 bold>
          Basic Details
        </Text>
        <Block middle>
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
          <Text gray2 style={styles.pickerText}>
            Gender
          </Text>
          <Picker
            selectedValue={this.state.gender}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ gender: itemValue })
            }
          >
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
          <Text gray2 style={styles.pickerText}>
            Academic Preference
          </Text>
          <Picker
            selectedValue={this.state.academicPreference}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ academicPreference: itemValue })
            }
          >
            {academicPreferences.map(preference => {
              return (
                <Picker.Item
                  label={preference.preferenceText}
                  value={preference.value}
                  key={preference.id}
                />
              );
            })}
          </Picker>
          <Text size={12} gray style={styles.disclaimerText}>
            **Please double check your academic preference. Once selected, your
            subscription model cannot be changed. You may need to purchase a new
            subscription model to update academic preference.
          </Text>
          <Button gradient onPress={() => this.handleSave()}>
            <Text bold white center>
              Save
            </Text>
          </Button>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  hasErrors: {
    borderBottomColor: theme.colors.accent
  },
  picker: {
    width: width,
    padding: 0,
    marginBottom: 10
  },
  pickerText: {
    marginTop: 15,
    marginBottom: 5
  },
  disclaimerText: {
    marginTop: 15,
    marginBottom: 15
  }
});
