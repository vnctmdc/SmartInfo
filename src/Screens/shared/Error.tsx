import React, { Component } from "react";
import { Text, View, Button } from "react-native";

export default class Error extends Component<any, any> {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text> Lỗi: {this.props.navigation.getParam("Message")} </Text>
                <Button title="Quay lại" onPress={() => this.props.navigation.goBack()} />
            </View>
        );
    }
}
