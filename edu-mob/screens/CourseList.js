import React, { Component } from 'react'
import { Dimensions, Image, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Block, Text, Card } from '../components';
import { theme, mocks } from '../constants';

const { width } = Dimensions.get('window');

class CourseList extends Component {

    state = {
        headerText: '',
        courses: null,
        category: null,
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        const category = params.category;
        // service call to get the courses of the category
        this.setState({ category: category, headerText: category.name, courses: mocks.coursesList });
    }

    render() {
        const coursesList = this.state.courses;
        if (coursesList === null) return null;
        return (
            <Block>
                <Block flex={false} row center space="between" style={styles.header}>
                    <Text h2 bold>{this.state.headerText}</Text>
                    <Image source={require('../assets/icons/search.png')} style={{ height: 22, width: 22, marginVertical: 5 }} />
                </Block>
                <Block style={{
                    marginVertical: theme.sizes.base,
                    marginHorizontal: theme.sizes.base,
                }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <FlatList
                            pagingEnabled
                            scrollEnabled
                            showsHorizontalScrollIndicator={false}
                            snapToAlignment="center"
                            data={coursesList}
                            keyExtractor={(item, index) => `${index}`}
                            renderItem={({ item }) => (
                                <Card shadow style={styles.category}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('CourseDetails', { course: item })} style={styles.courseContainer}>
                                        <Block style={styles.imageBlock}>
                                            <Image source={item.courseThumbnail} style={{ height: 45, width: 45 }} />
                                        </Block>
                                        <Block style={styles.textBlock}>
                                            <Text gray caption>{item.courseDesc}</Text>
                                            <Text medium height={20}>{item.courseName}</Text>
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
        // marginBottom: 10,
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
        flex: 0.8
    }
})

export default CourseList;