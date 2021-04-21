import React, { Component } from "react";
import {
    Text,
    View,
    Button,
    AsyncStorage,
    Image,
    Switch,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    InteractionManager,
    SafeAreaView,
    Platform,
    ImageBackground,
    Dimensions,
    TouchableOpacity,
    StatusBar,
    Vibration,
    Alert,
} from "react-native";

import LoadingModal from "../../components/LoadingModal";
import CopyRight from "../../common_controls/CopyRight";

import Theme from "../../Themes/Default";
import HttpUtils from "../../Utils/HttpUtils";
import ApiUrl from "../../constants/ApiUrl";
import GlobalCache from "../../Caches/GlobalCache";
import AuthenticationParam from "../../DtoParams/AuthenticationParam";
import { GlobalDto } from "../../DtoParams/GlobalDto";
import GlobalStore from "../../Stores/GlobalStore";
import { inject, observer } from "mobx-react";
import SMX from "../../constants/SMX";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
//@ts-ignore
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Animatable from "react-native-animatable";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import { NotifyDto } from "../../DtoParams/NotifyDto";
import DeviceTokenDto from "../../DtoParams/DeviceTokenDto";
import { LinearGradient } from "expo-linear-gradient";

import * as Device from "expo-device";
import * as LocalAuthentication from "expo-local-authentication";
import PopupModalUpdateNote from "../../components/PopupModalUpdateNote";


const { width: viewportWidth, height: viewportHeight } = Dimensions.get("window");

//config is optional to be passed in on Android
const optionalConfigObject = {
    title: "Authentication Required", // Android
    color: "#e00606", // Android,
    fallbackLabel: "Show Passcode" // iOS (if empty, then label is hidden)
}

interface iProps {
    GlobalStore?: GlobalStore;
    navigation?: any;
    route?: any;
}

interface iState {
    userName?: string;
    passWord?: string;
    saveLogin?: boolean;
    IsLoading?: boolean;
    expoToken: string;
    notification?: any;
    FINGERPRINT?: boolean;
    FACIAL_RECOGNITION?: boolean;
    showConfirmFingerprint: boolean;
    showConfirmFace: boolean;
    touch?: boolean;
    face?: boolean;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class Login extends Component<iProps, iState> {
    constructor(props: iProps) {
        super(props);
        this.state = {
            IsLoading: false,
            expoToken: "",
            showConfirmFingerprint: false,
            showConfirmFace: false,
        };
    }

    async componentDidMount() {
        await this.checkDeviceForHardware();
        // register token notification
        await this.registerForPushNotificationsAsync();

        // listen notify
        Notifications.addListener(this._handleNotification);

        await this.initApplication();
    }

    checkDeviceForHardware = async () => {
        let lstType = await LocalAuthentication.supportedAuthenticationTypesAsync();
        let isFingerprint = lstType.includes(1);
        let isFace = lstType.includes(2);

        this.setState({ FINGERPRINT: isFingerprint, FACIAL_RECOGNITION: isFace });

    };

    async initApplication() {
        // Lấy thông tin đăng nhập từ Local Storage
        try {
            let _userName = await AsyncStorage.getItem("USER_NAME");
            let _passWord = await AsyncStorage.getItem("PASS_WORD");

            let _touch = await AsyncStorage.getItem("FINGERPRINT");
            let _face = await AsyncStorage.getItem("FACIAL_RECOGNITION");

            // Nếu đã lưu tài khoản thì bật saveLogin
            let _saveLogin: boolean = false;
            if (_userName && _userName !== "" && _passWord && _passWord !== "") {
                _saveLogin = true;
            }
            // Bind thông tin đăng nhập vào State
            this.setState({
                userName: _userName,
                passWord: _passWord,
                saveLogin: _saveLogin,
                touch: _touch === 'true' ? true : false,
                face: _face === 'true' ? true : false
            });
        } catch (ex) {
            //this.props.GlobalStore!.Exception! = ex;
        }
    }

    async login() {
        try {
            this.setState({
                IsLoading: true, // Bật loading
            });

            let request = new AuthenticationParam();
            request.UserName = this.state.userName;
            request.Password = this.state.passWord;

            if (
                request.UserName === null ||
                request.UserName === "" ||
                request.Password === null ||
                request.Password === ""
            ) {
                throw "Vui lòng cung cấp tên đăng nhập và mật khẩu.";
            }

            // Post thông tin đăng nhập
            let response: any = await HttpUtils.post<AuthenticationParam>(
                ApiUrl.Authentication_Login,
                SMX.ApiActionCode.Login,
                JSON.stringify(request),
                false
            );

            // Cache token vào global
            GlobalCache.UserToken = response.UserToken;
            GlobalCache.Profile = response.Employee;

            // Nhớ thông tin đăng nhập vào LocalStorage
            await this.rememberLogin();

            // insert expo notify token to server
            await this.PostExpoTokenNotification();

            // Load cache vào global
            //await this.loadCache();

            this.setState({
                IsLoading: false,
            });

            // Nhảy sang trang home
            this.props.navigation.navigate("Tabs");
        } catch (e) {
            // Tắt loading
            this.setState({
                IsLoading: false,
            });
            this.props.GlobalStore!.Exception! = e;

            //alert(e);
        }
    }

    async loginBySinhTracHoc() {
        try {
            // Checking if device is compatible
            const isCompatible = await LocalAuthentication.hasHardwareAsync();

            if (!isCompatible) {
                throw new Error("Thiết bị của bạn không tương thích với chức năng này.");
            }

            // Checking if device has biometrics records
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (!isEnrolled) {
                throw new Error("Bạn chưa thiết lập sinh trắc học cho thiết bị này.");
            }

            // Authenticate user
            const results = await LocalAuthentication.authenticateAsync();

            if (results.success) {
                await this.LoginFinger();
            } else {
                throw new Error("Đăng nhập bằng sinh trắc học thất bại, vui lòng thử lại.");
            }

            //
        } catch (error) {
            Alert.alert("Thông báo ", error?.message);
        }
    }

    async LoginFinger() {
        try {
            this.setState({
                IsLoading: true, // Bật loading
            });
            let guid =
                Platform.OS == "android"
                    ? Device.osBuildFingerprint
                    : `${Device.brand}/${Device.osVersion}/${Device.modelId}/${Device.osBuildId}`;

            let request = new AuthenticationParam();
            request.UserName = this.state.userName;
            request.Guid = guid;
            request.DeviceName = Device.modelName;
            if (request.UserName === null || request.UserName === "") {
                throw "Vui lòng cung cấp tên đăng nhập.";
            }

            // Post thông tin đăng nhập
            let response = await HttpUtils.post<AuthenticationParam>(
                ApiUrl.Authentication_LoginBySinhTracHoc,
                SMX.ApiActionCode.LoginBySinhTracHoc,
                JSON.stringify(request),
                false
            );

            // Cache token vào global
            GlobalCache.UserToken = response.UserToken;
            GlobalCache.Profile = response.Employee;

            // Nhớ thông tin đăng nhập vào LocalStorage
            await this.rememberLogin();

            // Load cache vào global
            //await this.loadCache();

            this.setState({
                IsLoading: false,
            });

            // Nhảy sang trang home
            this.props.navigation.navigate("Tabs");
        } catch (e) {
            // Tắt loading
            this.setState({
                IsLoading: false,
            });
            this.props.GlobalStore.Exception = e;

            //alert(e);
        }
    }

    _handleNotification = (notification: any) => {
        Vibration.vibrate(1);
        //console.log('receive',notification);
        //alert(notification.data.Hub.Name);
        this.setState({ notification: notification });
        this.props.GlobalStore.IsHasNotification();
    };

    registerForPushNotificationsAsync = async () => {
        const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            return;
        }

        let token = await Notifications.getExpoPushTokenAsync();
        this.setState({ expoToken: token });
    };

    PostExpoTokenNotification = async () => {
        //console.log("token: ", this.state.expoToken);
        // insert token device to server
        if (this.state.expoToken != "") {
            let request = new DeviceTokenDto();
            request.Token = this.state.expoToken;
            let res = await HttpUtils.post<DeviceTokenDto>(
                ApiUrl.PostExpoNotificationToken,
                SMX.ApiActionCode.SaveItem,
                JSON.stringify(request)
            );
        }
    };

    async rememberLogin() {
        try {
            if (this.state.saveLogin === true) {
                await AsyncStorage.setItem("USER_NAME", this.state.userName);
                await AsyncStorage.setItem("PASS_WORD", this.state.passWord);
            } else {
                await AsyncStorage.removeItem("USER_NAME");
                await AsyncStorage.removeItem("PASS_WORD");
            }
        } catch (e) {
            //this.props.GlobalStore!.Exception! = e;
        }
    }

    showConfirmFingerprint = () => {
        this.setState({ showConfirmFingerprint: !this.state.showConfirmFingerprint });
    };
    showConfirmFace = () => {
        this.setState({ showConfirmFace: !this.state.showConfirmFace });
    };

    render() {
        return (
            <View style={{ flexGrow: 1, backgroundColor: "white" }}>
                <View style={{ marginTop: Platform.OS === "ios" ? 40 : 26 }}></View>
                <View style={styles.body}>
                    <View
                        style={{
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Image
                            style={{ height: 70, width: 270, resizeMode: "contain" }}
                            source={require("../../../assets/logo.png")}
                        />
                    </View>
                    <KeyboardAwareScrollView style={{ flexGrow: 1 }}>
                        <Animatable.View
                            animation="bounceInDown"
                            direction="normal"
                            delay={700}
                            style={{
                                alignItems: "center",
                                borderBottomStartRadius: 18,
                                borderTopStartRadius: 18,
                                borderTopRightRadius: 18,
                                borderBottomRightRadius: 17,
                                padding: 20,
                                marginTop: 40,
                                justifyContent: "space-between",
                            }}
                        >
                            <Text style={{ fontWeight: "bold", fontSize: 22 }}>Đăng nhập</Text>
                            <View
                                style={{ flexDirection: "row", marginHorizontal: 10, marginBottom: 10, marginTop: 30 }}
                            >
                                <View style={styles.icon}>
                                    <AntDesign name="user" size={30} color="FFFFFF" />
                                </View>
                                <TextInput
                                    style={styles.textinput}
                                    placeholder="Tên đăng nhập"
                                    value={this.state.userName}
                                    onChangeText={(val) => {
                                        this.setState({ userName: val });
                                    }}
                                />
                            </View>
                            <View style={{ flexDirection: "row", margin: 10 }}>
                                <View style={styles.icon}>
                                    <AntDesign name="lock" size={30} color="FFFFFF" />
                                </View>
                                <TextInput
                                    style={styles.textinput}
                                    secureTextEntry
                                    placeholder="Mật khẩu"
                                    value={this.state.passWord}
                                    onChangeText={(val) => {
                                        this.setState({ passWord: val });
                                    }}
                                />
                            </View>

                            {/* <View
                                style={{
                                    flexDirection: "row",
                                    margin: 10,
                                    paddingTop: 20,
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    alignSelf: "flex-start",
                                }}
                            >
                                <Switch
                                    value={this.state.saveLogin}
                                    onValueChange={(val) => {
                                        this.setState({ saveLogin: val });
                                    }}
                                />
                                <View style={{ marginLeft: 10 }}>
                                    <Text>Lưu thông tin đăng nhập</Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    width: viewportWidth - 60,
                                    justifyContent: "center",
                                }}
                            >
                            </View> */}

                            <View style={{ flexDirection: "row", margin: 10 }}>
                                <TouchableOpacity
                                    style={{
                                        width: viewportWidth - 150,
                                        height: 50,
                                        backgroundColor: "#007AFF",
                                        justifyContent: "center",
                                        borderColor: 'gainsboro',
                                        marginTop: 30,
                                        borderTopStartRadius: 5,
                                        borderBottomStartRadius: 5,
                                        padding: 8,
                                        borderEndWidth: 1,
                                    }}
                                    onPress={() => {
                                        this.login();
                                    }}
                                >
                                    <Text style={{ color: "#FFFFFF", fontSize: 18, textAlign: "center" }}>Đăng nhập</Text>
                                </TouchableOpacity>

                                {
                                    this.state.FACIAL_RECOGNITION == true ? (
                                        <TouchableOpacity
                                            style={{
                                                width: 50,
                                                height: 50,
                                                marginTop: 30,
                                                justifyContent: "center",
                                                backgroundColor: "#007AFF",
                                                borderBottomRightRadius: 5,
                                                borderTopRightRadius: 5,
                                                padding: 10,
                                            }}
                                            onPress={() => {
                                                if (this.state.face == true) {
                                                    this.loginBySinhTracHoc();
                                                } else {
                                                    this.setState({ showConfirmFace: true });
                                                }
                                            }}
                                        >
                                            <Image
                                                style={{ height: 35, width: 35, resizeMode: "contain" }}
                                                source={require("../../../assets/face-id.png")}
                                            />
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            style={{
                                                width: 50,
                                                height: 50,
                                                marginTop: 30,
                                                justifyContent: "center",
                                                backgroundColor: "#007AFF",
                                                borderBottomRightRadius: 5,
                                                borderTopRightRadius: 5,
                                                padding: 10,
                                            }}
                                            onPress={() => {
                                                if (this.state.touch == true) {
                                                    this.loginBySinhTracHoc();
                                                } else {
                                                    this.setState({ showConfirmFingerprint: true });
                                                }
                                            }}
                                        >
                                            <MaterialIcons name="fingerprint" size={30} color="#FFFFFF" />
                                        </TouchableOpacity>
                                    )
                                }
                            </View>
                            {/* <TouchableOpacity
                                style={{
                                    width: viewportWidth - 60,
                                    height: 50,
                                    backgroundColor: "#007AFF",
                                    borderRadius: 5,
                                    justifyContent: "center",
                                    marginTop: 30,
                                }}
                                onPress={() => {
                                    this.login();
                                }}
                            >
                                <Text style={{ color: "#FFF", fontSize: 18, textAlign: "center" }}>Đăng nhập</Text>
                            </TouchableOpacity> */}
                        </Animatable.View>
                    </KeyboardAwareScrollView>

                    <PopupModalUpdateNote
                        resetState={this.showConfirmFingerprint}
                        modalVisible={this.state.showConfirmFingerprint}
                        title="Thông báo"
                    >
                        <View style={{ padding: 10, marginBottom: 15 }}>
                            <Text style={{ fontSize: 15 }}>Bạn chưa cài đặt đăng nhập bằng vân tay. Vui lòng đăng nhập vào tài khoản bằng mật khẩu và cài đặt xác thực vân tay trong phần "Thông tin người đăng nhập". </Text>
                        </View>

                        <View style={{ marginVertical: 10, flexDirection: "row", justifyContent: "center" }}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ showConfirmFingerprint: false });
                                }}
                            >
                                <LinearGradient
                                    colors={["#007AFF", "#007AFF"]}
                                    style={{
                                        width: viewportWidth / 2,
                                        backgroundColor: "#007AFF",
                                        padding: 10,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: 5,
                                        alignSelf: "center",
                                        marginRight: 5,
                                    }}
                                >
                                    <Text style={[Theme.BtnTextGradient, { fontSize: 15, color: '#FFFFFF' }]}>Đồng ý</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                    </PopupModalUpdateNote>

                    <PopupModalUpdateNote
                        resetState={this.showConfirmFace}
                        modalVisible={this.state.showConfirmFace}
                        title="Thông báo"
                    >
                        <View style={{ padding: 10, marginBottom: 15 }}>
                            <Text style={{ fontSize: 15 }}>Bạn chưa cài đặt đăng nhập bằng nhận diện khuôn mặt. Vui lòng đăng nhập vào tài khoản bằng mật khẩu và cài đặt xác thực nhận diện khuôn mặt trong phần "Thông tin người đăng nhập". </Text>
                        </View>

                        <View style={{ marginVertical: 10, flexDirection: "row", justifyContent: "center" }}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ showConfirmFace: false });
                                }}
                            >
                                <LinearGradient
                                    colors={["#007AFF", "#007AFF"]}
                                    style={{
                                        width: viewportWidth / 2,
                                        backgroundColor: "#007AFF",
                                        padding: 10,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: 5,
                                        alignSelf: "center",
                                        marginRight: 5,
                                    }}
                                >
                                    <Text style={[Theme.BtnTextGradient, { fontSize: 15, color: '#FFFFFF' }]}>Đồng ý</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                    </PopupModalUpdateNote>

                    {/* <Animatable.View
                        animation="bounceInDown"
                        direction="normal"
                        delay={500}
                        style={{
                            alignItems: "center",
                            height: "8%",
                        }}
                    >
                        <Text style={{ fontSize: 18, color: "#FFF", textAlign: "center" }}>
                            Copyright © SoftMart 2020
                        </Text>
                    </Animatable.View> */}
                    <LoadingModal Loading={this.state.IsLoading} />
                </View>
            </View >
        );
    }
}
const styles = StyleSheet.create({
    body: {
        flexGrow: 1,
        width: viewportWidth,
        height: viewportHeight,
    },
    textinput: {
        width: "80%",
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
        padding: 5,
        borderColor: "gainsboro",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderRightWidth: 1,
        //borderTopWidth: Platform.OS === "ios" ? 1 : 0,
        //borderBottomWidth: Platform.OS === "ios" ? 1 : 0,
        //borderLeftWidth: Platform.OS === "ios" ? 0.5 : 0,
        //borderRightWidth: Platform.OS === "ios" ? 1 : 0,
    },
    icon: {
        borderTopStartRadius: 5,
        borderBottomStartRadius: 5,
        padding: 8,
        borderColor: "gainsboro",
        borderEndWidth: 1,
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1
        // borderEndWidth: Platform.OS === "ios" ? 0.5 : 0,
        // borderLeftWidth: Platform.OS === "ios" ? 1 : 0,
        // borderTopWidth: Platform.OS === "ios" ? 1 : 0,
        // borderBottomWidth: Platform.OS === "ios" ? 1 : 0,
    },
});
