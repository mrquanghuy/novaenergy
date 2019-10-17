import React, { PureComponent } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

class ProgressBar extends PureComponent {
    render() {
        if (!this.props.loading) return null;
        return (
            <View style={[styles.progressBar, { ...this.props.style }]}>
                <ActivityIndicator
                    color={this.props.color}
                    size={this.props.size}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    progressBar: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default ProgressBar;
