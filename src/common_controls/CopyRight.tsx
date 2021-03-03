import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'

export default class CopyRight extends Component {
    render() {
        return (
            <View style={styles.copyRight}>
                <Text style={{ fontSize: 18, color: '#fff' }}>Copyright © SoftMart 2020</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    copyRight: {
        backgroundColor: '#2EA8EE',
        padding: 7,
        alignItems: "center"
    }
});
