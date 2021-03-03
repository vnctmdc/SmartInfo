import React, { Component } from "react";
import { Text, StyleSheet, View, Button, TextInput } from "react-native";
import Modal from "react-native-modal";

interface iProp {
    modalVisible?: boolean;
    title?: string;
}
export default class PopupModal extends Component<iProp, any> {
    render() {
        return (
            <Modal                
                isVisible={this.props.modalVisible}
                animationIn="slideInDown"
                animationInTiming={400}
                animationOut="slideOutUp"
                animationOutTiming={400}
                backdropOpacity={0.5}
                backdropTransitionInTiming={0}
                backdropTransitionOutTiming={0}                
            >
                <View style={styles.container}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.title}>{this.props.title}</Text>
                    </View>
                    <View style={styles.modalBody}>{this.props.children}</View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 80,
        left: 0,
        right: 0,
        marginLeft: "5%",
        marginRight: "5%",
        borderRadius:10,
        shadowOpacity: 0.3,
        //marginTop: 64,
        //backgroundColor: "red",
    },
    modalHeader: {
        backgroundColor: "#FFF",
        height: 45,
        paddingLeft: 5,
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        justifyContent: "center",
    },
    modalBody: {
        padding: 10,
        backgroundColor: "white",
        borderColor: "#FFF",
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,

    },
    title: {
        fontSize: 20,
        textAlign: "center",
        color: "#3E2723",
        fontWeight:'bold',
    },
});
