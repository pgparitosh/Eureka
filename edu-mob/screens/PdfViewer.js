import React, { Component } from 'react';
import { WebView } from 'react-native';

export default class PdfViewer extends Component {

    constructor(props) {
        super(props)
    }

    state = {
        document: null,
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        console.log(params.url);
        this.setState({ document: params.url });
    }

    render() {
        const document = this.state.document;
        // if (document.documentUrl === undefined || document.documentUrl === null || document.documentUrl === '') return null;
        return (
            <WebView source={{ uri: "http://docs.google.com/gview?embedded=true&url="+document }}
                style={{ flex: 1, marginTop: 20 }}>
            </WebView>
        );
    }
}