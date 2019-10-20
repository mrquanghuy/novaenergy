import React, { Component } from 'react';
import { View, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

export default class Detail extends Component {
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <WebView
                    source={{ uri: 'http://novaenergy.vn/plugin/api/v1/result_report?key_auth=123&prefix=648eade5130d567e21c8436252d90270' }}
                    style={{ flex: 1 }}
                    allowsBackForwardNavigationGestures={true}
                    startInLoadingState={true}
                    // renderLoading={this.renderLoading}
                    showsVerticalScrollIndicator={false}
                    allowsFullscreenVideo={true}
                    allowsInlineMediaPlayback={true}
                />
            </SafeAreaView>
        )
    }
}
