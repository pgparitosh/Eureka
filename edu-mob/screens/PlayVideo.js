import React from 'react';
import { StyleSheet, Text, View, Dimensions, BackHandler, WebView, Platform, StatusBar } from 'react-native';
import { ScreenOrientation } from 'expo';
import { theme, mocks } from '../constants';

export default class App extends React.Component {

    static navigationOptions = {
        header: null,
    }

    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    state = {
        mute: false,
        fullScreen: false,
        shouldPlay: true,
    }

    componentDidMount() {
        StatusBar.setHidden(true);
        ScreenOrientation.lockAsync(ScreenOrientation.Orientation.LANDSCAPE);
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        StatusBar.setHidden(false);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        ScreenOrientation.lockAsync(ScreenOrientation.Orientation.PORTRAIT);
        this.props.navigation.goBack();
        return true;
    }

    handlePlayAndPause = () => {
        this.setState(prevState => ({
            shouldPlay: !prevState.shouldPlay
        }));
    }

    handleVolume = () => {
        this.setState(prevState => ({
            mute: !prevState.mute,
        }));
    }

    render() {
        const { width, height } = Dimensions.get('window');

        return (
            <View style={styles.container}>
                <View>
                    <WebView
                        style={{ marginTop: (Platform.OS == 'ios') ? 20 : 0 }}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        scalesPageToFit={true}
                        source={{ uri: 'https://www.youtube.com/embed/WsAzKRjCnH8' }}
                        style={{ width: height, height: width }}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        height: 400,
    },
    controlBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    }
});