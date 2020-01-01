import React from 'react';
import { Image } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import Welcome from '../screens/Welcome';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Forgot from '../screens/Forgot';
import BrowseStudent from '../screens/BrowseStudent';
import CourseList from '../screens/CourseList';
import CourseDetails from '../screens/CourseDetails';
import Settings from '../screens/Settings';
import VideoPlayerComp from '../screens/VideoPlayerComp';
import PdfViewer from '../screens/PdfViewer';
import Subscribe from '../screens/Subscribe';
import BasicDetails from '../screens/BasicDetails';
import Downloads from '../screens/Downloads';

import { theme } from '../constants';

const screens = createStackNavigator({
  Welcome,
  Login,
  SignUp,
  Forgot,
  BrowseStudent,
  CourseList,
  CourseDetails,
  Settings,
  VideoPlayerComp,
  PdfViewer,
  Subscribe,
  BasicDetails,
  Downloads
}, {
  defaultNavigationOptions: {
    headerStyle: {
      height: theme.sizes.base * 3.5,
      backgroundColor: theme.colors.white, // or 'white
      borderBottomColor: "transparent",
      elevation: 0, // for android
    },
    headerBackImage: <Image source={require('../assets/icons/back.png')} />,
    headerBackTitle: null,
    headerLeftContainerStyle: {
      alignItems: 'center',
      marginLeft: theme.sizes.base * 1.5,
      paddingRight: theme.sizes.base,
    },
    headerRightContainerStyle: {
      alignItems: 'center',
      paddingRight: theme.sizes.base,
    },
    // headerRight: () => (
    //   <Image
    //     style={{ height: 30, width: 150, marginRight: 10 }}
    //     resizeMode="stretch"
    //     resizeMethod="resize"
    //     source={require("../assets/header-right.png")}
    //   />
    // )
  }
});

export default createAppContainer(screens);