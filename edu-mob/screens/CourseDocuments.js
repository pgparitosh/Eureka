import React, { Component } from 'react'
import { Dimensions, Image, StyleSheet, ScrollView, FlatList, TouchableOpacity, Alert, Linking } from 'react-native';
import { Block, Text, Card, Button } from '../components';
import { mocks, theme } from '../constants';
import * as WebBrowser from 'expo-web-browser';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as FileSystem from 'expo-file-system';

const { width } = Dimensions.get('window');

class CourseDocuments extends Component {

    state = {
        documents: [],
    };

    openDocument(url) {
        //this.props.parentNav.navigate('PdfViewer', {url: url});
        WebBrowser.openBrowserAsync(url);
    }

    componentDidMount() {
        // make a service call to get all the videos for the particular course
        this.setState({ documents: mocks.documents });
    }

    render() {
        const docs = mocks.documents;

        return (
            <Block>
                <Block>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <FlatList
                            pagingEnabled
                            scrollEnabled
                            showsHorizontalScrollIndicator={false}
                            snapToAlignment="center"
                            data={docs}
                            keyExtractor={(item, index) => `${index}`}
                            renderItem={({ item }) => (
                                <Card shadow style={styles.category}>
                                    <TouchableOpacity style={styles.courseContainer} onPress={() => this.openDocument(item.documentUrl)}>
                                        <Block style={styles.imageBlock}>
                                            <Image source={require('../assets/icons/pdf.png')} style={{ height: 45, width: 45 }} />
                                        </Block>
                                        <Block style={styles.textBlock}>
                                            <Text size={14}>{item.documentTitle}</Text>
                                        </Block>
                                    </TouchableOpacity>
                                </Card>
                            )}
                        />
                    </ScrollView>
                </Block>
            </Block>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: theme.sizes.base * 2,
        marginBottom: 10,
    },
    category: {
        marginLeft: 10,
        marginRight: 10,
        minWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
        maxWidth: (width - theme.sizes.base),
        maxHeight: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
    },
    courseContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start"
    },
    imageBlock: {
        flex: 0.2,
        justifyContent: "center",
        alignContent: "center",
    },
    textBlock: {
        flex: 0.7,
        justifyContent: "center",
        // alignContent: "center",
    },
    downloadBlock: {
        flex: 0.1,
        justifyContent: "center",
        alignContent: "center",
    }
});

export default CourseDocuments;