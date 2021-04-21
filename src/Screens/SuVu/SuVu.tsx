import React from "react";
import {
    Text,
    View,
    Alert,
    TouchableOpacity,
    Dimensions,
    Button,
    BackHandler,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Image,
    TextInput,
} from "react-native";
import Theme from "../../Themes/Default";
import ApiUrl from "../../constants/ApiUrl";
import { WebView } from "react-native-webview";
import Toolbar from "../../components/Toolbar";
import HttpUtils from "../../Utils/HttpUtils";
import SMX from "../../constants/SMX";
import GlobalStore from "../../Stores/GlobalStore";
import Utility from "../../Utils/Utility";
import News from "../../Entities/News";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";
import NegativeNews from "../../Entities/NegativeNews";
import { inject, observer } from "mobx-react";
import NegativeNewsDto, { NegativeNewsFilter } from "../../DtoParams/NegativeNewsDto";
import GlobalCache from "../../Caches/GlobalCache";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

interface iProps {
    navigation: any;
    route?: any;
    GlobalStore: GlobalStore;
}

interface iState {
    LstNews: News[];
    PageIndex: number;
    FilterName: string;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class SuVuScreen extends React.Component<iProps, iState> {
    private onEndReachedSuVu = false;
    constructor(props: iProps) {
        super(props);
        this.state = {
            LstNews: [],
            PageIndex: 0,
            FilterName: "",
        };
    }

    async componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);

        await this.LoadData(false);

        this.props.GlobalStore.AdvanceSearchTrigger = () => {
            this.LoadData(false);
        };

    }

    handleBackPress = () => {
        return true;
    };

    async LoadData(IsLoadMore: boolean) {
        try {
            this.props.GlobalStore.ShowLoading();

            let request = new NegativeNewsDto();
            if (this.props.GlobalStore.AdvanceSearchValue != undefined) {
                request.Filter = this.props.GlobalStore.AdvanceSearchValue;
            } else {
                let filter = new NegativeNewsFilter();
                filter.PageIndex = this.state.PageIndex;
                filter.News = new News();
                filter.NegativeNews = new NegativeNews();
                request.Filter = filter;
            }

            let res = await HttpUtils.post<NegativeNewsDto>(
                ApiUrl.NegativeNews_ExecuteNegativeNews,
                SMX.ApiActionCode.SearchNegativeNews,
                JSON.stringify(request),
                true
            );

            // let res = await HttpUtils.post<NegativeNewsDto>(
            //     ApiUrl.NegativeNews_ExecuteNegativeNews,
            //     SMX.ApiActionCode.SearchData,
            //     JSON.stringify(request),
            //     true
            // );

            if (!IsLoadMore) this.setState({ LstNews: res.LstNews! });
            else this.setState({ LstNews: this.state.LstNews.concat(res.LstNews!) });

            this.props.GlobalStore.AdvanceSearchValue = undefined;
            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
            this.props.GlobalStore.HideLoading();
        }
    }

    renderItem(item: News) {
        return (
            <TouchableOpacity
                style={{
                    marginHorizontal: 10,
                    paddingVertical: 10,
                    backgroundColor: "white",
                    flexDirection: "row",
                    shadowOffset: { width: 0, height: 1 },
                    borderBottomWidth: 1,
                    borderBottomColor: "gainsboro",
                    alignItems: "center",
                }}
                onPress={() => this.DetailNegativeNews(item)}
            >
                {item.Attachment != null ? (
                    <View style={{ justifyContent: "center" }}>
                        <Image
                            source={{
                                uri: `${ApiUrl.Attachment_ImagePreview}?id=${item.Attachment.AttachmentID}&ecm=${item.Attachment.ECMItemID}&name=${item.Attachment.FileName}&size=1&token=${GlobalCache.UserToken}`,
                            }}
                            style={[styles.item, { borderRadius: 6, marginRight: 4 }]}
                        />
                    </View>
                ) : (
                    <Image
                        source={require("../../../assets/newsdefault.png")}
                        style={{ width: 45, height: 45, resizeMode: "contain", marginRight: 5 }}
                    />
                )}

                <View style={{ marginLeft: 4, paddingTop: 4, width: windowWidth - windowWidth / 6 }}>
                    <Text>{Utility.GetDateMinuteString(item.IncurredDTG)}</Text>
                    <Text style={{ fontWeight: "bold", width: "95%", marginTop: 3, fontSize: 14 }}>{item.Name}</Text>
                    <View
                        style={{ paddingTop: 4, width: "95%", flexDirection: "row", justifyContent: "space-between" }}
                    >
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ marginTop: 3 }}>Mức độ: </Text>
                            <Text
                                style={{
                                    marginTop: 3,
                                    color: Utility.GetDictionaryValue(SMX.Classification.dicColor, item.Classification),
                                }}
                            >
                                {Utility.GetDictionaryValue(SMX.Classification.dicName, item.Classification)}
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ marginTop: 3 }}>Trạng thái: </Text>
                            <Text
                                style={{
                                    marginTop: 3,
                                    color: Utility.GetDictionaryValue(SMX.NewStatus.dicColor, item.Status),
                                }}
                            >
                                {Utility.GetDictionaryValue(SMX.NewStatus.dicName, item.Status)}
                            </Text>
                        </View>
                    </View>
                    {/* <View style={{width: "90%", paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
                        
                    </View> */}
                </View>
            </TouchableOpacity>
        );
    }

    DetailNegativeNews(item: News) {
        this.props.navigation.navigate("DetailNegativeNews", {
            News: item,
        });
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Toolbar Title="Sự vụ" navigation={this.props.navigation} HasBottomTab={true}>
                    <View style={{ marginLeft: 10 }}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => {
                                this.props.navigation.navigate("AdvanceSearch");
                            }}
                        >
                            <AntDesign name="search1" size={27} color="#B3BDC6" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginLeft: 10 }}>
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
                <View
                    style={{
                        padding: 15,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                    }}
                >
                    <TextInput
                        style={{ borderWidth: 1, borderColor: "#1D39C4", borderRadius: 100, padding: 10, width: "80%" }}
                        placeholder="Tìm theo tiêu đề"
                        value={this.state.FilterName}
                        onChangeText={(val) => this.setState({ FilterName: val })}
                    />
                </View>
                <FlatList
                    style={{ backgroundColor: "#FFF", width: "100%", height: "89%" }}
                    data={this.state.LstNews.filter((x) =>
                        Utility.FormatVNLanguage(x.Name!.toLowerCase()).includes(
                            Utility.FormatVNLanguage(this.state.FilterName.toLowerCase())
                        )
                    )}
                    renderItem={({ item }) => this.renderItem(item)}
                    keyExtractor={(item, index) => index.toString()}
                    onMomentumScrollBegin={() => {
                        this.onEndReachedSuVu = false;
                    }}
                    onEndReached={() => {
                        if (!this.onEndReachedSuVu) {
                            if (this.state.LstNews.length >= 20) {
                                this.setState({ PageIndex: this.state.PageIndex + 1 }, async () => {
                                    await this.LoadData(true);
                                });
                                this.onEndReachedSuVu = true;
                            }
                        }
                    }}
                    onEndReachedThreshold={0.5}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: "gainsboro",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        paddingTop: 8,
        marginBottom: 4,
        width: windowWidth / 8,
        height: windowHeight / 15,
    },
});
