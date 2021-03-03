import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, StyleSheet, Modal, FlatList } from "react-native";
import adm_Attachment from "../Entities/adm_Attachment";
import ApiUrl from "../constants/ApiUrl";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import ImageViewer from "react-native-image-zoom-viewer";
import GlobalCache from "../Caches/GlobalCache";

const { width, height } = Dimensions.get("window");

interface iProps {
    Images: adm_Attachment[];
    numberColumn: number;
    allowEdit?: boolean;
    allowRemove?: boolean;
    parentHandleEdit?: (attachment: adm_Attachment) => void;
    parentHandleRemove?: (attachment: adm_Attachment) => void;
}
interface iState {
    SelectedFullScreen: adm_Attachment;
}
export default class Gallery extends React.Component<iProps, iState> {
    constructor(props: iProps) {
        super(props);
        this.state = {
            SelectedFullScreen: null,
        };
    }

    handleEdit(attachment: adm_Attachment) {
        this.props.parentHandleEdit(attachment);
        this.setState({ SelectedFullScreen: null });
    }

    handleRemove(attachment: adm_Attachment) {
        this.props.parentHandleRemove(attachment);
        //this.setState({SelectedFullScreen:null});
    }

    renderImage(image: adm_Attachment) {
        return (
            <TouchableOpacity onPress={() => this.setState({ SelectedFullScreen: image })}>
                <Image
                    source={{
                        uri: `${ApiUrl.Attachment_ImagePreview}?id=${image.AttachmentID}&ecm=${image.ECMItemID}&name=${image.FileName}&size=1&token=${GlobalCache.UserToken}`,
                    }}
                    style={{
                        borderRadius: 8,
                        margin: 5,
                        width: width / this.props.numberColumn - 15,
                        height: width / this.props.numberColumn - 15,
                        resizeMode: "cover",
                    }}
                />
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={{ flex: 1, padding: 5 }}>
                <FlatList
                    data={this.props.Images}
                    numColumns={this.props.numberColumn}
                    renderItem={({ item, index }) => this.renderImage(item)}
                    keyExtractor={(item, index) => index.toString()}
                />
                {this.state.SelectedFullScreen != null ? (
                    <Modal visible={true}>
                        {/* <Image
                            source={{
                                uri: 'data:image/png;base64,' + this.state.SelectedFullScreen.FileContent
                                // uri:                                    
                                //     ApiUrl.Attachment_ImagePreview +
                                //     `?id=${this.state.SelectedFullScreen.AttachmentID}&name=${this.state.SelectedFullScreen.FileName}&ecm=${this.state.SelectedFullScreen.ECMItemID}&size=3`
                            }}
                            style={{ width: width, height: height, resizeMode: "contain" }}
                        /> */}
                        <ImageViewer
                            imageUrls={[
                                {
                                    url: `${ApiUrl.Attachment_ImagePreview}?id=${this.state.SelectedFullScreen.AttachmentID}&ecm=${this.state.SelectedFullScreen.ECMItemID}&name=${this.state.SelectedFullScreen.FileName}&size=1&token=${GlobalCache.UserToken}`,
                                },
                            ]}
                            backgroundColor={"white"}
                            renderIndicator={() => null}
                        />
                        <View
                            style={{
                                position: "absolute",
                                zIndex: 999999999,
                                justifyContent: "space-around",
                                alignItems: "center",
                                flexDirection: "row",
                                marginTop: 30,
                            }}
                        >
                            <TouchableOpacity
                                //@ts-ignore
                                style={{
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                    height: 40,
                                    marginLeft: 15,
                                    padding: 10,
                                    borderRadius: 50,
                                }}
                                onPress={() => this.setState({ SelectedFullScreen: null })}
                            >
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <FontAwesome5 name="arrow-left" size={20} color={"white"} />
                                    <Text style={{ fontWeight: "bold", fontSize: 15, marginLeft: 15, color: "white" }}>
                                        Back
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            {this.props.allowEdit != null && this.props.allowEdit ? (
                                <TouchableOpacity
                                    //@ts-ignore
                                    style={{
                                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: 40,
                                        marginLeft: 15,
                                        padding: 10,
                                        borderRadius: 50,
                                    }}
                                    onPress={() => this.handleEdit(this.state.SelectedFullScreen)}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <FontAwesome5 name="edit" size={20} color={"white"} />
                                        <Text
                                            style={{ fontWeight: "bold", fontSize: 15, marginLeft: 15, color: "white" }}
                                        >
                                            Sửa
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ) : undefined}
                            {this.props.allowRemove != null && this.props.allowRemove ? (
                                <TouchableOpacity
                                    //@ts-ignore
                                    style={{
                                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: 40,
                                        marginLeft: 15,
                                        padding: 10,
                                        borderRadius: 50,
                                    }}
                                    onPress={() => {
                                        this.handleRemove(this.state.SelectedFullScreen);
                                        this.setState({ SelectedFullScreen: null });
                                    }}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <FontAwesome5 name="trash" size={20} color={"white"} />
                                        <Text
                                            style={{ fontWeight: "bold", fontSize: 15, marginLeft: 15, color: "white" }}
                                        >
                                            Xóa
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ) : undefined}
                        </View>
                    </Modal>
                ) : undefined}
            </View>
        );
    }
}
