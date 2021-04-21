import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AuthenticationService from "../Utils/AuthenticationService";
import AntDesign from "react-native-vector-icons/AntDesign";

interface iProps {
    Title: string;
    HasDrawer?: boolean;
    HideLeftSide?: boolean;
    navigation: any;
    HasBottomTab?: boolean;
    IsHome?: boolean;
}

export default class Toolbar extends React.Component<iProps, any> {
    renderContent() {
        if (this.props.HasBottomTab) {
            return (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                    }}
                >
                    <View></View>
                    {/* <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => {
                            AuthenticationService.SignOut();
                            this.props.navigation.navigate("SrcLogin");
                        }}
                    >
                        <FontAwesome5 name="sign-out-alt" size={25} color="#B3BDC6" />
                    </TouchableOpacity> */}
                    <Text style={{ fontSize: 17, fontWeight: "bold", marginLeft: 10, color: "#1F31A4" }}>
                        {this.props.Title}
                    </Text>
                    {/* <Image
                        source={require("../../assets/logo.png")}
                        style={{ width: 100, height: 30, resizeMode: "contain" }}
                    /> */}
                    <View style={{ flexDirection: "row", alignItems: "center" }}>{this.props.children}</View>
                </View>
            );
        } else if (this.props.IsHome) {
            return (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                    }}
                >
                    <View></View>
                    <Image
                        source={require("../../assets/logo.png")}
                        style={{ width: 170, height: 50, resizeMode: "contain" }}
                    />
                    <View style={{ flexDirection: "row", alignItems: "center" }}>{this.props.children}</View>
                </View>
            );
        } else {
            return (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                    }}
                >
                    <TouchableOpacity activeOpacity={0.5} onPress={() => this.props.navigation.goBack()}>
                        <AntDesign name={"left"} size={25} color="#B3BDC6" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 17, fontWeight: "bold", marginLeft: 10, color: "#1F31A4" }}>
                        {this.props.Title}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>{this.props.children}</View>
                </View>
            );
        }
    }

    render() {
        return (
            <View
                style={{
                    height: 80,
                    backgroundColor: "white",
                    flexDirection: "row",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    paddingBottom: 10,
                    paddingHorizontal: 10,
                    shadowColor: "gray",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.5,
                    shadowRadius: 2,
                    elevation: 5,
                    zIndex: 999999999999999,
                }}
            >
                {/* <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    {this.props.HasDrawer ? (
                    //         <TouchableOpacity activeOpacity={0.5} onPress={() => this.props.navigation.openDrawer()}>
                    //             <FontAwesome5 name="bars" size={25} />
                    //         </TouchableOpacity>
                    //     ) : (
                    //         <TouchableOpacity activeOpacity={0.5} onPress={() => this.props.navigation.goBack()}>
                    //             <FontAwesome5 name={"arrow-left"} size={25} />
                    //         </TouchableOpacity>
                    //     )}
                </View> */}
                {this.renderContent()}
            </View>
        );
    }
}
