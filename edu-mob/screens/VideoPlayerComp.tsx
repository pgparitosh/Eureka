import { Color } from 'csstype'
{/* 
// @ts-ignore */}
import { PlaybackObject, PlaybackStatus, VideoProps, ScreenOrientation } from 'expo'
import { Video } from 'expo-av'
import React, { ReactNode } from 'react'
import {
    Animated,
    Dimensions,
    GestureResponderEvent,
    LayoutChangeEvent,
    NetInfo,
    Slider,
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps,
    TouchableWithoutFeedback,
    View,
    ViewProps,
    ViewStyle,
    StatusBar,
    BackHandler,
    Modal,
    Picker
} from 'react-native'
import AbortController from 'abort-controller';
import {
    FullscreenEnterIcon,
    FullscreenExitIcon,
    PauseIcon,
    PlayIcon,
    ReplayIcon,
    Spinner,
    PlaybackSpeedIcon
} from '../assets/video/icons/icons'
import { Block, Button, Text } from '../components';

const IOS_TRACK_IMAGE = require('../assets/video/icons/track.png')
const IOS_THUMB_IMAGE = require('../assets/video/icons/thumb.png')
const SLIDER_COLOR: Color = '#009485'
const BUFFERING_SHOW_DELAY = 200

// UI states
enum ControlStates {
    Shown,
    Showing,
    Hidden,
    Hiding,
}

enum PlaybackStates {
    Loading,
    Playing,
    Paused,
    Buffering,
    Error,
    Ended,
}

enum SeekStates {
    NotSeeking,
    Seeking,
    Seeked,
}

enum ErrorSeverity {
    Fatal,
    NonFatal,
}

interface IError {
    type: ErrorSeverity,
    message: string,
    obj: object,
}

interface State {
    playbackState: PlaybackStates,
    lastPlaybackStateUpdate: number,
    // Seeking state
    seekState: SeekStates,
    // State comes from the playbackCallback
    playbackInstancePosition: number,
    playbackInstanceDuration: number,
    shouldPlay: boolean,
    // Error message if we are in PlaybackStates.Error
    error: string,
    // Controls display state
    controlsOpacity: Animated.Value,
    controlsState: ControlStates,
    sliderWidth: number
    isConnected: boolean,
    playbackSpeed: number,
    modalVisible: boolean,
    url: string,
}

const createPropsGetter = <DP extends object>(dp: DP) => {
    return <P extends Partial<DP>>(props: P) => {
        type PropsExcludingDefaults = Pick<P, Exclude<keyof P, keyof DP>>

        type RecomposedProps = DP & PropsExcludingDefaults
        // tslint:disable-next-line:no-any
        return (props as any) as RecomposedProps
    }
}

const defaultProps = {
    children: null as ReactNode,
    // Animations
    fadeInDuration: 200 as number,
    fadeOutDuration: 1000 as number,
    quickFadeOutDuration: 200 as number,
    hideControlsTimerDuration: 4000 as number,
    // Icons
    playIcon: PlayIcon as () => JSX.Element,
    replayIcon: ReplayIcon as () => JSX.Element,
    pauseIcon: PauseIcon as () => JSX.Element,
    spinner: Spinner as () => JSX.Element,
    fullscreenEnterIcon: FullscreenEnterIcon as () => JSX.Element,
    fullscreenExitIcon: FullscreenExitIcon as () => JSX.Element,
    playbackSpeedIcon: PlaybackSpeedIcon as () => JSX.Element,
    // Appearance
    showFullscreenButton: true as boolean,
    iosThumbImage: IOS_THUMB_IMAGE,
    iosTrackImage: IOS_TRACK_IMAGE,
    textStyle: {
        color: '#FFF',
        fontSize: 12,
    } as TextStyle,
    // Callbacks
    debug: false as boolean,
    playbackCallback: (callback: PlaybackStatus) => undefined as void,
    errorCallback: (error: IError) =>
        console.error('Error: ', error.message, error.type, error.obj) as void,
    switchToLandscape: () =>
        console.warn(`Pass in this function 'switchToLandscape' 
    in props to enable fullscreening`) as void,
    switchToPortrait: () =>
        console.warn(`Pass in this function 'switchToPortrait' 
    in props to enable fullscreening`) as void,
    showControlsOnLoad: false as boolean,
    sliderColor: SLIDER_COLOR as Color,
    // Expo props
    videoProps: {} as VideoProps
}

type Props = {
    isPortrait: boolean
} & Partial<DefaultProps>
type DefaultProps = Readonly<typeof defaultProps>
const getProps = createPropsGetter(defaultProps)


export default class VideoPlayerComp extends React.Component<Props, State> {

    // abortController = new AbortController();

    static navigationOptions = {
        header: null,
    }

    private shouldPlayAtEndOfSeek: boolean = false
    private playbackInstance: PlaybackObject | null = null
    private showingAnimation: Animated.CompositeAnimation | null = null
    private hideAnimation: Animated.CompositeAnimation | null = null
    private controlsTimer: number | null = null

    static defaultProps = defaultProps

    constructor(props: Props) {
        super(props)

        const { videoProps, showControlsOnLoad } = getProps(props)

        if (videoProps && videoProps.source === null) {
            console.error('`Source` is a required property')
            throw new Error('`Source` is required')
        }

        this.state = {
            // Playback state
            playbackState: PlaybackStates.Loading,
            lastPlaybackStateUpdate: Date.now(),
            // Seeking state
            seekState: SeekStates.NotSeeking,
            // State comes from the playbackCallback
            playbackInstancePosition: 0,
            playbackInstanceDuration: 1,
            playbackSpeed: 1,
            modalVisible: false,
            shouldPlay: false,
            // Error message if we are in PlaybackStates.Error
            error: '',
            // Controls display state
            controlsOpacity: new Animated.Value(showControlsOnLoad ? 1 : 0),
            controlsState: showControlsOnLoad
                ? ControlStates.Shown
                : ControlStates.Hidden,
            sliderWidth: 0,
            isConnected: true,
            url: '',
        }
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.videoProps && nextProps.videoProps.source == null) {
            throw new Error('`Source` is a required property')
        }
    }

    async componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        {/* 
        // @ts-ignore */}
        ScreenOrientation.lockAsync(ScreenOrientation.Orientation.PORTRAIT);
        {/* 
        // @ts-ignore */}
        this.props.navigation.goBack();
        return true;
    }


    componentDidMount() {
         {/* 
        // @ts-ignore */}
        const { params } = this.props.navigation.state;
        this.setState({ url: params.url });
        StatusBar.setHidden(true);
        {/* 
        // @ts-ignore */}
        ScreenOrientation.lockAsync(ScreenOrientation.Orientation.LANDSCAPE);
        const { errorCallback } = getProps(this.props)
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange)

        if (this.state.controlsState === ControlStates.Shown) {
            this.resetControlsTimer()
        }
    }

    componentWillUnmount() {
        StatusBar.setHidden(false);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
        // this.abortController.abort();
    }

    private handleConnectivityChange = (isConnected: boolean) => {
        const { debug } = getProps(this.props)

        if (isConnected) {
            this.setState({ isConnected })
        } else {
            this.setState({ isConnected })
        }

        debug && console.log(`User is ${isConnected ? 'on' : 'off'}line`)
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    updatePlaybackSpeed() {
        this.setState({ modalVisible: false });
    }

    // Handle events during playback
    private setPlaybackState = (playbackState: PlaybackStates) => {
        const { debug } = getProps(this.props)
        if (this.state.playbackState !== playbackState) {
            debug &&
                console.log(
                    '[playback]',
                    this.state.playbackState,
                    ' -> ',
                    playbackState,
                    ' [seek] ',
                    this.state.seekState,
                    ' [shouldPlay] ',
                    this.state.shouldPlay
                )

            this.setState({ playbackState, lastPlaybackStateUpdate: Date.now() })
        }
    }

    private setSeekState = (seekState: SeekStates) => {
        const { debug } = getProps(this.props)

        debug &&
            console.log(
                '[seek]',
                this.state.seekState,
                ' -> ',
                seekState,
                ' [playback] ',
                this.state.playbackState,
                ' [shouldPlay] ',
                this.state.shouldPlay
            )

        this.setState({ seekState })

        // Don't keep the controls timer running when the state is seeking
        if (seekState === SeekStates.Seeking) {
            this.controlsTimer && clearTimeout(this.controlsTimer)
        } else {
            // Start the controlFs timer anew
            this.resetControlsTimer()
        }
    }

    private playbackCallback = (status: PlaybackStatus) => {
        const { errorCallback, playbackCallback } = getProps(this.props)

        try {
            playbackCallback(status)
        } catch (e) {
            console.error('Uncaught error when calling props.playbackCallback', e)
        }

        if (!status.isLoaded) {
            if (status.error) {
                this.setPlaybackState(PlaybackStates.Error)
                const errorMsg = `Encountered a fatal error during playback: ${status.error}`
                this.setState({
                    error: errorMsg,
                })
                errorCallback({ type: ErrorSeverity.Fatal, message: errorMsg, obj: {} })
            }
        } else {
            // Update current position, duration, and `shouldPlay`
            this.setState({
                playbackInstancePosition: status.positionMillis || 0,
                playbackInstanceDuration: status.durationMillis || 0,
                shouldPlay: status.shouldPlay,
            })

            // Figure out what state should be next (only if we are not seeking,
            // other the seek action handlers control the playback state, not this callback)
            if (
                this.state.seekState === SeekStates.NotSeeking &&
                this.state.playbackState !== PlaybackStates.Ended
            ) {
                if (status.didJustFinish && !status.isLooping) {
                    this.setPlaybackState(PlaybackStates.Ended)
                } else {
                    // If the video is buffering but there is no Internet, you go to the Error state
                    if (!this.state.isConnected && status.isBuffering) {
                        this.setPlaybackState(PlaybackStates.Error)
                        this.setState({
                            error:
                                'You are probably offline. Please make sure you are ' +
                                'connected to the Internet to watch this video',
                        })
                    } else {
                        this.setPlaybackState(
                            this.isPlayingOrBufferingOrPaused(status)
                        )
                    }
                }
            }
        }
    }

    // Seeking
    private getSeekSliderPosition = () => {
        if (
            this.playbackInstance !== null &&
            this.state.playbackInstancePosition !== null &&
            this.state.playbackInstanceDuration !== null
        ) {
            return (
                this.state.playbackInstancePosition /
                this.state.playbackInstanceDuration
            )
        }
        return 0
    }

    private onSeekSliderValueChange = async () => {
        if (
            this.playbackInstance !== null &&
            this.state.seekState !== SeekStates.Seeking
        ) {
            this.setSeekState(SeekStates.Seeking)
            // A seek might have finished (Seeked) but since we are not in NotSeeking yet, the `shouldPlay` flag is still false,
            // but we really want it be the stored value from before the previous seek
            this.shouldPlayAtEndOfSeek =
                this.state.seekState === SeekStates.Seeked
                    ? this.shouldPlayAtEndOfSeek
                    : this.state.shouldPlay
            // Pause the video
            await this.playbackInstance.setStatusAsync({ shouldPlay: false })
        }
    }

    private onSeekSliderSlidingComplete = async (value: number) => {
        const { debug } = getProps(this.props)

        if (this.playbackInstance !== null) {
            // Seeking is done, so go to Seeked, and set playbackState to Buffering
            this.setSeekState(SeekStates.Seeked)
            // If the video is going to play after seek, the user expects a spinner.
            // Otherwise, the user expects the play button
            this.setPlaybackState(
                this.shouldPlayAtEndOfSeek
                    ? PlaybackStates.Buffering
                    : PlaybackStates.Paused
            )
            try {
                const playback = await this.playbackInstance
                    .setStatusAsync({
                        positionMillis: value * this.state.playbackInstanceDuration,
                        shouldPlay: this.shouldPlayAtEndOfSeek,
                    })

                // The underlying <Video> has successfully updated playback position
                // TODO: If `shouldPlayAtEndOfSeek` is false, should we still set the playbackState to Paused?
                // But because we setStatusAsync(shouldPlay: false), so the playbackStatus return value will be Paused.
                this.setSeekState(SeekStates.NotSeeking)
                this.setPlaybackState(
                    this.isPlayingOrBufferingOrPaused(playback)
                )
            } catch (e) {
                debug && console.error('Seek error: ', e)
            }
        }
    }

    private isPlayingOrBufferingOrPaused = (status: PlaybackStatus) => {
        if (!status.isLoaded) {
            return PlaybackStates.Error
        }
        if (status.isPlaying) {
            return PlaybackStates.Playing
        }
        if (status.isBuffering) {
            return PlaybackStates.Buffering
        }

        return PlaybackStates.Paused
    }

    private onSeekBarTap = (e: GestureResponderEvent) => {
        if (
            !(
                this.state.playbackState === PlaybackStates.Loading ||
                this.state.playbackState === PlaybackStates.Ended ||
                this.state.playbackState === PlaybackStates.Error ||
                this.state.controlsState !== ControlStates.Shown
            )
        ) {
            const value = e.nativeEvent.locationX / this.state.sliderWidth
            this.onSeekSliderValueChange()
            this.onSeekSliderSlidingComplete(value)
        }
    }

    // Capture the width of the seekbar slider for use in `_onSeekbarTap`
    private onSliderLayout = (e: LayoutChangeEvent) => {
        this.setState({ sliderWidth: e.nativeEvent.layout.width })
    }

    // Controls view
    private getMMSSFromMillis = (millis: number) => {
        const totalSeconds = millis / 1000
        const seconds = Math.floor(totalSeconds % 60)
        const minutes = Math.floor(totalSeconds / 60)

        const padWithZero = (n: number) => {
            const str = n.toString()
            if (n < 10) {
                return '0' + str
            }
            return str
        }
        return padWithZero(minutes) + ':' + padWithZero(seconds)
    }

    // Controls Behavior
    private replay = async () => {
        if (this.playbackInstance !== null) {
            await this.playbackInstance
                .setStatusAsync({
                    shouldPlay: true,
                    positionMillis: 0,
                })

            // Update playbackState to get out of Ended state
            this.setState({ playbackState: PlaybackStates.Playing })
        }
    }

    private togglePlay = async () => {
        if (this.state.controlsState === ControlStates.Hidden) {
            return
        }
        const shouldPlay = this.state.playbackState !== PlaybackStates.Playing
        if (this.playbackInstance !== null) {
            await this.playbackInstance.setStatusAsync({ shouldPlay })
        }
    }

    private toggleControls = () => {
        switch (this.state.controlsState) {
            case ControlStates.Shown:
                // If the controls are currently Shown, a tap should hide controls quickly
                this.setState({ controlsState: ControlStates.Hiding })
                this.hideControls(true)
                break
            case ControlStates.Hidden:
                // If the controls are currently, show controls with fade-in animation
                this.showControls()
                this.setState({ controlsState: ControlStates.Showing })
                break
            case ControlStates.Hiding:
                // If controls are fading out, a tap should reverse, and show controls
                this.setState({ controlsState: ControlStates.Showing })
                this.showControls()
                break
            case ControlStates.Showing:
                // A tap when the controls are fading in should do nothing
                break
        }
    }

    private showControls = () => {
        const { fadeInDuration } = getProps(this.props)

        this.showingAnimation = Animated.timing(this.state.controlsOpacity, {
            toValue: 1,
            duration: fadeInDuration,
            useNativeDriver: true,
        })

        this.showingAnimation.start(({ finished }) => {
            if (finished) {
                this.setState({ controlsState: ControlStates.Shown })
                this.resetControlsTimer()
            }
        })
    }

    private hideControls = (immediate = false) => {
        const { quickFadeOutDuration, fadeOutDuration } = getProps(this.props)

        if (this.controlsTimer) {
            clearTimeout(this.controlsTimer)
        }
        this.hideAnimation = Animated.timing(this.state.controlsOpacity, {
            toValue: 0,
            duration: immediate
                ? quickFadeOutDuration
                : fadeOutDuration,
            useNativeDriver: true,
        })
        this.hideAnimation.start(({ finished }) => {
            if (finished) {
                this.setState({ controlsState: ControlStates.Hidden })
            }
        })
    }

    private onTimerDone = () => {
        // After the controls timer runs out, fade away the controls slowly
        this.setState({ controlsState: ControlStates.Hiding })
        this.hideControls()
    }

    private resetControlsTimer = () => {
        const { hideControlsTimerDuration } = getProps(this.props)

        if (this.controlsTimer) {
            clearTimeout(this.controlsTimer)
        }
        this.controlsTimer = setTimeout(() =>
            this.onTimerDone(),
            hideControlsTimerDuration
        )
    }

    render() {
        const videoUrl = this.state.url;
        if(videoUrl === undefined || videoUrl === null || videoUrl === '')  return null;
        const { width: maxWidth, height: maxHeight } = Dimensions.get('window')
        const centeredContentWidth = 60
        const screenRatio = maxWidth / maxHeight

        let videoHeight = maxHeight
        let videoWidth = videoHeight * screenRatio

        if (videoWidth > maxWidth) {
            videoWidth = maxWidth
            videoHeight = videoWidth / screenRatio
        }

        const {
            playIcon: PlayIconElem,
            pauseIcon: PauseIconElem,
            spinner: SpinnerElem,
            fullscreenEnterIcon: FullscreenEnterIconElem,
            fullscreenExitIcon: FullscreenExitIconElem,
            playbackSpeedIcon: PlaybackSpeedIconElem,
            replayIcon: ReplayIconElem,
            switchToLandscape,
            switchToPortrait,
            isPortrait,
            sliderColor,
            iosThumbImage,
            iosTrackImage,
            showFullscreenButton,
            textStyle,
            videoProps
        } = getProps(this.props)

        // Do not let the user override `ref`, `callback`, and `style`
        const {
            ref,
            style,
            onPlaybackStatusUpdate,
            // source = 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
            source = videoUrl,
            ...otherVideoProps
        } = videoProps


        const Control = (
            { callback, center, children, transparent = false, ...otherProps }:
                {
                    callback: () => void,
                    center: boolean,
                    children: ReactNode,
                    transparent?: boolean,
                    otherProps?: TouchableOpacityProps
                }) => (
                <TouchableOpacity
                    {...otherProps}
                    hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
                    onPress={() => {
                        this.resetControlsTimer()
                        callback()
                    }}>
                    <View
                        style={
                            center && {
                                backgroundColor: transparent ? 'transparent' : 'rgba(0, 0, 0, 0.4)',
                                justifyContent: 'center',
                                width: centeredContentWidth,
                                height: centeredContentWidth,
                                borderRadius: centeredContentWidth,
                            }
                        }>
                        {children}
                    </View>
                </TouchableOpacity>
            )

        const CenteredView = (
            { children, style: viewStyle, pointerEvents, ...otherProps }:
                {
                    children?: ReactNode,
                    style?: ViewStyle,
                    pointerEvents?: PointerEvent,
                    otherProps?: ViewProps
                }
        ) => (
                <Animated.View
                    {...otherProps}
                    style={[
                        {
                            position: 'absolute',
                            left: (videoWidth - centeredContentWidth) / 2,
                            top: (videoHeight - centeredContentWidth) / 2,
                            width: centeredContentWidth,
                            height: centeredContentWidth,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                        viewStyle,
                    ]}>
                    {children}
                </Animated.View>
            )

        const ErrorText = ({ text }: { text: string }) => (
            <View
                style={{
                    position: 'absolute',
                    top: videoHeight / 2,
                    width: videoWidth - 40,
                    marginRight: 20,
                    marginLeft: 20,
                }}>
                <Text style={[textStyle, { textAlign: 'center' }]}>
                    {text}
                </Text>
            </View>
        )

        return (
            <TouchableWithoutFeedback onPress={this.toggleControls}>
                <View
                    style={{ backgroundColor: 'black' }}>
                    <Video
                        source={{ uri: source }}
                        ref={component => {
                            this.playbackInstance = component
                            ref && ref(component)
                        }}
                        resizeMode="cover"
                        onPlaybackStatusUpdate={this.playbackCallback}
                        rate={this.state.playbackSpeed}
                        style={{
                            // alignSelf: "center",
                            width: maxWidth,
                            height: maxHeight,
                        }}
                        {...otherVideoProps}
                    />

                    {/* Spinner */}
                    {/* Due to loading Animation, it cannot use CenteredView */}
                    {((this.state.playbackState === PlaybackStates.Buffering
                        && Date.now() - this.state.lastPlaybackStateUpdate > BUFFERING_SHOW_DELAY)
                        || this.state.playbackState === PlaybackStates.Loading) && (
                            <View
                                style={[
                                    {
                                        position: 'absolute',
                                        left: (videoWidth - centeredContentWidth) / 2,
                                        top: (videoHeight - centeredContentWidth) / 2,
                                        width: centeredContentWidth,
                                        height: centeredContentWidth,
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    },
                                ]}>
                                <SpinnerElem />
                            </View>
                        )}

                    {/* Play/pause buttons */}
                    {(this.state.seekState !== SeekStates.Seeking) &&
                        (this.state.playbackState === PlaybackStates.Playing ||
                            this.state.playbackState === PlaybackStates.Paused) && (
                            <CenteredView
                                //@ts-ignore
                                pointerEvents={
                                    this.state.controlsState === ControlStates.Hidden
                                        ? 'none'
                                        : 'auto'
                                }
                                style={{
                                    //@ts-ignore
                                    opacity: this.state.controlsOpacity,
                                }}>
                                <Control center={true} callback={this.togglePlay}>
                                    {this.state.playbackState === PlaybackStates.Playing
                                        ? <PauseIconElem />
                                        : <PlayIconElem />
                                    }
                                </Control>
                            </CenteredView>
                        )}

                    {/* Replay button to show at the end of a video */}
                    {this.state.playbackState === PlaybackStates.Ended && (
                        <CenteredView>
                            <Control center={true} callback={this.replay}>
                                <ReplayIconElem />
                            </Control>
                        </CenteredView>
                    )}

                    {/* Error display */}
                    {this.state.playbackState === PlaybackStates.Error && (
                        <ErrorText text={this.state.error} />
                    )}

                    {/* Bottom bar */}
                    <Animated.View
                        pointerEvents={
                            this.state.controlsState === ControlStates.Hidden
                                ? 'none'
                                : 'auto'
                        }
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            width: maxWidth,
                            opacity: this.state.controlsOpacity,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingBottom: 4,
                            paddingHorizontal: 4
                        }}>
                        {/* Current time display */}
                        {/* <Control transparent={true}
                            center={false}
                            callback={() => {
                                this.setModalVisible(true);
                            }}>
                            <PlaybackSpeedIconElem />
                        </Control> */}
                        <Text
                            style={[
                                textStyle,
                                { backgroundColor: 'transparent', marginLeft: 5 },
                            ]}>
                            {this.getMMSSFromMillis(this.state.playbackInstancePosition)}
                        </Text>

                        {/* Seek bar */}
                        <TouchableWithoutFeedback
                            onLayout={this.onSliderLayout}
                            onPress={this.onSeekBarTap}>
                            <Slider
                                style={{ marginRight: 10, marginLeft: 10, flex: 1 }}
                                thumbTintColor={sliderColor}
                                minimumTrackTintColor={sliderColor}
                                trackImage={iosTrackImage}
                                thumbImage={iosThumbImage}
                                value={this.getSeekSliderPosition()}
                                onValueChange={this.onSeekSliderValueChange}
                                onSlidingComplete={this.onSeekSliderSlidingComplete}
                                disabled={
                                    this.state.playbackState === PlaybackStates.Loading ||
                                    this.state.playbackState === PlaybackStates.Ended ||
                                    this.state.playbackState === PlaybackStates.Error ||
                                    this.state.controlsState !== ControlStates.Shown
                                }
                            />
                        </TouchableWithoutFeedback>

                        {/* Duration display */}
                        <Text
                            style={[
                                textStyle,
                                { backgroundColor: 'transparent', marginRight: 5 },
                            ]}>
                            {this.getMMSSFromMillis(this.state.playbackInstanceDuration)}
                        </Text>
                        {/* <Picker
                            selectedValue={this.state.playbackSpeed}
                            style={[textStyle, { height: 20, width: 70, margin: 5, marginBottom: 10, backgroundColor: 'transparent' }]}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({ playbackSpeed: itemValue })
                            }
                        >
                            <Picker.Item label="1 x" value={1} />
                            <Picker.Item label="1.25 x" value={1.25} />
                            <Picker.Item label="1.5 x" value={1.5} />
                            <Picker.Item label="2 x" value={2} />
                            <Picker.Item label="4 x" value={4} />
                        </Picker> */}
                        {/* Fullscreen control */}
                        {showFullscreenButton &&
                            <Control
                                transparent={true}
                                center={false}
                                callback={() => {
                                    isPortrait
                                        ? switchToLandscape()
                                        : switchToPortrait()
                                }}>
                                {isPortrait
                                    ? <FullscreenEnterIconElem />
                                    : <FullscreenExitIconElem />
                                }
                            </Control>
                        }
                    </Animated.View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible}>
                        <View style={{
                            flex: 1,
                            position: "absolute",
                            bottom: 10,
                            left: 0,
                            // height: 30,
                            justifyContent: 'center',
                            backgroundColor: 'white',
                        }}>
                            {/* <View style={{ alignItems: 'center', }}>
                                <Picker
                                    selectedValue={this.state.playbackSpeed}
                                    style={{ height: 50, width: 100 }}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ playbackSpeed: itemValue, modalVisible: false, })
                                    }
                                >
                                    <Picker.Item label="1x" value="1" />
                                    <Picker.Item label="2x" value="2" />
                                </Picker>
                            </View> */}
                        </View>
                    </Modal>
                </View>

            </TouchableWithoutFeedback>
        )
    }
}