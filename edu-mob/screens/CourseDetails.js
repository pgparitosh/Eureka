import React, { Component } from 'react'
import { Dimensions, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'

import { Card, Badge, Button, Block, Text } from '../components';
import { theme, mocks } from '../constants';

import CourseDescription from './CourseDescription';
import CourseVideos from './CourseVideos';
import CourseDocuments from './CourseDocuments';

const { width } = Dimensions.get('window');

class CourseList extends Component {
    state = {
        active: 'Course Details',
        course: null,
        videos: [],
        documents: [],
        courseDetails: null,
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        // make service call
        this.setState({ course: params.course });
    }

    renderTabData() {
        const activeTab = this.state.active;
        if(activeTab === 'Course Details') {
            return <CourseDescription />;
        }
        else if(activeTab === 'Videos') {
            return <CourseVideos parentNav={this.props.navigation}/>;
        }
        else if(activeTab === 'Documents') {
            return <CourseDocuments parentNav={this.props.navigation}/>;
        }
        else {
            return null;
        }
    }

    handleTab = tab => {
        const { categories, mycourses } = this.props;
        if (tab === 'Course Details')
            this.setState({ active: tab, categories: mycourses });
        else
            this.setState({ active: tab, categories: categories });
    }

    renderTab(tab) {
        const { active } = this.state;
        const isActive = active === tab;

        return (
            <TouchableOpacity
                key={`tab-${tab}`}
                onPress={() => this.handleTab(tab)}
                style={[
                    styles.tab,
                    isActive ? styles.active : null
                ]}
            >
                <Text size={15} medium gray={!isActive} secondary={isActive}>
                    {tab}
                </Text>
            </TouchableOpacity>
        )
    }

    render() {
        const tabs = ['Course Details', 'Videos', 'Documents'];
        const course = this.state.course;

        if (course === null) return null;
        return (
            <Block>
                <Block flex={false} row center space="between" style={styles.header}>
                    <Text h2 bold>{course.courseName}</Text>
                </Block>
                <Block flex={false} row space="between" style={styles.tabs}>
                    {tabs.map(tab => this.renderTab(tab))}
                </Block>
                {this.renderTabData()}
            </Block>
        );
    }
}

export default CourseList;

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: theme.sizes.base * 2,
    },
    tabs: {
        borderBottomColor: theme.colors.gray2,
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginVertical: theme.sizes.base,
        marginHorizontal: theme.sizes.base * 2,
    },
    tab: {
        marginRight: theme.sizes.base * 2,
        paddingBottom: theme.sizes.base
    },
    active: {
        borderBottomColor: theme.colors.secondary,
        borderBottomWidth: 3,
    }
})