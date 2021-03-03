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
    Dimensions,
    Image,
    ImageBackground,
    TextInput,
} from "react-native";
import Theme from "../../Themes/Default";
import ApiUrl from "../../constants/ApiUrl";
import { WebView } from "react-native-webview";
import Toolbar from "../../components/Toolbar";
import HttpUtils from "../../Utils/HttpUtils";
import SMX from "../../constants/SMX";
import News from "../../Entities/News";
import { observer, inject } from "mobx-react";
import GlobalStore from "../../Stores/GlobalStore";
import { NewsDto, NewsFilter } from "../../DtoParams/NewsDto";
import Utility from "../../Utils/Utility";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import GlobalCache from "../../Caches/GlobalCache";
import AntDesign from "react-native-vector-icons/AntDesign";
import PopupModal from "../../components/PopupModal";

const { width, height } = Dimensions.get("window");

interface iProps {
    GlobalStore: GlobalStore;
    navigation: any;
}

interface iState {
    LstNews: News[];
    LstHorizontal: News[];
    LstVertical: News[];
    PageIndex: number;
    ShowSearch: boolean;

    NewsFilter: string;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class TinTucScreen extends Component<iProps, iState> {
    private onEndReachedCalledDuringMomentumTinTuc = false;

    constructor(props: iProps) {
        super(props);
        this.state = {
            LstNews: [],
            PageIndex: 0,
            LstHorizontal: [],
            LstVertical: [],
            ShowSearch: false,
            NewsFilter: "",
        };
    }

    async componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);

        await this.LoadData(false);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
    }

    handleBackPress = () => {
        return true;
    };

    async LoadData(IsLoadMore: boolean) {
        try {
            this.props.GlobalStore.ShowLoading();

            let request = new NewsDto();
            let filter = new NewsFilter();
            filter.PageIndex = this.state.PageIndex;
            request.Filter = filter;

            let res = await HttpUtils.post<NewsDto>(
                ApiUrl.News_ExecuteNews,
                SMX.ApiActionCode.SearchData,
                JSON.stringify(request)
            );

            if (!IsLoadMore) this.setState({ LstNews: res.LstNews! }, () => this.spreadLst());
            else this.setState({ LstNews: this.state.LstNews.concat(res.LstNews!) }, () => this.spreadLst());

            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
            this.props.GlobalStore.HideLoading();
        }
    }

    spreadLst() {
        if (this.state.LstNews.length < 5) {
            this.setState({ LstVertical: this.state.LstNews.slice(1, this.state.LstNews.length) });
        } else {
            this.setState({
                LstVertical: this.state.LstNews.slice(4, this.state.LstNews.length),
                LstHorizontal: this.state.LstNews.slice(1, 4),
            });
        }
    }

    renderItem(item: News) {
        return (
            <TouchableOpacity
                style={{ margin: 10, flexDirection: "row", alignItems: "center" }}
                onPress={() => this.props.navigation.navigate("TinTucDetail", { NewsID: item.NewsID, Name: item.Name })}
            >
                {item.Attachment && item.Attachment!.AttachmentID && item.Attachment!.AttachmentID != null ? (
                    <Image
                        source={{
                            uri: `${ApiUrl.Attachment_ImagePreview}?id=${item.Attachment!.AttachmentID}&ecm=${
                                item.Attachment!.ECMItemID
                            }&name=${item.Attachment!.FileName}&size=1&token=${GlobalCache.UserToken}`,
                        }}
                        style={{ width: 100, height: 70, borderRadius: 10 }}
                    />
                ) : (
                    <Image source={require("../../../assets/newsdefault.png")} style={{ width: 100, height: 70 }} />
                )}

                <View style={{ marginLeft: 15 }}>
                    {item.IncurredDTG ? (
                        <Text style={{ color: "#9C9C9D" }}>{Utility.GetDateString(item.IncurredDTG)}</Text>
                    ) : undefined}
                    <Text style={{ fontWeight: "bold", marginTop: 3, fontSize: 17, width: width - (100 + 15 + 40) }}>
                        {item.Name.trim()}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    renderContentInImageBackground(LstNews: News[]) {
        return (
            <View
                style={{
                    padding: 15,
                    backgroundColor: "rgba(52, 52, 52, 0.4)",
                    //borderRadius: 15,
                    width: width,
                    height: width / 1.5,
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
                        {LstNews[0].Name}
                    </Text>
                    {LstNews[0].IncurredDTG ? (
                        <Text style={{ color: "white" }}>{Utility.GetDateMinuteString(LstNews[0].IncurredDTG)}</Text>
                    ) : undefined}
                </View>
            </View>
        );
    }

    render() {
        let { LstNews } = this.state;

        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Toolbar Title="Tin tức" navigation={this.props.navigation} HasBottomTab={true}>
                    <View style={{ marginLeft: 10, flexDirection: "row" }}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={{ marginRight: 15 }}
                            onPress={() => {
                                this.setState({ ShowSearch: !this.state.ShowSearch });
                            }}
                        >
                            <AntDesign name="search1" size={25} color={this.state.ShowSearch ? "#1D39C4" : "#B3BDC6"} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => {
                                this.setState({ PageIndex: 0 }, () => {
                                    this.LoadData(false);
                                });
                            }}
                        >
                            <AntDesign name="reload1" size={25} color="#B3BDC6" />
                        </TouchableOpacity>
                    </View>
                </Toolbar>
                <ScrollView>
                    <View style={{ flex: 1 }}>
                        {!this.state.ShowSearch ? (
                            <>
                                {LstNews &&
                                LstNews[0] &&
                                LstNews[0].Attachment &&
                                LstNews[0].Attachment.AttachmentID ? (
                                    <TouchableOpacity
                                        onPress={() =>
                                            this.props.navigation.navigate("TinTucDetail", {
                                                NewsID: LstNews[0].NewsID,
                                                Name: LstNews[0].Name,
                                            })
                                        }
                                    >
                                        <ImageBackground
                                            source={{
                                                uri: `${ApiUrl.Attachment_ImagePreview}?id=${
                                                    LstNews[0].Attachment!.AttachmentID
                                                }&ecm=${LstNews[0].Attachment!.ECMItemID}&name=${
                                                    LstNews[0].Attachment!.FileName
                                                }&size=1&token=${GlobalCache.UserToken}`,
                                            }}
                                            style={{ width: width, height: width / 1.5 }}
                                        >
                                            {this.renderContentInImageBackground(LstNews)}
                                        </ImageBackground>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        onPress={() =>
                                            this.props.navigation.navigate("TinTucDetail", {
                                                NewsID: LstNews[0].NewsID,
                                                Name: LstNews[0].Name,
                                            })
                                        }
                                    >
                                        <ImageBackground
                                            source={require("../../../assets/newsdefault.png")}
                                            style={{ width: width, height: width / 1.5 }}
                                            imageStyle={{ resizeMode: "contain" }}
                                        >
                                            <View
                                                style={{
                                                    //padding: 15,
                                                    //backgroundColor: "rgba(52, 52, 52, 0.4)",
                                                    //borderRadius: 15,
                                                    width: width,
                                                    height: width / 1.5,
                                                    flexDirection: "row",
                                                }}
                                            >
                                                {LstNews && LstNews[0]
                                                    ? this.renderContentInImageBackground(LstNews)
                                                    : undefined}
                                            </View>
                                        </ImageBackground>
                                    </TouchableOpacity>
                                )}

                                <View style={{ height: 240 }}>
                                    <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                                        {this.state.LstHorizontal.map((item) => (
                                            <TouchableOpacity
                                                style={{ margin: 10, borderRadius: 15 }}
                                                onPress={() =>
                                                    this.props.navigation.navigate("TinTucDetail", {
                                                        NewsID: item.NewsID,
                                                        Name: item.Name,
                                                    })
                                                }
                                            >
                                                {item.Attachment ? (
                                                    <ImageBackground
                                                        source={{
                                                            uri: `${ApiUrl.Attachment_ImagePreview}?id=${
                                                                item.Attachment!.AttachmentID
                                                            }&ecm=${item.Attachment!.ECMItemID}&name=${
                                                                item.Attachment!.FileName
                                                            }&size=1&token=${GlobalCache.UserToken}`,
                                                        }}
                                                        style={{
                                                            width: 250,
                                                            height: 220,
                                                        }}
                                                        imageStyle={{
                                                            borderRadius: 15,
                                                        }}
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
                                                            <View
                                                                style={{
                                                                    alignSelf: "flex-end",
                                                                }}
                                                            >
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
                                                ) : (
                                                    <ImageBackground
                                                        source={require("../../../assets/newsdefault.png")}
                                                        style={{
                                                            width: 300,
                                                            height: 220,
                                                        }}
                                                    >
                                                        <View
                                                            style={{
                                                                backgroundColor: "rgba(52, 52, 52, 0.5)",
                                                                width: 300,
                                                                height: 220,
                                                                borderRadius: 10,
                                                                padding: 10,
                                                            }}
                                                        >
                                                            {item.IncurredDTG ? (
                                                                <Text style={{ color: "white" }}>
                                                                    {Utility.GetDateString(item.IncurredDTG)}
                                                                </Text>
                                                            ) : undefined}
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
                                                        </View>
                                                    </ImageBackground>
                                                )}
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            </>
                        ) : (
                            <View
                                style={{
                                    padding: 15,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "100%",
                                }}
                            >
                                <TextInput
                                    style={{
                                        borderWidth: 1,
                                        borderColor: "#1D39C4",
                                        borderRadius: 100,
                                        padding: 10,
                                        width: "80%",
                                    }}
                                    placeholder="Tiêu đề hoặc nội dung"
                                    value={this.state.NewsFilter}
                                    onChangeText={(val) => this.setState({ NewsFilter: val })}
                                />
                            </View>
                        )}

                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, marginLeft: 10 }}>
                            <View style={{ height: 25, width: 7, backgroundColor: "#1D39C4" }}></View>
                            <Text style={{ fontWeight: "bold", color: "#1D39C4", marginLeft: 10 }}>Tin tổng hợp</Text>
                        </View>
                        <FlatList
                            style={{ backgroundColor: "#FFF", width: "100%" }}
                            data={
                                this.state.ShowSearch
                                    ? this.state.LstNews.filter(
                                          (x) =>
                                              Utility.FormatVNLanguage(x.Name!.toLowerCase()).includes(
                                                  Utility.FormatVNLanguage(this.state.NewsFilter.toLowerCase())
                                              ) ||
                                              Utility.FormatVNLanguage(x.Content!.toLowerCase()).includes(
                                                  Utility.FormatVNLanguage(this.state.NewsFilter.toLowerCase())
                                              )
                                      )
                                    : this.state.LstVertical
                            }
                            renderItem={({ item }) => this.renderItem(item)}
                            keyExtractor={(item, index) => index.toString()}
                            removeClippedSubviews={true}
                            ListFooterComponent={() => (
                                <View
                                    style={{
                                        paddingBottom: 10,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexDirection: "row",
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            paddingVertical: 10,
                                            paddingHorizontal: 30,
                                            backgroundColor: "#597EF7",
                                            borderRadius: 4,
                                            flexDirection: "row",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                        onPress={() => {
                                            this.setState({ PageIndex: this.state.PageIndex + 1 }, async () => {
                                                await this.LoadData(true);
                                            });
                                        }}
                                    >
                                        <Text style={{ color: "white" }}>Tải thêm</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    </View>
                </ScrollView>
                {/* <PopupModal modalVisible={this.state.ShowSearch} title="Tìm kiếm">
                    <TextInput
                        style={{ borderWidth: 1, borderColor: "#1D39C4", borderRadius: 100, padding: 10 }}
                        placeholder="Tiêu đề"
                        value={this.state.NewsTitle}
                        onChangeText={(val) => this.setState({ NewsTitle: val })}
                    />
                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderColor: "#1D39C4",
                            borderRadius: 100,
                            padding: 10,
                            marginTop: 10,
                        }}
                        placeholder="Nội dung"
                        value={this.state.NewsContent}
                        onChangeText={(val) => this.setState({ NewsContent: val })}
                    />
                    <TouchableOpacity
                        style={[Theme.BtnSmPrimary, { borderRadius: 100, marginTop: 10, alignSelf: "center" }]}
                        onPress={() => this.setState({ ShowSearch: false })}
                    >
                        <Text style={{ color: "white" }}>Đóng</Text>
                    </TouchableOpacity>
                </PopupModal> */}
            </View>
        );
    }
}
