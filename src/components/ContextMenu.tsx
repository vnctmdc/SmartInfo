import React, { Component } from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import Modal from "react-native-modal";

interface iProp {
    showContextMenu?: boolean;
}
interface iState {
    showContextMenu: boolean;
}

export default class ContextMenu extends Component<iProp, iState> {
    constructor(props: iProp) {
        super(props);
        this.state = {
            showContextMenu: this.props.showContextMenu,
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps: iProp) {
        // Cần phải check những props nào thay đổi thì gán lại giá trị của state đó để tránh vẽ lại giao diện
        if (this.state.showContextMenu !== nextProps.showContextMenu) {
            this.setState({
                showContextMenu: nextProps.showContextMenu,
            });
        }
    }

    render() {
        return (
            <Modal
                isVisible={this.state.showContextMenu}
                hasBackdrop={false}
                animationIn="slideInRight"
                animationOut="slideOutRight"
                // style={{backgroundColor: "#ff0000"}}
            >
                <TouchableWithoutFeedback
                    onPress={() => {
                        this.setState({ showContextMenu: false });
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row-reverse" }}>
                            <View style={styles.container}>{this.props.children}</View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        right: 20,
        marginTop: 80 - 15,
        shadowColor: "gray",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 5,
        paddingHorizontal: 15,
        backgroundColor: "white",
        //backgroundColor: "#2EA8EE",
    },
});
