import React from "react";
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    Image,
    FlatList,
    Alert,
    KeyboardAvoidingView,
    Linking,
} from "react-native";
import Toolbar from "../../components/Toolbar";
import News from "../../Entities/News";
import { NewsDto, NewsFilter } from "../../DtoParams/NewsDto";
import Utility from "../../Utils/Utility";
import HttpUtils from "../../Utils/HttpUtils";
import ApiUrl from "../../constants/ApiUrl";
import SMX from "../../constants/SMX";
import GlobalStore from "../../Stores/GlobalStore";
import { inject, observer } from "mobx-react";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";
import GlobalCache from "../../Caches/GlobalCache";
import PositiveNews from "../../Entities/PositiveNews";
import CampaignNews from "../../Entities/CampaignNews";
import { LinearGradient } from "expo-linear-gradient";
import { CommentDto, CommentFilter } from "../../DtoParams/CommentDto";
import * as Enums from "../../constants/Enums";
import Comment from "../../Entities/Comment";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Fontisto from "react-native-vector-icons/Fontisto";
import CommentUC from "../Uc/CommentUC";
import adm_Attachment from "../../Entities/adm_Attachment";

const { width, height } = Dimensions.get("window");

interface iProps {
    navigation: any;
    route: any;
    GlobalStore: GlobalStore;
}

interface iState {
    News: News;
    selectedIndex: number;
    LstPositiveNews: PositiveNews[];
    LstCampaignNews: CampaignNews[];

    ExpendAll: boolean;

    CommentPageIndex: number;
    LstComment: Comment[];
    Comment: Comment;
    Content: string;
    EditContent?: string;
    EditRow?: number;
    CommentID?: number;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class TinTucDetailScreen extends React.Component<iProps, iState> {
    constructor(props: iProps) {
        super(props);
        this.state = {
            News: new News(),
            selectedIndex: 0,
            LstPositiveNews: [],
            LstCampaignNews: [],
            ExpendAll: false,
            CommentPageIndex: 0,
            LstComment: [],
            Content: "",
            Comment: null,
        };
    }

    async componentDidMount() {
        await this.LoadData();
    }

    async LoadData() {
        try {
            this.props.GlobalStore.ShowLoading();

            let request = new NewsDto();

            let filter = new NewsFilter();
            filter.NewsID = this.props.route.params.NewsID;
            request.Filter = filter;

            let res = await HttpUtils.post<NewsDto>(
                ApiUrl.News_ExecuteNews,
                SMX.ApiActionCode.SetupDisplay,
                JSON.stringify(request)
            );

            this.setState({
                News: res.NewsInfo!,
                LstPositiveNews: res.LstPositiveNews!,
                LstCampaignNews: res.LstCampaignNews!,
            });

            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
            this.props.GlobalStore.HideLoading();
        }
    }

    RenderListImage() {
        if (this.state.News) {
            if (this.state.News.ListAttachment) {
                return this.state.News!.ListAttachment!.map((att, index) => {
                    return (
                        <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                            <TouchableOpacity style={{ marginRight: 16 }} activeOpacity={0.9}>
                                <Image
                                    source={{
                                        uri: `${ApiUrl.Attachment_ImagePreview}?id=${att.AttachmentID}&ecm=${att.ECMItemID}&name=${att.FileName}&size=1&token=${GlobalCache.UserToken}`,
                                    }}
                                    style={{
                                        backgroundColor: "gainsboro",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: height / 6,
                                        width: width / 3,
                                        borderRadius: 4,
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                    );
                });
            }
        }
    }

    renderPositiveNews() {
        return this.state.LstPositiveNews.map((en) => (
            <View style={{ backgroundColor: "#F5F6F8", marginVertical: 10, borderRadius: 10, padding: 10 }}>
                <View>
                    <Text style={{ color: "#9C9C9D" }}>Phương tiện</Text>
                    <Text style={{ marginTop: 2 }}>
                        {Utility.GetDictionaryValue(SMX.PositiveType.dicName, en.Type)}
                    </Text>
                </View>

                <View style={{ marginTop: 10 }}>
                    <Text style={{ color: "#9C9C9D" }}>Kênh truyền thông</Text>
                    <Text style={{ marginTop: 2 }}>{en.PressAgencyName}</Text>
                </View>

                <View style={{ marginTop: 10 }}>
                    <Text style={{ color: "#9C9C9D" }}>Tiêu đề</Text>
                    <Text style={{ marginTop: 2 }}>{en.Title}</Text>
                </View>

                <View style={{ marginTop: 10 }}>
                    <Text style={{ color: "#9C9C9D" }}>Link bài viết</Text>
                    {en.Url ? (
                        <TouchableOpacity onPress={() => Linking.openURL(en.Url)}>
                            <Text style={{ color: "#2EA8EE" }}>{en.Url}</Text>
                        </TouchableOpacity>
                    ) : undefined}
                </View>

                <View style={{ marginTop: 10 }}>
                    <Text style={{ color: "#9C9C9D" }}>Ngày phát hành</Text>
                    <Text style={{ marginTop: 2 }}>{Utility.GetDateMinuteString(en.PublishDTG)}</Text>
                </View>
            </View>
        ));
    }

    renderCampaignNews() {
        return this.state.LstCampaignNews.map((en) => (
            <View style={{ backgroundColor: "#F5F6F8", marginVertical: 10, borderRadius: 10, padding: 10 }}>
                <Text style={{ color: "#9C9C9D" }}>Tuyến bài</Text>
                <View
                    style={{
                        marginTop: 2,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Text>{en.Campaign}</Text>
                    <Text>{en.NumberOfNews} bài</Text>
                </View>
            </View>
        ));
    }

    render() {
        let { News } = this.state;

        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Toolbar Title="Chi tiết tin tức" navigation={this.props.navigation} />
                <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
                    <ScrollView>
                        <View style={{ padding: 10 }}>
                            <View>
                                <View>
                                    {News.IncurredDTG ? (
                                        <Text style={{ color: "#9C9C9D", marginTop: 2 }}>
                                            {Utility.GetDateMinuteString(News.IncurredDTG)}
                                        </Text>
                                    ) : undefined}
                                    <Text style={{ fontWeight: "bold", fontSize: 17, marginTop: 2 }}>{News.Name}</Text>
                                </View>
                                <View
                                    style={{
                                        marginTop: 5,
                                        borderBottomWidth: 1,
                                        borderBottomColor: "gainsboro",
                                        paddingBottom: 10,
                                    }}
                                >
                                    <Text style={{ color: "#9C9C9D", marginTop: 2 }}>Tổng số bài đăng</Text>
                                    <Text style={{ marginTop: 2 }}>{News.NumberOfPublish} bài viết</Text>
                                </View>

                                <View
                                    style={{
                                        marginTop: 5,
                                        borderBottomWidth: 1,
                                        borderBottomColor: "gainsboro",
                                        paddingBottom: 10,
                                    }}
                                >
                                    <Text style={{ color: "#9C9C9D", marginTop: 2 }}>Danh mục</Text>
                                    <Text style={{ marginTop: 2 }}>{News.CatalogName}</Text>
                                </View>
                            </View>

                            <View
                                style={{
                                    paddingVertical: 12,
                                    borderBottomWidth: 1,
                                    borderBottomColor: "gainsboro",
                                }}
                            >
                                <Text style={{ color: "gray", marginTop: 4, marginBottom: 8 }}>Hình ảnh</Text>
                                <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                                    {this.RenderListImage()}
                                </ScrollView>
                            </View>

                            <View style={{ marginTop: 5 }}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <FontAwesome5 name="chart-bar" size={25} color="#9C9C9D" />
                                        <Text style={{ fontWeight: "bold", marginLeft: 5, color: "#9C9C9D" }}>
                                            Đánh giá:
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            backgroundColor: "#597EF7",
                                            paddingVertical: 5,
                                            paddingHorizontal: 10,
                                            borderRadius: 100,
                                        }}
                                        onPress={() => this.setState({ ExpendAll: !this.state.ExpendAll })}
                                    >
                                        {!this.state.ExpendAll ? (
                                            <>
                                                <Text style={{ marginRight: 5, color: "white" }}>Xem chi tiết</Text>
                                                <FontAwesome5 name="chevron-down" size={16} color="white" />
                                            </>
                                        ) : (
                                            <>
                                                <Text style={{ marginRight: 5, color: "white" }}>Thu nhỏ</Text>
                                                <FontAwesome5 name="chevron-up" size={16} color="white" />
                                            </>
                                        )}
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginTop: 10, height: !this.state.ExpendAll ? 100 : undefined }}>
                                    <LinearGradient
                                        colors={[
                                            "transparent",
                                            !this.state.ExpendAll ? "rgba(100, 100, 100, 0.1)" : undefined,
                                        ]}
                                        style={{
                                            height: !this.state.ExpendAll ? 100 : undefined,
                                            width: width - 20,
                                        }}
                                    >
                                        <Text style={{ height: !this.state.ExpendAll ? 100 : undefined }}>
                                            {News.Content}
                                        </Text>
                                    </LinearGradient>
                                </View>
                            </View>

                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                                <View style={{ height: 20, width: 5, backgroundColor: "#1D39C4" }}></View>
                                <Text style={{ fontWeight: "bold", color: "#1D39C4", marginLeft: 10 }}>
                                    Tuyến bài: {this.state.LstCampaignNews.length}
                                </Text>
                            </View>
                            {this.renderCampaignNews()}

                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                                <View style={{ height: 20, width: 5, backgroundColor: "#1D39C4" }}></View>
                                <Text style={{ fontWeight: "bold", color: "#1D39C4", marginLeft: 10 }}>
                                    Kết quả cụ thể: {this.state.LstPositiveNews.length}
                                </Text>
                            </View>
                            {this.renderPositiveNews()}
                        </View>

                        <CommentUC
                            RefID={this.props.route.params.NewsID}
                            RefType={Enums.CommentRefType.News}
                            RefTitle={this.props.route.params.Name}
                            GlobalStore={this.props.GlobalStore}
                        />
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        );
    }
}
