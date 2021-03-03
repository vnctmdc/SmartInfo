import React, { Component } from "react";
import {
    Text,
    View,
    Alert,
    TouchableOpacity,
    ScrollView,
    Button,
    BackHandler,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Image,
    Dimensions,
    ImageBackground,
} from "react-native";
import Theme from "../Themes/Default";
import ApiUrl from "../constants/ApiUrl";
import { WebView } from "react-native-webview";
import Toolbar from "../components/Toolbar";
import HttpUtils from "../Utils/HttpUtils";
import SMX from "../constants/SMX";
import { inject, observer } from "mobx-react";
import GlobalStore from "../Stores/GlobalStore";
import { PressAgencyDto } from "../DtoParams/PressAgencyDto";
import News from "../Entities/News";
import { NewsDto } from "../DtoParams/NewsDto";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Utility from "../Utils/Utility";
import GlobalCache from "../Caches/GlobalCache";
import ContextMenu from "../components/ContextMenu";
import AuthenticationService from "../Utils/AuthenticationService";
import { NotifyDto, NotifyFilter } from "../DtoParams/NotifyDto";
import ntf_Notification from "../Entities/ntf_Notification";
import moment from "moment";

const { width, height } = Dimensions.get("window");

interface iProps {
    navigation: any;
    GlobalStore: GlobalStore;
}

interface iState {
    PositiveNews: News[];
    NegativeNews: News[];
    ShowContextMenu: boolean;

    LstDateOfWeek: Date[];
    LstNotification: ntf_Notification[];
    DateReq: Date;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class Home extends Component<iProps, iState> {
    constructor(props: any) {
        super(props);
        this.state = {
            PositiveNews: [],
            NegativeNews: [],
            ShowContextMenu: false,
            LstDateOfWeek: [],
            LstNotification: [],
            DateReq: new Date(),
        };
    }

    async componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);

        this.props.GlobalStore.ShowLoading();
        await this.LoadData();
        await this.LoadNotification();
        this.props.GlobalStore.HideLoading();
        this.BuildDateOfWeek();

        this.props.GlobalStore.IsHasNotification = async () => {
            await this.LoadNotification();
        };
    }

    BuildDateOfWeek() {
        var curr = new Date();
        var first = curr.getDate() - curr.getDay();
        var last = first + 8;
        let firstday = new Date(curr.setDate(first)).toUTCString();
        let lastday = new Date(curr.setDate(curr.getDate() + 8)).toUTCString();

        let lstDate = [];

        var currDate = moment(firstday).startOf("day");
        var lastDate = moment(lastday).startOf("day");

        while (currDate.add(1, "days").diff(lastDate) < 0) {
            lstDate.push(currDate.clone().toDate());
        }
        this.setState({ LstDateOfWeek: lstDate });
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
    }

    handleBackPress = () => {
        return true;
    };

    async LoadData() {
        try {
            let res = await HttpUtils.post<NewsDto>(
                ApiUrl.News_ExecuteNews,
                SMX.ApiActionCode.HomeDisplay,
                JSON.stringify(new NewsDto())
            );

            this.setState({ NegativeNews: res.NegativeNews!, PositiveNews: res.PositiveNews! });
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }
    }

    async LoadNotification() {
        try {
            let request = new NotifyDto();
            let filter = new NotifyFilter();
            filter.DayNotify = Utility.ConvertToDateTimeToRequest(this.state.DateReq);
            request.Filter = filter;

            let res = await HttpUtils.post<NotifyDto>(
                ApiUrl.Notification_ExecuteNotification,
                SMX.ApiActionCode.HomeDisplay,
                JSON.stringify(request)
            );
            //console.log("test: ", res.LstNotification!);
            this.setState({ LstNotification: res.LstNotification! });
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }
    }

    renderNegativeNews(LstNews: News[]) {
        return LstNews.map((item) => (
            <TouchableOpacity
                style={{
                    backgroundColor: Utility.GetDictionaryValue(SMX.NewsStatus.dicColorBackground, item.Status),
                    width: 200,
                    height: 220,
                    marginHorizontal: 10,
                    padding: 10,
                    // shadowColor: "gray",
                    // shadowOffset: { width: 0, height: 1 },
                    // shadowOpacity: 0.5,
                    // shadowRadius: 2,
                    // elevation: 5,
                    alignItems: "center",
                    borderRadius: 15,
                    borderWidth: 1,
                    borderColor: Utility.GetDictionaryValue(SMX.NewsStatus.dicColor, item.Status),
                }}
                onPress={() => this.props.navigation.navigate("DetailNegativeNews", { News: item })}
            >
                {/* {item.Attachment ? (
                    <Image
                        source={{
                            uri: `${ApiUrl.Attachment_ImagePreview}?id=${item.Attachment!.AttachmentID}&ecm=${
                                item.Attachment!.ECMItemID
                            }&name=${item.Attachment!.FileName}&size=1&token=${GlobalCache.UserToken}`,
                        }}
                        style={{ width: 50, height: 50, resizeMode: "contain" }}
                    />
                ) : (
                    <FontAwesome5 name="newspaper" size={50} color="#2EA8EE" />
                )} */}
                <View style={{ justifyContent: "space-between", height: 200 }}>
                    <View>
                        <Text>{Utility.GetDateMinuteString(item.IncurredDTG)}</Text>
                        <Text
                            style={{
                                fontWeight: "bold",
                                marginTop: 3,
                                fontSize: 17,
                                width: 180,
                                color: Utility.GetDictionaryValue(SMX.NewsStatus.dicColor, item.Status),
                            }}
                            numberOfLines={6}
                            ellipsizeMode={"tail"}
                        >
                            {item.Name}
                        </Text>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: 10,
                        }}
                    >
                        <View
                            style={{
                                borderRadius: 100,
                                backgroundColor: "#597EF7",
                                width: 30,
                                height: 30,
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: 10,
                            }}
                        >
                            <FontAwesome5
                                name={Utility.GetDictionaryValue(SMX.NewsStatus.dicIcons, item.Status)}
                                size={15}
                                color="white"
                            />
                        </View>
                        <Text style={{ color: Utility.GetDictionaryValue(SMX.NewsStatus.dicColor, item.Status) }}>
                            {Utility.GetDictionaryValue(SMX.NegativeNews.dicName, item.Status)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        ));
    }

    renderPositiveNew(LstNews: News[]) {
        return LstNews.map((item) => (
            <TouchableOpacity
                style={{ margin: 10, borderRadius: 15 }}
                onPress={() => this.props.navigation.navigate("TinTucDetail", { NewsID: item.NewsID })}
            >
                {item.Attachment ? (
                    <ImageBackground
                        source={{
                            uri: `${ApiUrl.Attachment_ImagePreview}?id=${item.Attachment!.AttachmentID}&ecm=${
                                item.Attachment!.ECMItemID
                            }&name=${item.Attachment!.FileName}&size=1&token=${GlobalCache.UserToken}`,
                        }}
                        style={{ width: 250, height: 220 }}
                        imageStyle={{ borderRadius: 15 }}
                    >
                        <View
                            style={{
                                padding: 15,
                                backgroundColor: "rgba(52, 52, 52, 0.4)",
                                borderRadius: 15,
                                width: 250,
                                height: 220,
                                flexDirection: "row",
                            }}
                        >
                            <View style={{ alignSelf: "flex-end" }}>
                                <Text
                                    style={{
                                        color: "white",
                                        fontWeight: "bold",
                                        marginTop: 3,
                                        fontSize: 17,
                                        width: width - (50 + 40 + 15),
                                    }}
                                >
                                    {item.Name}
                                </Text>
                                {item.IncurredDTG ? (
                                    <Text>{Utility.GetDateMinuteString(item.IncurredDTG)}</Text>
                                ) : undefined}
                            </View>
                        </View>
                    </ImageBackground>
                ) : (
                    <ImageBackground
                        source={require("../../assets/newsdefault.png")}
                        style={{ width: 300, height: 220 }}
                    >
                        <View
                            style={{
                                padding: 15,
                                backgroundColor: "rgba(52, 52, 52, 0.4)",
                                borderRadius: 15,
                                width: 250,
                                height: 220,
                                flexDirection: "row",
                            }}
                        >
                            <View style={{ alignSelf: "flex-end" }}>
                                <Text
                                    style={{
                                        color: "white",
                                        fontWeight: "bold",
                                        marginTop: 3,
                                        fontSize: 17,
                                        width: width - (50 + 40 + 15),
                                    }}
                                >
                                    {item.Name}
                                </Text>
                                {item.IncurredDTG ? (
                                    <Text style={{ color: "white" }}>
                                        {Utility.GetDateMinuteString(item.IncurredDTG)}
                                    </Text>
                                ) : undefined}
                            </View>
                        </View>
                    </ImageBackground>
                )}
            </TouchableOpacity>
        ));
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Toolbar Title="Trang chủ" navigation={this.props.navigation} IsHome={true}>
                    <View style={{ marginLeft: 10 }}>
                        <TouchableOpacity activeOpacity={0.5} onPress={() => this.setState({ ShowContextMenu: true })}>
                            <FontAwesome5 name="user" size={20} color="#B3BDC6" />
                        </TouchableOpacity>
                    </View>
                </Toolbar>

                <ScrollView>
                    <View>
                        <View
                            style={{
                                //flexDirection: "row",
                                //justifyContent: "space-between",
                                padding: 10,
                                //alignItems: "center",
                            }}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <View
                                    style={{
                                        borderRadius: 100,
                                        backgroundColor: "#597EF7",
                                        width: 35,
                                        height: 35,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: 10,
                                    }}
                                >
                                    <FontAwesome5 name="bell" size={20} color="white" />
                                </View>
                                <Text style={{ fontWeight: "bold" }}>Thông báo</Text>
                            </View>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                style={{ marginTop: 10 }}
                            >
                                {this.state.LstDateOfWeek.length > 0
                                    ? this.state.LstDateOfWeek.map((en, i) => (
                                          <TouchableOpacity
                                              style={{
                                                  borderWidth: 1,
                                                  borderColor: "gainsboro",
                                                  padding: 10,
                                                  borderRadius: 100,
                                                  marginHorizontal: 5,
                                                  backgroundColor:
                                                      en.getDate() == this.state.DateReq.getDate()
                                                          ? "#fca311"
                                                          : "white",
                                              }}
                                              onPress={() => {
                                                  this.setState({ DateReq: en }, () => this.LoadNotification());
                                              }}
                                          >
                                              <Text>{Utility.GetDateString(en)}</Text>
                                          </TouchableOpacity>
                                      ))
                                    : undefined}
                            </ScrollView>
                            <ScrollView>
                                {this.state.LstNotification.map((en) => (
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            paddingHorizontal: 10,
                                            marginTop: 10,
                                            borderBottomWidth: 1,
                                            borderColor: "gainsboro",
                                            paddingBottom: 10,
                                        }}
                                    >
                                        <View
                                            style={{
                                                height: 50,
                                                justifyContent: "center",
                                                backgroundColor: "#20a4f3",
                                                paddingHorizontal: 10,
                                                borderRadius: 10,
                                                marginRight: 10,
                                            }}
                                        >
                                            <Text style={{ color: "#ffe347", fontWeight: "bold" }}>
                                                {Utility.GetDateString(en.DoDTG)}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text style={{ fontWeight: "bold" }}>
                                                {Utility.GetDictionaryValue(SMX.NotificationType.dicName, en.Type)}
                                            </Text>
                                            <Text style={{ width: width / 2 }}>{en.Content}</Text>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}></ScrollView>

                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                padding: 10,
                                alignItems: "center",
                            }}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <View
                                    style={{
                                        borderRadius: 100,
                                        backgroundColor: "#597EF7",
                                        width: 35,
                                        height: 35,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: 10,
                                    }}
                                >
                                    <FontAwesome5 name="rss" size={20} color="white" />
                                </View>
                                <Text style={{ fontWeight: "bold" }}>Sự vụ</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("Suvu")}>
                                <Text style={{ color: "#597EF7", fontSize: 17, fontWeight: "bold" }}>Xem tất cả</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                            {this.renderNegativeNews(this.state.NegativeNews)}
                        </ScrollView>

                        <View
                            style={{
                                marginTop: 15,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                paddingHorizontal: 10,
                                alignItems: "center",
                            }}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <View
                                    style={{
                                        borderRadius: 100,
                                        backgroundColor: "#597EF7",
                                        width: 35,
                                        height: 35,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: 10,
                                    }}
                                >
                                    <FontAwesome5 name="newspaper" size={20} color="white" />
                                </View>
                                <Text style={{ fontWeight: "bold" }}>Tin tức</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("TinTuc")}>
                                <Text style={{ color: "#597EF7", fontSize: 17, fontWeight: "bold" }}>Xem tất cả</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                            {this.renderPositiveNew(this.state.PositiveNews)}
                        </ScrollView>
                    </View>
                </ScrollView>
                <ContextMenu showContextMenu={this.state.ShowContextMenu}>
                    {/* <TouchableOpacity
                        style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10 }}
                        onPress={async () => {                    
                            await this.LoadData();
                            await this.LoadNotification();                          
                        }}
                    >
                        <FontAwesome5 name="sync" size={20} color="#597EF7" />
                        <Text style={{ marginLeft: 15, color: "#597EF7" }}>Reload</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10 }}
                        onPress={() => {
                            AuthenticationService.SignOut();
                            this.props.navigation.navigate("SrcLogin");
                        }}
                    >
                        <FontAwesome5 name="sign-out-alt" size={20} color="#597EF7" />
                        <Text style={{ marginLeft: 15, color: "#597EF7" }}>Đăng xuất</Text>
                    </TouchableOpacity>
                </ContextMenu>
            </View>
        );
    }
}
