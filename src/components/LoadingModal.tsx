import React from "react";
import { View, Modal, ActivityIndicator, StyleSheet } from "react-native";
import { inject, observer } from "mobx-react";
import SMX from "../constants/SMX";
import GlobalStore from "../Stores/GlobalStore";

interface iProp {
    Loading?: boolean;
    GlobalStore?: GlobalStore;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class LoadingModal extends React.Component<iProp, any> {
    render() {
        return (
            <Modal
                transparent={true}
                animationType="none"
                visible={this.props.GlobalStore.IsLoading ? this.props.GlobalStore.IsLoading : this.props.Loading}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.activityIndicatorWrapper}>
                        <ActivityIndicator size="large" color="#134E80" />
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "space-around",
        backgroundColor: "#00000040",
    },
    activityIndicatorWrapper: {
        backgroundColor: "#FFFFFF",
        height: 100,
        width: 100,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
    },
});
