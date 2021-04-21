import React, { Component } from "react";
import { Text, StyleSheet, View, Button, TextInput, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface iProp {
    modalVisible: boolean;
    title?: string;
    resetState: () => void;
}

export default class PopupModalUpdateNote extends Component<iProp, any> {

    constructor(props) {
        super(props);
    }
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
                <KeyboardAvoidingView
                    behavior="padding" style={{ flex: 1 }}
                    keyboardVerticalOffset={-150}
                >
                    <View style={styles.container}>
                        <View style={[styles.modalHeader, { alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'gainsboro', backgroundColor: '#F1E0FF' }]}>
                            <View>
                                <Text style={styles.title}>{this.props.title}</Text>
                            </View>
                            <View style={{ marginRight: 3 }}>
                                <TouchableOpacity
                                    style={{
                                        paddingTop: 5,
                                        paddingRight: 8,
                                        justifyContent: "center",
                                    }}
                                    onPress={() => this.props.resetState()}
                                >
                                    <FontAwesome5 name="times" size={24} color="#FF3B30" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.modalBody}>{this.props.children}</View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 60,
        left: 0,
        right: 0,
        //marginLeft: "5%",
        //marginRight: "5%",
        borderRadius: 10,
        shadowOpacity: 0.3,
        //marginTop: 64,
        //backgroundColor: "red",
    },
    modalHeader: {
        backgroundColor: "#FFF",
        height: 45,
        paddingLeft: 5,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        flexDirection: 'row',
        justifyContent: "space-between",
    },
    modalBody: {
        padding: 10,
        backgroundColor: "white",
        borderColor: "#FFF",
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
    },
    title: {
        paddingLeft: 8,
        paddingTop: 5,
        fontSize: 20,
        textAlign: "center",
        color: "#3E2723",
        fontWeight: "600"
    },
});
