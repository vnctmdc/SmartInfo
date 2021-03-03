import React from "react";
import { View, Text, Image, Modal, TouchableOpacity } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import ApiUrl from "../constants/ApiUrl";
import GlobalCache from "../Caches/GlobalCache";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

interface iProps {
    AttachmentID: number;
    ECMItemID: string;
    FileName: string;
    Visible: boolean;
}
interface iState {
    Visible: boolean;
}
export default class ImageView extends React.Component<iProps, iState> {
    constructor(props: iProps) {
        super(props);
        this.state = {
            Visible: this.props.Visible,
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps: iProps) {
        if (nextProps.Visible !== this.state.Visible) {
            this.setState({ Visible: nextProps.Visible });
        }
    }

    render() {
        return (
            <Modal visible={this.state.Visible}>
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
                        onPress={() => this.setState({ Visible: false })}
                    >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <FontAwesome5 name="arrow-left" size={20} color={"white"} />
                            <Text style={{ fontWeight: "bold", fontSize: 15, marginLeft: 15, color: "white" }}>
                                Back
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <ImageViewer
                    imageUrls={[
                        {
                            url: `${ApiUrl.Attachment_ImagePreview}?id=${this.props.AttachmentID}&ecm=${this.props.ECMItemID}&name=${this.props.FileName}&token=${GlobalCache.UserToken}`,
                        },
                    ]}
                    backgroundColor={"black"}
                />
            </Modal>
        );
    }
}
