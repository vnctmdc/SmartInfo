import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, Dimensions, AsyncStorage } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import * as FileSystem from "expo-file-system";
import adm_Attachment from "../Entities/adm_Attachment";
import SystemParameter from "../Entities/SystemParameter";
import ImageObject from "../SharedEntity/ImageObject";
import { GlobalDto } from "../DtoParams/GlobalDto";
import LogManager from "../Utils/LogManager";

interface iProps {
    SendData: (image: ImageObject) => void;
    navigation: any;
}
interface iState {
    showUpFile: boolean;
    image: any;
    imageBase64: string;
}
export default class PickAndTakeImage extends React.Component<iProps, iState> {
    constructor(props) {
        super(props);
        this.state = {
            showUpFile: false,
            image: null,
            imageBase64: ""
        };
    }

    _takePhoto = async () => {
        let result: any = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true
            //aspect: [4, 3],
        });

        if (!result.cancelled) {
            this.setState({ image: result.uri, showUpFile: true });
            await this.SendData(result.uri);
        }
    };

    _pickImage = async () => {
        //@ts-ignore
        //status === "granted";
        let { status } = await Permissions.getAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
        if (status !== "granted") {
            //@ts-ignore
            let status1 = await (await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL)).status;
    
            if (status1 !== "granted") {   
                
                // log status
                var requestGlobal = new GlobalDto();
                requestGlobal.ExceptionInfo = `CAMERA Permission: ${JSON.stringify(status1)}`;
                LogManager.Log(requestGlobal);            
                ///////////////

                return;
            }
        }
        let result: any = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            base64: true
        });

        if (!result.cancelled) {
            this.setState({ image: result.uri, showUpFile: true });
            await this.SendData(result.uri);
        }
    };

    async SendData(image) {
        var result = await FileSystem.readAsStringAsync(image, { encoding: "base64" });
        const uriArray = image.toString().split("/");
        const filename = uriArray[uriArray.length - 1];
        const fileExternal = filename.split(".")[1];
        let imageObject = new ImageObject();
        imageObject.Base64 = result;
        imageObject.FileName = filename;
        imageObject.FileExtension = fileExternal;
        this.props.SendData(imageObject);
    }

    render() {
        let { showUpFile } = this.state;
        return (
            <View>
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            marginTop: 10,
                            marginHorizontal: 10,
                            height: 60,
                            backgroundColor: "#f4511e",
                            borderRadius: 5,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        onPress={this._pickImage}
                    >
                        <Ionicons name="ios-camera" size={25} color={"white"} />
                        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", marginLeft: 10 }}>
                            Chụp ảnh
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            marginTop: 10,
                            marginHorizontal: 10,
                            height: 60,
                            backgroundColor: "#2d74b0",
                            flexDirection: "row",
                            borderRadius: 5,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        onPress={this._takePhoto}
                    >
                        <Ionicons name="ios-image" size={25} color={"white"} />
                        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", marginLeft: 10 }}>
                            Chọn ảnh
                        </Text>
                    </TouchableOpacity>
                </View>
                <View>
                    {showUpFile === true ? (
                        <ScrollView>
                            <Image
                                source={{ uri: this.state.image }}
                                //@ts-ignore
                                style={{
                                    marginTop: 10,
                                    alignSelf: "center",
                                    width: Dimensions.get("window").width - 20,
                                    height: 300,
                                    resizeMode: "contain",
                                    borderRadius: 10
                                }}
                            />
                            <View style={{ paddingHorizontal: 10, marginTop: 10 }}>{this.props.children}</View>
                        </ScrollView>
                    ) : (
                        <View></View>
                    )}
                </View>
            </View>
        );
    }
}
