import React from "react";
import {
    Alert,
    View,
    FlatList,
    Linking,
    Text,
    KeyboardAvoidingView,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Image,
    StyleSheet,
    Modal as Dialog,
    TextInput,
} from "react-native";
import Theme from "../../Themes/Default";
import ApiUrl from "../../constants/ApiUrl";
import * as Enum from "../../constants/Enums";
import SMX from "../../constants/SMX";
import GlobalStore from "../../Stores/GlobalStore";
import { observer, inject } from "mobx-react";
import Toolbar from "../../components/Toolbar";
import News from "../../Entities/News";
import Utility from "../../Utils/Utility";
import HttpUtils from "../../Utils/HttpUtils";
import NegativeNewsDto from "../../DtoParams/NegativeNewsDto";
import NegativeNews from "../../Entities/NegativeNews";
import adm_Attachment from "../../Entities/adm_Attachment";
import Comment from "../../Entities/Comment";
import GlobalCache from "../../Caches/GlobalCache";
import { CommonDto } from "../../DtoParams/CommonDto";
import ImageViewer from "react-native-image-zoom-viewer";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Fontisto from "react-native-vector-icons/Fontisto";
import Modal from "react-native-modal";
import NegativeNewsResearched from "../../Entities/NegativeNewsResearched";
import NegativeNewsResearchedDto from "../../DtoParams/NegativeNewsResearchedDto";
import { LinearGradient } from "expo-linear-gradient";
import { CommentDto, CommentFilter } from "../../DtoParams/CommentDto";
import { NewsResearched } from "../../Entities/NewsResearched";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

interface iProps {
    route: any;
    navigation: any;
    GlobalStore: GlobalStore;
    NewsID: number;
    News: News;
}

interface iState {
    News: News;
    LstNegativeNews: NegativeNews[];
    ListAttachment: adm_Attachment[];
    SelectedFullScreen: adm_Attachment;
    SelectedNegativeNews: NegativeNews;
    Visible: boolean;
    selectedIndex: number;
    ListNewsResearched: NewsResearched[];
    ListNegativeNewResearched: NegativeNewsResearched[];
    ResearchedAttachments: adm_Attachment[];
    JudgeExpendAll: boolean;
    AgencyAll: boolean;
    SuggestAll: boolean;
    ApproveAll: boolean;
    ResultExpendAll: boolean;
    //chưa lên báo
    ResultHandleAll: boolean;
    ReporterAll: boolean;
    ContentAll: boolean;
    QuestionDetailAll: boolean;
    ResolutionAll: boolean;
    ResolutionContentAll: boolean;
    // đã lên báo
    ReJudgedAll: boolean;
    MethodHandleAll: boolean;
    ResultAll: boolean;
    NoteAll: boolean;
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
export default class Display extends React.Component<iProps, iState> {
    constructor(props: iProps) {
        super(props);
        this.state = {
            News: this.props.route.params.News,
            LstComment: [],
            LstNegativeNews: [],
            ListAttachment: [],
            SelectedFullScreen: null,
            SelectedNegativeNews: null,
            Visible: false,
            selectedIndex: 0,
            ListNewsResearched: [],
            ListNegativeNewResearched: [],
            ResearchedAttachments: [],
            JudgeExpendAll: false,
            AgencyAll: false,
            SuggestAll: false,
            ApproveAll: false,
            ResultExpendAll: false,
            //chua len bao
            ResultHandleAll: false,
            ReporterAll: false,
            ContentAll: false,
            QuestionDetailAll: false,
            ResolutionAll: false,
            ResolutionContentAll: false,
            //da len bao
            ReJudgedAll: false,
            MethodHandleAll: false,
            ResultAll: false,
            NoteAll: false,
            CommentPageIndex: 0,
            Comment: null,
            Content: "",
        };
    }

    async componentDidMount() {
        await this.LoadData();
        await this.LoadComment(false);
    }

    async LoadData() {
        try {
            this.props.GlobalStore.ShowLoading();
            let request = new NegativeNewsDto();
            request.NewsID = this.state.News.NewsID;

            let res = await HttpUtils.post<NegativeNewsDto>(
                ApiUrl.NegativeNews_ExecuteNegativeNews,
                SMX.ApiActionCode.SetupDisplay,
                JSON.stringify(request),
                true
            );

            this.setState({
                LstNegativeNews: res?.LstNegativeNews,
                ListAttachment: res?.ListAttachment,
                ListNewsResearched: res?.ListNewsResearched,
            });

            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
            this.props.GlobalStore.HideLoading();
        }
    }

    async LoadComment(IsLoadMore: boolean) {
        try {
            this.props.GlobalStore.ShowLoading();
            let request = new CommentDto();
            let filter = new CommentFilter();
            filter.RefID = this.state.News.NewsID;
            filter.RefType = Enum.CommentRefType.NegativeNews;
            request.Filter = filter;

            let res = await HttpUtils.post<CommentDto>(
                ApiUrl.Comment_ExecuteComment,
                SMX.ApiActionCode.SearchData,
                JSON.stringify(request),
                true
            );

            if (!IsLoadMore) this.setState({ LstComment: res!.LstComment });
            else this.setState({ LstComment: this.state.LstComment.concat(res!.LstComment!) });
            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
            this.props.GlobalStore.HideLoading();
        }
    }

    async saveComment(insert: boolean) {
        try {
            this.props.GlobalStore.ShowLoading();
            let request = new CommentDto();
            let filter = new CommentFilter();
            let comment = new Comment();
            comment.RefTitle = this.state.News.Name;
            comment.RefID = this.state.News.NewsID;
            comment.RefType = Enum.CommentRefType.NegativeNews;
            if (insert) {
                comment.Content = this.state.Content;
            } else {
                comment.CommentID = this.state.CommentID;
                comment.Content = this.state.EditContent;
            }
            comment.Rate = Enum.Rate.BinhThuong;
            filter.Comment = comment;
            request.Filter = filter;

            let res = await HttpUtils.post<CommentDto>(
                ApiUrl.Comment_ExecuteComment,
                SMX.ApiActionCode.SaveItem,
                JSON.stringify(request),
                true
            );

            if (insert) {
                this.setState({ Content: "", LstComment: this.state.LstComment!.concat(res!.Comment) });
            } else {
                let index = this.state.LstComment.findIndex((x) => x.CommentID == res!.Comment!.CommentID!);
                let comments = this.state.LstComment;
                comments[index] = res!.Comment!;
                this.setState({ EditContent: "", LstComment: comments });
            }

            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
            this.props.GlobalStore.HideLoading();
        }
    }

    confirmToDeleteComment(comment: Comment) {
        Alert.alert(
            "Xóa bình luận",
            "Bạn có chắc chắn muốn xóa bình luận này không?",
            [
                {
                    text: "Hủy",
                    style: "cancel",
                },
                { text: "Xóa", onPress: () => this.DeleteComment(comment) },
            ],
            { cancelable: false }
        );
    }

    async DeleteComment(comment: Comment) {
        try {
            this.props.GlobalStore.ShowLoading();
            let request = new CommentDto();
            let filter = new CommentFilter();
            filter.Comment = comment;
            request.Filter = filter;

            let res = await HttpUtils.post<CommentDto>(
                ApiUrl.Comment_ExecuteComment,
                SMX.ApiActionCode.DeleteItem,
                JSON.stringify(request),
                true
            );

            this.setState({ LstComment: this.state.LstComment!.filter((x) => x.CommentID != res.CommentID) });

            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
            this.props.GlobalStore.HideLoading();
        }
    }

    async LoadListNegativeNewsResearched(negativeNews: NegativeNews, chuaphatsinh: boolean) {
        try {
            this.props.GlobalStore.ShowLoading();
            let request = new NegativeNewsResearchedDto();
            request.NegativeNewsID = negativeNews.NegativeNewsID;

            let res = await HttpUtils.post<NegativeNewsResearchedDto>(
                ApiUrl.NegativeNewsResearched_ExecuteNegativeNewsResearched,
                SMX.ApiActionCode.SearchData,
                JSON.stringify(request),
                true
            );

            if (chuaphatsinh) {
                this.setState({
                    ListNegativeNewResearched: res.ListResearched!,
                    SelectedNegativeNews: negativeNews,
                    ResearchedAttachments: res.ListAttachment!,
                    Visible: true,
                });
            } else {
                this.setState({
                    SelectedNegativeNews: negativeNews,
                    ResearchedAttachments: res.ListAttachment!,
                    Visible: true,
                });
            }

            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
            this.props.GlobalStore.HideLoading();
        }
    }

    RenderItem(item: NegativeNews) {
        return (
            <TouchableOpacity
                style={{ marginBottom: 5, borderBottomColor: "gainsboro", borderBottomWidth: 1 }}
                onPress={() => {
                    if (item.Type == Enum.NegativeNews.ChuaPhatSinh) {
                        this.LoadListNegativeNewsResearched(item, true);
                    } else {
                        this.LoadListNegativeNewsResearched(item, false);
                    }
                }}
            >
                <View style={{ justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row", marginBottom: 12, marginTop: 8 }}>
                        <View style={{ height: 80, width: 80, borderRadius: 40 }}>
                            {item.Attachment != null ? (
                                <View style={{ justifyContent: "center" }}>
                                    <Image
                                        source={{
                                            uri: `${ApiUrl.Attachment_ImagePreview}?id=${item.Attachment.AttachmentID}&ecm=${item.Attachment.ECMItemID}&name=${item.Attachment.FileName}&size=1&token=${GlobalCache.UserToken}`,
                                        }}
                                        style={{ width: 80, height: 80, resizeMode: "contain", marginRight: 4 }}
                                    />
                                </View>
                            ) : (
                                    <View
                                        style={{
                                            height: 80,
                                            width: 80,
                                            marginRight: 4,
                                            backgroundColor: "#C4E3CF",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {/* <Text style={{ fontSize: 30, textAlign: 'center' }}>SV</Text> */}
                                    </View>
                                )}
                        </View>
                        <View style={{ paddingLeft: 16 }}>
                            <View style={{ justifyContent: "center" }}>
                                <Text style={{ fontWeight: "bold", fontSize: 14 }}>{item.PressAgencyName}</Text>
                            </View>
                            <View style={{ marginTop: 4, marginBottom: 12, justifyContent: "space-between" }}>
                                <View style={{ flexDirection: "row", marginTop: 4 }}>
                                    <FontAwesome5 name="rss" size={18} color="gray" />
                                    <Text style={{ paddingTop: 3, marginLeft: 8 }}>Trạng thái tin: </Text>
                                    <Text
                                        style={{
                                            paddingTop: 3,
                                            color: Utility.GetDictionaryValue(SMX.NegativeNews.dicColor, item.Type),
                                        }}
                                    >
                                        {Utility.GetDictionaryValue(SMX.NegativeNews.dicName, item.Type)}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: "row", marginTop: 4 }}>
                                    <FontAwesome5 name="ethereum" size={18} color="gray" />
                                    <Text style={{ paddingTop: 3, marginLeft: 12 }}>Trạng thái xử lý: </Text>
                                    <Text
                                        style={{
                                            paddingTop: 3,
                                            color: Utility.GetDictionaryValue(SMX.NewStatus.dicColor, item.Status),
                                        }}
                                    >
                                        {Utility.GetDictionaryValue(SMX.NewStatus.dicName, item.Status)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    DetailDisplayNegativeNews(item: NegativeNews) {
        this.props.navigation.navigate("DetailDisplayNegativeNews", {
            NegativeNews: item,
        });
    }

    RenderListImage(lstAttachment: adm_Attachment[]) {
        return lstAttachment.map((att) => (
            <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                <TouchableOpacity
                    onPress={() => this.setState({ SelectedFullScreen: att })}
                    style={{ marginRight: 16 }}
                >
                    <Image
                        source={{
                            uri: `${ApiUrl.Attachment_ImagePreview}?id=${att.AttachmentID}&ecm=${att.ECMItemID}&name=${att.FileName}&size=1&token=${GlobalCache.UserToken}`,
                        }}
                        style={[styles.item, { justifyContent: "center", borderRadius: 4 }]}
                    />
                </TouchableOpacity>
            </View>
        ));
    }

    RenderListNegativeImage(lstAttachment: adm_Attachment[]) {
        return lstAttachment.map((att) => (
            <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                <TouchableOpacity style={{ marginRight: 16 }} activeOpacity={0.9}>
                    <Image
                        source={{
                            uri: `${ApiUrl.Attachment_ImagePreview}?id=${att.AttachmentID}&ecm=${att.ECMItemID}&name=${att.FileName}&size=1&token=${GlobalCache.UserToken}`,
                        }}
                        style={[styles.item, { justifyContent: "center", borderRadius: 4 }]}
                    />
                </TouchableOpacity>
            </View>
        ));
    }

    RenderImage(att: adm_Attachment) {
        return (
            <TouchableOpacity onPress={() => this.setState({ SelectedFullScreen: att })}>
                <Image
                    source={{
                        uri: `${ApiUrl.Attachment_ImagePreview}?id=${att.AttachmentID}&ecm=${att.ECMItemID}&name=${att.FileName}&size=1&token=${GlobalCache.UserToken}`,
                    }}
                    style={[styles.item, { justifyContent: "center", marginRight: 4, borderRadius: 4 }]}
                />
            </TouchableOpacity>
        );
    }

    handleRemoveImage = async (attachment: adm_Attachment) => {
        try {
            this.props.GlobalStore.ShowLoading();
            let request = new CommonDto();
            let res = await HttpUtils.post<CommonDto>(
                ApiUrl.Common_ExecuteAttachment,
                SMX.ApiActionCode.DeleteItem,
                JSON.stringify(request),
                true
            );

            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
            this.props.GlobalStore.HideLoading();
        }
    };

    handleEditImage(attachment: adm_Attachment) {
        this.setState({ SelectedFullScreen: null }, () => {
            this.props.navigation.navigate("SrcUpdateImage", {
                attachment: attachment,
            });
        });
    }

    RenderNewsResearched(lstNewsResearched: NewsResearched[]) {
        return lstNewsResearched.map((item) => (
            <View
                style={{
                    backgroundColor: "#F0F5FF",
                    borderWidth: 1,
                    borderColor: "#2F54EB",
                    width: windowWidth - 40,
                    padding: 10,
                    margin: 10,
                    borderRadius: 15,
                }}
            >
                <Text style={{ marginTop: 4 }}>Thời gian: {Utility.GetDateString(item.CreatedDTG)}</Text>
                <Text style={{ marginTop: 4 }}>Hình thức: {item.TypeOfContact}</Text>
                <Text style={{ marginTop: 4 }}>ĐV/CN trao đổi: {item.Content}</Text>
                <Text style={{ marginTop: 4 }}>ND trao đổi: {item.ObjectContact}</Text>
                <Text style={{ marginTop: 4 }}>ND thống nhất: {item.Result}</Text>
            </View>
        ));
    }

    RenderNegativeNewsResearched(lstResearched: NegativeNewsResearched[]) {
        return lstResearched.map((item) => (
            <View
                style={{
                    backgroundColor: "#F0F5FF",
                    borderWidth: 1,
                    borderColor: "#2F54EB",
                    width: windowWidth - 34,
                    padding: 10,
                    margin: 10,
                    borderRadius: 15,
                }}
            >
                <Text style={{ marginTop: 4 }}>Thời gian: {Utility.GetDateString(item.CreatedDTG)}</Text>
                <Text style={{ marginTop: 4 }}>Hình thức trao đổi: {item.TypeOfContact}</Text>
                <Text style={{ marginTop: 4 }}>Đơn vị/Cá nhân trao đổi: {item.Content}</Text>
                <Text style={{ marginTop: 4 }}>Nội dung trao đổi: {item.ObjectContact}</Text>
                <Text style={{ marginTop: 4 }}>Nội dung thống nhất: {item.Result}</Text>
            </View>
        ));
    }

    RenderComment(item: Comment, index: number) {
        return (
            <View style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: "row" }}>
                    <View
                        style={{
                            height: windowWidth / 10,
                            width: windowWidth / 10,
                            backgroundColor: "#85A5FF",
                            borderRadius: windowWidth / 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <AntDesign name="user" size={22} color="#FFFFFF" />
                    </View>
                    <View>
                        <View
                            style={{
                                width: (8 * windowWidth) / 10,
                                marginLeft: 5,
                                padding: 8,
                                backgroundColor: "#F2F3F8",
                                borderRadius: 15,
                            }}
                        >
                            <Text style={{ fontWeight: "bold", fontSize: 14 }}>{item.CommentedByName}</Text>
                            {this.state.EditRow && this.state.EditRow == index ? (
                                <View>
                                    <TextInput
                                        numberOfLines={4}
                                        multiline={true}
                                        value={this.state.EditContent}
                                        onChangeText={(val) => this.setState({ EditContent: val })}
                                    />
                                    <View style={{ marginRight: 8, marginTop: 8, flexDirection: "row", justifyContent: "flex-end" }}>
                                        <TouchableOpacity
                                            style={{ marginRight: 15 }}
                                            onPress={() => this.setState({ EditRow: undefined })}
                                        >
                                            <Text style={{ fontWeight: "bold", color: "#848484" }}>Cancel</Text>
                                        </TouchableOpacity>
                                        {
                                            this.state.EditContent.length > 0 ? (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.setState({ EditRow: undefined }, () => this.saveComment(false))
                                                    }
                                                >
                                                    <Text style={{ fontWeight: "bold", color: "#0040FF" }}>Update</Text>
                                                </TouchableOpacity>
                                            ) : (
                                                    <TouchableOpacity>
                                                        <Text style={{ fontWeight: "bold", color: "#848484" }}>Update</Text>
                                                    </TouchableOpacity>
                                                )
                                        }
                                    </View>
                                </View>
                            ) : (
                                    <Text style={{ marginTop: 4 }}>{item.Content}</Text>
                                )}
                        </View>
                        {this.state.EditRow === undefined || this.state.EditRow !== index ? (
                            <View style={{ flexDirection: "row", marginTop: 4, marginLeft: 13 }}>
                                <Text style={{ fontSize: 13, marginRight: 20 }}>
                                    {Utility.GetDateMinuteString(item.CommentedDTG)}
                                </Text>
                                {item.CommentedByID === GlobalCache.Profile.EmployeeID ? (
                                    <View style={{ flexDirection: "row" }}>
                                        <TouchableOpacity
                                            style={{ marginRight: 20 }}
                                            onPress={() =>
                                                this.setState({
                                                    EditRow: index,
                                                    EditContent: item.Content,
                                                    CommentID: item.CommentID,
                                                })
                                            }
                                        >
                                            <Text style={{ fontWeight: "bold", color: "#848484" }}>Sửa</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={{ marginRight: 20 }}
                                            onPress={() => this.confirmToDeleteComment(item)}
                                        >
                                            <Text style={{ fontWeight: "bold", color: "#848484" }}>Xóa</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                        <View></View>
                                    )}
                            </View>
                        ) : undefined}
                    </View>
                </View>
            </View>
        );
    }

    render() {
        let { News, SelectedNegativeNews } = this.state;
        var Urls;
        if (SelectedNegativeNews != null && SelectedNegativeNews.Url) {
            Urls = SelectedNegativeNews.Url.split("\n");
        } else {
            Urls = null;
        }

        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Toolbar Title="Chi tiết sự vụ" navigation={this.props.navigation}>
                    <View style={{ flexDirection: "row" }}></View>
                </Toolbar>
                <KeyboardAvoidingView behavior={"height"} style={{ flex: 1 }} keyboardVerticalOffset={0}>
                    <ScrollView>
                        <View style={{ padding: 12 }}>
                            <View style={{ paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: "gainsboro" }}>
                                <Text style={{ color: "gray", marginBottom: 4 }}>
                                    {Utility.GetDateMinuteString(News.IncurredDTG)}
                                </Text>
                                <Text style={{ fontWeight: "bold", fontSize: 17, marginBottom: 6 }}>{News.Name}</Text>
                                <View style={{ flexDirection: "row", marginBottom: 4 }}>
                                    <Text>Loại sự vụ: </Text>
                                    <Text
                                        style={{
                                            color: Utility.GetDictionaryValue(
                                                SMX.NegativeNews.dicColor,
                                                News.NegativeType
                                            ),
                                        }}
                                    >
                                        {Utility.GetDictionaryValue(SMX.NegativeNews.dicName, News.NegativeType)}
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    paddingVertical: 12,
                                    borderBottomWidth: 1,
                                    borderBottomColor: "gainsboro",
                                }}
                            >
                                <View style={{ flexDirection: "row", marginBottom: 4 }}>
                                    <Text style={{ marginTop: 8 }}>Mức độ: </Text>
                                    <Text
                                        style={{
                                            marginTop: 8,
                                            color: Utility.GetDictionaryValue(
                                                SMX.Classification.dicColor,
                                                News.Classification
                                            ),
                                        }}
                                    >
                                        {Utility.GetDictionaryValue(SMX.Classification.dicName, News.Classification)}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={{ marginTop: 8 }}>Trạng thái: </Text>
                                    <Text
                                        style={{
                                            marginTop: 8,
                                            color: Utility.GetDictionaryValue(SMX.NewsStatus.dicColor, News.Status),
                                        }}
                                    >
                                        {Utility.GetDictionaryValue(SMX.NewStatus.dicName, News.Status)}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "gainsboro" }}>
                                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                                    <FontAwesome5 name="image" size={windowWidth / 18} color="gray" />
                                    <Text style={{ color: "gray", marginLeft: 4 }}>Hình ảnh</Text>
                                </View>
                                <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                                    {this.RenderListImage(this.state.ListAttachment)}
                                </ScrollView>
                            </View>

                            <View
                                style={{
                                    paddingTop: 4,
                                    paddingBottom: 12,
                                    borderBottomWidth: 1,
                                    borderBottomColor: "gainsboro",
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                                        <FontAwesome5 name="chart-bar" size={windowWidth / 20} color="gray" />
                                        <Text style={{ color: "gray", marginLeft: 4 }}>Đánh giá chi tiết</Text>
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
                                        onPress={() => this.setState({ JudgeExpendAll: !this.state.JudgeExpendAll })}
                                    >
                                        {!this.state.JudgeExpendAll ? (
                                            <>
                                                <Text style={{ marginRight: 5, color: "white" }}>Xem tất cả</Text>
                                                <FontAwesome5 name="chevron-down" size={16} color="white" />
                                            </>
                                        ) : (
                                                <>
                                                    <Text style={{ marginRight: 5, color: "white" }}>Thu gọn</Text>
                                                    <FontAwesome5 name="chevron-up" size={16} color="white" />
                                                </>
                                            )}
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginTop: 10, height: !this.state.JudgeExpendAll ? 100 : undefined }}>
                                    <LinearGradient
                                        colors={[
                                            "transparent",
                                            !this.state.JudgeExpendAll ? "rgba(100, 100, 100, 0.1)" : undefined,
                                        ]}
                                        style={{
                                            height: !this.state.JudgeExpendAll ? 100 : undefined,
                                            width: windowWidth - 20,
                                        }}
                                    >
                                        <Text style={{ height: !this.state.JudgeExpendAll ? 100 : undefined }}>
                                            {News.RatedLevel}
                                        </Text>
                                    </LinearGradient>
                                </View>
                            </View>

                            <View
                                style={{
                                    paddingTop: 4,
                                    paddingBottom: 12,
                                    borderBottomWidth: 1,
                                    borderBottomColor: "gainsboro",
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                                        <FontAwesome5 name="chart-bar" size={windowWidth / 20} color="gray" />
                                        <Text style={{ color: "gray", marginLeft: 4 }}>Cơ quan báo chí liên hệ</Text>
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
                                        onPress={() => this.setState({ AgencyAll: !this.state.AgencyAll })}
                                    >
                                        {!this.state.AgencyAll ? (
                                            <>
                                                <Text style={{ marginRight: 5, color: "white" }}>Xem tất cả</Text>
                                                <FontAwesome5 name="chevron-down" size={16} color="white" />
                                            </>
                                        ) : (
                                                <>
                                                    <Text style={{ marginRight: 5, color: "white" }}>Thu gọn</Text>
                                                    <FontAwesome5 name="chevron-up" size={16} color="white" />
                                                </>
                                            )}
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginTop: 10, height: !this.state.AgencyAll ? 100 : undefined }}>
                                    <LinearGradient
                                        colors={[
                                            "transparent",
                                            !this.state.AgencyAll ? "rgba(100, 100, 100, 0.1)" : undefined,
                                        ]}
                                        style={{
                                            height: !this.state.AgencyAll ? 100 : undefined,
                                            width: windowWidth - 20,
                                        }}
                                    >
                                        <Text style={{ height: !this.state.AgencyAll ? 100 : undefined }}>
                                            {News.PressAgency}
                                        </Text>
                                    </LinearGradient>
                                </View>
                            </View>

                            <View
                                style={{
                                    paddingTop: 4,
                                    paddingBottom: 12,
                                    borderBottomWidth: 1,
                                    borderBottomColor: "gainsboro",
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                                        <FontAwesome5 name="chart-bar" size={windowWidth / 20} color="gray" />
                                        <Text style={{ color: "gray", marginLeft: 4 }}>Đề xuất phương án xử lý</Text>
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
                                        onPress={() => this.setState({ SuggestAll: !this.state.SuggestAll })}
                                    >
                                        {!this.state.SuggestAll ? (
                                            <>
                                                <Text style={{ marginRight: 5, color: "white" }}>Xem tất cả</Text>
                                                <FontAwesome5 name="chevron-down" size={16} color="white" />
                                            </>
                                        ) : (
                                                <>
                                                    <Text style={{ marginRight: 5, color: "white" }}>Thu gọn</Text>
                                                    <FontAwesome5 name="chevron-up" size={16} color="white" />
                                                </>
                                            )}
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginTop: 10, height: !this.state.SuggestAll ? 100 : undefined }}>
                                    <LinearGradient
                                        colors={[
                                            "transparent",
                                            !this.state.SuggestAll ? "rgba(100, 100, 100, 0.1)" : undefined,
                                        ]}
                                        style={{
                                            height: !this.state.SuggestAll ? 100 : undefined,
                                            width: windowWidth - 20,
                                        }}
                                    >
                                        <Text style={{ height: !this.state.SuggestAll ? 100 : undefined }}>
                                            {News.Resolution}
                                        </Text>
                                    </LinearGradient>
                                </View>
                            </View>

                            <View
                                style={{
                                    paddingTop: 4,
                                    paddingBottom: 12,
                                    borderBottomWidth: 1,
                                    borderBottomColor: "gainsboro",
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                                        <FontAwesome5 name="chart-bar" size={windowWidth / 20} color="gray" />
                                        <Text style={{ color: "gray", marginLeft: 4 }}>Phê duyệt phương án xử lý</Text>
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
                                        onPress={() => this.setState({ ApproveAll: !this.state.ApproveAll })}
                                    >
                                        {!this.state.ApproveAll ? (
                                            <>
                                                <Text style={{ marginRight: 5, color: "white" }}>Xem tất cả</Text>
                                                <FontAwesome5 name="chevron-down" size={16} color="white" />
                                            </>
                                        ) : (
                                                <>
                                                    <Text style={{ marginRight: 5, color: "white" }}>Thu gọn</Text>
                                                    <FontAwesome5 name="chevron-up" size={16} color="white" />
                                                </>
                                            )}
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginTop: 10, height: !this.state.ApproveAll ? 100 : undefined }}>
                                    <LinearGradient
                                        colors={[
                                            "transparent",
                                            !this.state.ApproveAll ? "rgba(100, 100, 100, 0.1)" : undefined,
                                        ]}
                                        style={{
                                            height: !this.state.ApproveAll ? 100 : undefined,
                                            width: windowWidth - 20,
                                        }}
                                    >
                                        <Text style={{ height: !this.state.ApproveAll ? 100 : undefined }}>
                                            {News.ResolutionContent}
                                        </Text>
                                    </LinearGradient>
                                </View>
                            </View>

                            <View style={{ paddingTop: 4, paddingBottom: 12 }}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                                        <FontAwesome5 name="thumbtack" size={windowWidth / 20} color="gray" />
                                        <Text style={{ color: "gray", marginLeft: 4 }}>Kết quả</Text>
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
                                        onPress={() => this.setState({ ResultExpendAll: !this.state.ResultExpendAll })}
                                    >
                                        {!this.state.ResultExpendAll ? (
                                            <>
                                                <Text style={{ marginRight: 5, color: "white" }}>Xem tất cả</Text>
                                                <FontAwesome5 name="chevron-down" size={16} color="white" />
                                            </>
                                        ) : (
                                                <>
                                                    <Text style={{ marginRight: 5, color: "white" }}>Thu gọn</Text>
                                                    <FontAwesome5 name="chevron-up" size={16} color="white" />
                                                </>
                                            )}
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginTop: 10, height: !this.state.ResultExpendAll ? 100 : undefined }}>
                                    <LinearGradient
                                        colors={[
                                            "transparent",
                                            !this.state.ResultExpendAll ? "rgba(100, 100, 100, 0.1)" : undefined,
                                        ]}
                                        style={{
                                            height: !this.state.ResultExpendAll ? 100 : undefined,
                                            width: windowWidth - 20,
                                        }}
                                    >
                                        <Text style={{ height: !this.state.ResultExpendAll ? 100 : undefined }}>
                                            {News.Concluded}
                                        </Text>
                                    </LinearGradient>
                                </View>
                            </View>

                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
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
                                <Text style={{ fontWeight: "bold", color: "blue" }}>Quá trình tìm hiểu</Text>
                            </View>
                            <ScrollView style={{ marginBottom: 12 }} showsHorizontalScrollIndicator={false} horizontal={false}>
                                {this.RenderNewsResearched(this.state.ListNewsResearched)}
                            </ScrollView>

                            <View
                                style={{
                                    borderBottomWidth: this.state.LstNegativeNews.length > 0 ? undefined : 1,
                                    borderBottomColor: "gainsboro",
                                }}
                            >
                                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                                    <View style={{ height: 25, width: 7, backgroundColor: "#1D39C4" }}></View>
                                    <Text style={{ fontWeight: "bold", color: "#1D39C4", marginLeft: 10 }}>
                                        Chi tiết sự vụ
                                    </Text>
                                </View>
                                <View style={{ marginTop: 8, paddingTop: 8 }}>
                                    {this.state.LstNegativeNews.length > 0 ? (
                                        this.state.LstNegativeNews.map((x) => this.RenderItem(x))
                                    ) : (
                                            <View></View>
                                        )}
                                </View>
                            </View>

                            <View style={{ paddingTop: 4, paddingBottom: 12 }}>
                                <View
                                    style={{
                                        paddingBottom: 4,
                                        borderBottomWidth: 1,
                                        borderBottomColor: "gainsboro",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                                        <Fontisto name="comments" size={windowWidth / 20} color="gray" />
                                        <Text style={{ color: "gray", marginLeft: 4 }}>Bình luận</Text>
                                    </View>
                                </View>

                                <View style={{ marginTop: 10, marginBottom: 30 }}>
                                    <View
                                        style={{
                                            flex: 1,
                                            paddingTop: 15,
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "100%",
                                        }}
                                    >
                                        <View>
                                            <FlatList
                                                style={{ backgroundColor: "#FFF", width: "100%" }}
                                                data={this.state.LstComment}
                                                renderItem={({ item, index }) => this.RenderComment(item, index + 1)}
                                                keyExtractor={(item, index) => index.toString()}
                                            />
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                marginBottom: 20,
                                            }}
                                        >
                                            <TextInput
                                                style={{
                                                    backgroundColor: "#F2F3F5",
                                                    borderWidth: 1,
                                                    borderColor: "#CCD0D5",
                                                    borderRadius: 50,
                                                    padding: 10,
                                                    width: "80%",
                                                }}
                                                placeholder="Viết bình luận..."
                                                value={this.state.Content}
                                                onChangeText={(val) => this.setState({ Content: val })}
                                            />
                                            {this.state.Content.length > 0 ? (
                                                <TouchableOpacity
                                                    style={{ marginLeft: 10, width: "10%" }}
                                                    onPress={() => this.saveComment(true)}
                                                >
                                                    <Ionicons name="md-send" size={25} color="#3884FE" />
                                                </TouchableOpacity>
                                            ) : (
                                                    <TouchableOpacity style={{ marginLeft: 10, width: "10%" }}>
                                                        <MaterialIcons name="send" size={25} color="#707070" />
                                                    </TouchableOpacity>
                                                )}
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                {this.state.SelectedFullScreen != null ? (
                    <Dialog visible={true}>
                        <ImageViewer
                            imageUrls={[
                                {
                                    url: `${ApiUrl.Attachment_ImagePreview}?id=${this.state.SelectedFullScreen.AttachmentID}&ecm=${this.state.SelectedFullScreen.ECMItemID}&name=${this.state.SelectedFullScreen.FileName}&size=3&token=${GlobalCache.UserToken}`,
                                },
                            ]}
                            backgroundColor={"black"}
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
                        </View>
                    </Dialog>
                ) : (
                        <View></View>
                    )}
                {this.state.SelectedNegativeNews != null ? (
                    <Modal isVisible={this.state.Visible}>
                        <View
                            style={{
                                marginTop: windowHeight / 8,
                                left: -(windowWidth / 20),
                                width: windowWidth,
                                height: windowHeight,
                                backgroundColor: "white",
                                borderRadius: 16,
                            }}
                        >
                            <View
                                style={{
                                    borderRadius: 50,
                                    marginLeft: windowWidth / 2 - 26,
                                    width: 50,
                                    height: 6,
                                    backgroundColor: "white",
                                    marginBottom: 5,
                                    alignItems: "center",
                                    top: -15,
                                }}
                            />

                            <View
                                style={{
                                    height: 20,
                                    flexDirection: "row",
                                    marginRight: 12,
                                    marginLeft: 12,
                                    marginBottom: 8,
                                }}
                            >
                                <TouchableOpacity
                                    style={{
                                        justifyContent: "center",
                                    }}
                                    onPress={() => this.setState({ Visible: false })}
                                >
                                    <FontAwesome5 name="times" size={24} color="#000" />
                                </TouchableOpacity>
                                <View
                                    style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginLeft: 12,
                                    }}
                                >
                                    {this.state.SelectedNegativeNews.Type == Enum.NegativeNews.ChuaPhatSinh ? (
                                        <Text
                                            style={{
                                                paddingTop: 3,
                                                alignItems: "center",
                                                fontWeight: "bold",
                                                fontSize: 14,
                                            }}
                                        >
                                            Chi tiết sự vụ chưa lên báo
                                        </Text>
                                    ) : (
                                            <Text
                                                style={{
                                                    paddingTop: 3,
                                                    alignItems: "center",
                                                    fontWeight: "bold",
                                                    fontSize: 14,
                                                }}
                                            >
                                                Chi tiết sự vụ đã lên báo
                                            </Text>
                                        )}
                                </View>
                            </View>
                            {this.state.SelectedNegativeNews.Type == Enum.NegativeNews.ChuaPhatSinh ? (
                                <ScrollView
                                    style={{ borderTopWidth: 1, borderTopColor: "#E6E6E6", paddingHorizontal: 8 }}
                                >
                                    <View
                                        style={{
                                            paddingVertical: 12,
                                            borderBottomWidth: 1,
                                            borderBottomColor: "gainsboro",
                                        }}
                                    >
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={{ color: "gray", marginTop: 4 }}>Loại sự vụ: </Text>
                                            <Text
                                                style={{
                                                    marginTop: 4,
                                                    color: Utility.GetDictionaryValue(
                                                        SMX.NegativeNews.dicColor,
                                                        this.state.SelectedNegativeNews.Type
                                                    ),
                                                }}
                                            >
                                                {Utility.GetDictionaryValue(
                                                    SMX.NegativeNews.dicName,
                                                    this.state.SelectedNegativeNews.Type
                                                )}
                                            </Text>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            paddingVertical: 12,
                                            borderBottomWidth: 1,
                                            borderBottomColor: "gainsboro",
                                        }}
                                    >
                                        <Text style={{ color: "gray", marginTop: 4 }}>Tên vụ việc</Text>
                                        <Text style={{ marginTop: 4 }}>{this.state.SelectedNegativeNews.Name}</Text>
                                    </View>
                                    <View
                                        style={{
                                            paddingVertical: 12,
                                            borderBottomWidth: 1,
                                            borderBottomColor: "gainsboro",
                                        }}
                                    >
                                        <Text style={{ color: "gray", marginTop: 4 }}>Thời gian</Text>
                                        <Text style={{ marginTop: 4 }}>
                                            {Utility.GetDateMinuteString(this.state.SelectedNegativeNews.IncurredDTG)}
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            paddingVertical: 12,
                                            borderBottomWidth: 1,
                                            borderBottomColor: "gainsboro",
                                        }}
                                    >
                                        <Text style={{ color: "gray", marginTop: 4 }}>Địa điểm</Text>
                                        <Text style={{ marginTop: 4 }}>
                                            {this.state.SelectedNegativeNews.Place}
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            paddingVertical: 12,
                                            borderBottomWidth: 1,
                                            borderBottomColor: "gainsboro",
                                        }}
                                    >
                                        <Text style={{ color: "gray", marginTop: 4 }}>Tổ chức</Text>
                                        <Text style={{ marginTop: 4 }}>
                                            {this.state.SelectedNegativeNews.PressAgencyName}
                                        </Text>
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
                                            {this.RenderListNegativeImage(this.state.ResearchedAttachments)}
                                        </ScrollView>
                                    </View>
                                    <View style={{ paddingTop: 4, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "gainsboro" }}>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                                                <Text style={{ color: "gray" }}>Kết quả xử lý</Text>
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
                                                onPress={() => this.setState({ ResultHandleAll: !this.state.ResultHandleAll })}
                                            >
                                                {!this.state.ResultHandleAll ? (
                                                    <>
                                                        <Text style={{ marginRight: 5, color: "white" }}>Xem tất cả</Text>
                                                        <FontAwesome5 name="chevron-down" size={16} color="white" />
                                                    </>
                                                ) : (
                                                        <>
                                                            <Text style={{ marginRight: 5, color: "white" }}>Thu gọn</Text>
                                                            <FontAwesome5 name="chevron-up" size={16} color="white" />
                                                        </>
                                                    )}
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ marginTop: 10, height: !this.state.ResultHandleAll ? 100 : undefined }}>
                                            <LinearGradient
                                                colors={[
                                                    "transparent",
                                                    !this.state.ResultHandleAll ? "rgba(100, 100, 100, 0.1)" : undefined,
                                                ]}
                                                style={{
                                                    height: !this.state.ResultHandleAll ? 100 : undefined,
                                                    width: windowWidth - 14,
                                                }}
                                            >
                                                <Text style={{ height: !this.state.ResultHandleAll ? 100 : undefined }}>
                                                    {this.state.SelectedNegativeNews.Result}
                                                </Text>
                                            </LinearGradient>
                                        </View>
                                    </View>

                                    <View style={{ paddingTop: 4, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "gainsboro" }}>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                                                <Text style={{ color: "gray" }}>Thông tin phóng viên</Text>
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
                                                onPress={() => this.setState({ ReporterAll: !this.state.ReporterAll })}
                                            >
                                                {!this.state.ReporterAll ? (
                                                    <>
                                                        <Text style={{ marginRight: 5, color: "white" }}>Xem tất cả</Text>
                                                        <FontAwesome5 name="chevron-down" size={16} color="white" />
                                                    </>
                                                ) : (
                                                        <>
                                                            <Text style={{ marginRight: 5, color: "white" }}>Thu gọn</Text>
                                                            <FontAwesome5 name="chevron-up" size={16} color="white" />
                                                        </>
                                                    )}
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ marginTop: 10, height: !this.state.ReporterAll ? 100 : undefined }}>
                                            <LinearGradient
                                                colors={[
                                                    "transparent",
                                                    !this.state.ReporterAll ? "rgba(100, 100, 100, 0.1)" : undefined,
                                                ]}
                                                style={{
                                                    height: !this.state.ReporterAll ? 100 : undefined,
                                                    width: windowWidth - 14,
                                                }}
                                            >
                                                <Text style={{ height: !this.state.ReporterAll ? 100 : undefined }}>
                                                    {this.state.SelectedNegativeNews.ReporterInformation}
                                                </Text>
                                            </LinearGradient>
                                        </View>
                                    </View>

                                    <View style={{ paddingTop: 4, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "gainsboro" }}>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                                                <Text style={{ color: "gray" }}>Tóm tắt nội dung</Text>
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
                                                onPress={() => this.setState({ ContentAll: !this.state.ContentAll })}
                                            >
                                                {!this.state.ContentAll ? (
                                                    <>
                                                        <Text style={{ marginRight: 5, color: "white" }}>Xem tất cả</Text>
                                                        <FontAwesome5 name="chevron-down" size={16} color="white" />
                                                    </>
                                                ) : (
                                                        <>
                                                            <Text style={{ marginRight: 5, color: "white" }}>Thu gọn</Text>
                                                            <FontAwesome5 name="chevron-up" size={16} color="white" />
                                                        </>
                                                    )}
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ marginTop: 10, height: !this.state.ContentAll ? 100 : undefined }}>
                                            <LinearGradient
                                                colors={[
                                                    "transparent",
                                                    !this.state.ContentAll ? "rgba(100, 100, 100, 0.1)" : undefined,
                                                ]}
                                                style={{
                                                    height: !this.state.ContentAll ? 100 : undefined,
                                                    width: windowWidth - 14,
                                                }}
                                            >
                                                <Text style={{ height: !this.state.ContentAll ? 100 : undefined }}>
                                                    {this.state.SelectedNegativeNews.Content}
                                                </Text>
                                            </LinearGradient>
                                        </View>
                                    </View>

                                    <View style={{ paddingTop: 4, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "gainsboro" }}>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                                                <Text style={{ color: "gray" }}>Câu hỏi chi tiết</Text>
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
                                                onPress={() => this.setState({ QuestionDetailAll: !this.state.QuestionDetailAll })}
                                            >
                                                {!this.state.QuestionDetailAll ? (
                                                    <>
                                                        <Text style={{ marginRight: 5, color: "white" }}>Xem tất cả</Text>
                                                        <FontAwesome5 name="chevron-down" size={16} color="white" />
                                                    </>
                                                ) : (
                                                        <>
                                                            <Text style={{ marginRight: 5, color: "white" }}>Thu gọn</Text>
                                                            <FontAwesome5 name="chevron-up" size={16} color="white" />
                                                        </>
                                                    )}
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ marginTop: 10, height: !this.state.QuestionDetailAll ? 100 : undefined }}>
                                            <LinearGradient
                                                colors={[
                                                    "transparent",
                                                    !this.state.QuestionDetailAll ? "rgba(100, 100, 100, 0.1)" : undefined,
                                                ]}
                                                style={{
                                                    height: !this.state.QuestionDetailAll ? 100 : undefined,
                                                    width: windowWidth - 14,
                                                }}
                                            >
                                                <Text style={{ height: !this.state.QuestionDetailAll ? 100 : undefined }}>
                                                    {this.state.SelectedNegativeNews.QuestionDetail}
                                                </Text>
                                            </LinearGradient>
                                        </View>
                                    </View>

                                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
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
                                        <Text style={{ fontWeight: "bold", color: "blue" }}>Quá trình tìm hiểu</Text>
                                    </View>
                                    <ScrollView style={{ marginBottom: 12 }} showsHorizontalScrollIndicator={false} horizontal={false}>
                                        {this.RenderNegativeNewsResearched(this.state.ListNegativeNewResearched)}
                                    </ScrollView>

                                    <View style={{ paddingTop: 4, paddingBottom: 12, borderTopWidth: 1, borderTopColor: "gainsboro" }}>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                                                <Text style={{ color: "gray" }}>Hình thức phương án giải quyết</Text>
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
                                                onPress={() => this.setState({ ResolutionAll: !this.state.ResolutionAll })}
                                            >
                                                {!this.state.ResolutionAll ? (
                                                    <>
                                                        <Text style={{ marginRight: 5, color: "white" }}>Xem tất cả</Text>
                                                        <FontAwesome5 name="chevron-down" size={16} color="white" />
                                                    </>
                                                ) : (
                                                        <>
                                                            <Text style={{ marginRight: 5, color: "white" }}>Thu gọn</Text>
                                                            <FontAwesome5 name="chevron-up" size={16} color="white" />
                                                        </>
                                                    )}
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ marginTop: 10, height: !this.state.ResolutionAll ? 100 : undefined }}>
                                            <LinearGradient
                                                colors={[
                                                    "transparent",
                                                    !this.state.ResolutionAll ? "rgba(100, 100, 100, 0.1)" : undefined,
                                                ]}
                                                style={{
                                                    height: !this.state.ResolutionAll ? 100 : undefined,
                                                    width: windowWidth - 14,
                                                }}
                                            >
                                                <Text style={{ height: !this.state.ResolutionAll ? 100 : undefined }}>
                                                    {this.state.SelectedNegativeNews.Resolution}
                                                </Text>
                                            </LinearGradient>
                                        </View>
                                    </View>

                                    <View style={{ paddingTop: 4, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "gainsboro" }}>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                                                <Text style={{ color: "gray" }}>Nội dung phương án giải quyết</Text>
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
                                                onPress={() => this.setState({ ResolutionContentAll: !this.state.ResolutionContentAll })}
                                            >
                                                {!this.state.ResolutionContentAll ? (
                                                    <>
                                                        <Text style={{ marginRight: 5, color: "white" }}>Xem tất cả</Text>
                                                        <FontAwesome5 name="chevron-down" size={16} color="white" />
                                                    </>
                                                ) : (
                                                        <>
                                                            <Text style={{ marginRight: 5, color: "white" }}>Thu gọn</Text>
                                                            <FontAwesome5 name="chevron-up" size={16} color="white" />
                                                        </>
                                                    )}
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ marginTop: 10, height: !this.state.ResolutionContentAll ? 100 : undefined }}>
                                            <LinearGradient
                                                colors={[
                                                    "transparent",
                                                    !this.state.ResolutionContentAll ? "rgba(100, 100, 100, 0.1)" : undefined,
                                                ]}
                                                style={{
                                                    height: !this.state.ResolutionContentAll ? 100 : undefined,
                                                    width: windowWidth - 14,
                                                }}
                                            >
                                                <Text style={{ height: !this.state.ResolutionContentAll ? 100 : undefined }}>
                                                    {this.state.SelectedNegativeNews.ResolutionContent}
                                                </Text>
                                            </LinearGradient>
                                        </View>
                                    </View>

                                    <View style={{ height: 60 }} />
                                </ScrollView>
                            ) : (
                                    <ScrollView
                                        style={{ borderTopWidth: 1, borderTopColor: "#E6E6E6", paddingHorizontal: 8 }}
                                    >
                                        <View
                                            style={{
                                                paddingVertical: 12,
                                                borderBottomWidth: 1,
                                                borderBottomColor: "gainsboro",
                                            }}
                                        >
                                            <View style={{ flexDirection: "row" }}>
                                                <Text style={{ color: "gray", marginTop: 6 }}>Loại sự vụ: </Text>
                                                <Text
                                                    style={{
                                                        marginTop: 6,
                                                        color: Utility.GetDictionaryValue(
                                                            SMX.NegativeNews.dicColor,
                                                            this.state.SelectedNegativeNews.Type
                                                        ),
                                                    }}
                                                >
                                                    {Utility.GetDictionaryValue(
                                                        SMX.NegativeNews.dicName,
                                                        this.state.SelectedNegativeNews.Type
                                                    )}
                                                </Text>
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                paddingVertical: 12,
                                                borderBottomWidth: 1,
                                                borderBottomColor: "gainsboro",
                                            }}
                                        >
                                            <Text style={{ color: "gray", marginTop: 4 }}>Tên vụ việc</Text>
                                            <Text style={{ marginTop: 4 }}>{this.state.SelectedNegativeNews.Name}</Text>
                                        </View>
                                        <View
                                            style={{
                                                paddingVertical: 12,
                                                borderBottomWidth: 1,
                                                borderBottomColor: "gainsboro",
                                            }}
                                        >
                                            <Text style={{ color: "gray", marginTop: 4 }}>Thời gian</Text>
                                            <Text style={{ marginTop: 4 }}>
                                                {Utility.GetDateMinuteString(this.state.SelectedNegativeNews.IncurredDTG)}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                paddingVertical: 12,
                                                borderBottomWidth: 1,
                                                borderBottomColor: "gainsboro",
                                            }}
                                        >
                                            <Text style={{ color: "gray", marginTop: 4 }}>Kênh đăng bài</Text>
                                            <Text style={{ marginTop: 4 }}>
                                                {this.state.SelectedNegativeNews.PressAgencyName}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                paddingVertical: 12,
                                                borderBottomWidth: 1,
                                                borderBottomColor: "gainsboro",
                                            }}
                                        >
                                            <Text style={{ color: "gray", marginTop: 4 }}>Link bài</Text>
                                            {Urls ? (
                                                Urls.map((url) => (
                                                    <TouchableOpacity
                                                        style={{ marginBottom: 2 }}
                                                        onPress={() => Linking.openURL(url)}
                                                    >
                                                        <Text style={{ color: "#0000FF" }}>{url}</Text>
                                                    </TouchableOpacity>
                                                ))
                                            ) : (
                                                    <View></View>
                                                )}
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
                                                {this.RenderListNegativeImage(this.state.ResearchedAttachments)}
                                            </ScrollView>
                                        </View>
                                        <View
                                            style={{
                                                paddingVertical: 12,
                                                borderBottomWidth: 1,
                                                borderBottomColor: "gainsboro",
                                            }}
                                        >
                                            <Text style={{ color: "gray", marginTop: 4 }}>Tiêu đề</Text>
                                            <Text style={{ marginTop: 4 }}>{this.state.SelectedNegativeNews.Title}</Text>
                                        </View>
                                        <View style={{ paddingTop: 4, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "gainsboro" }}>
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                                                    <Text style={{ color: "gray" }}>Mức độ ảnh hưởng</Text>
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
                                                    onPress={() => this.setState({ ReJudgedAll: !this.state.ReJudgedAll })}
                                                >
                                                    {!this.state.ReJudgedAll ? (
                                                        <>
                                                            <Text style={{ marginRight: 5, color: "white" }}>Xem tất cả</Text>
                                                            <FontAwesome5 name="chevron-down" size={16} color="white" />
                                                        </>
                                                    ) : (
                                                            <>
                                                                <Text style={{ marginRight: 5, color: "white" }}>Thu gọn</Text>
                                                                <FontAwesome5 name="chevron-up" size={16} color="white" />
                                                            </>
                                                        )}
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ marginTop: 10, height: !this.state.ReJudgedAll ? 100 : undefined }}>
                                                <LinearGradient
                                                    colors={[
                                                        "transparent",
                                                        !this.state.ReJudgedAll ? "rgba(100, 100, 100, 0.1)" : undefined,
                                                    ]}
                                                    style={{
                                                        height: !this.state.ReJudgedAll ? 100 : undefined,
                                                        width: windowWidth - 14,
                                                    }}
                                                >
                                                    <Text style={{ height: !this.state.ReJudgedAll ? 100 : undefined }}>
                                                        {this.state.SelectedNegativeNews.Judged}
                                                    </Text>
                                                </LinearGradient>
                                            </View>
                                        </View>
                                        <View style={{ paddingTop: 4, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "gainsboro" }}>
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                                                    <Text style={{ color: "gray" }}>Cách xử lý</Text>
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
                                                    onPress={() => this.setState({ MethodHandleAll: !this.state.MethodHandleAll })}
                                                >
                                                    {!this.state.MethodHandleAll ? (
                                                        <>
                                                            <Text style={{ marginRight: 5, color: "white" }}>Xem tất cả</Text>
                                                            <FontAwesome5 name="chevron-down" size={16} color="white" />
                                                        </>
                                                    ) : (
                                                            <>
                                                                <Text style={{ marginRight: 5, color: "white" }}>Thu gọn</Text>
                                                                <FontAwesome5 name="chevron-up" size={16} color="white" />
                                                            </>
                                                        )}
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ marginTop: 10, height: !this.state.MethodHandleAll ? 100 : undefined }}>
                                                <LinearGradient
                                                    colors={[
                                                        "transparent",
                                                        !this.state.MethodHandleAll ? "rgba(100, 100, 100, 0.1)" : undefined,
                                                    ]}
                                                    style={{
                                                        height: !this.state.MethodHandleAll ? 100 : undefined,
                                                        width: windowWidth - 14,
                                                    }}
                                                >
                                                    <Text style={{ height: !this.state.MethodHandleAll ? 100 : undefined }}>
                                                        {this.state.SelectedNegativeNews.MethodHandle}
                                                    </Text>
                                                </LinearGradient>
                                            </View>
                                        </View>
                                        <View style={{ paddingTop: 4, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "gainsboro" }}>
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                                                    <Text style={{ color: "gray" }}>Kết quả</Text>
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
                                                    onPress={() => this.setState({ ResultAll: !this.state.ResultAll })}
                                                >
                                                    {!this.state.ResultAll ? (
                                                        <>
                                                            <Text style={{ marginRight: 5, color: "white" }}>Xem tất cả</Text>
                                                            <FontAwesome5 name="chevron-down" size={16} color="white" />
                                                        </>
                                                    ) : (
                                                            <>
                                                                <Text style={{ marginRight: 5, color: "white" }}>Thu gọn</Text>
                                                                <FontAwesome5 name="chevron-up" size={16} color="white" />
                                                            </>
                                                        )}
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ marginTop: 10, height: !this.state.ResultAll ? 100 : undefined }}>
                                                <LinearGradient
                                                    colors={[
                                                        "transparent",
                                                        !this.state.ResultAll ? "rgba(100, 100, 100, 0.1)" : undefined,
                                                    ]}
                                                    style={{
                                                        height: !this.state.ResultAll ? 100 : undefined,
                                                        width: windowWidth - 14,
                                                    }}
                                                >
                                                    <Text style={{ height: !this.state.ResultAll ? 100 : undefined }}>
                                                        {this.state.SelectedNegativeNews.Result}
                                                    </Text>
                                                </LinearGradient>
                                            </View>
                                        </View>
                                        <View style={{ paddingTop: 4, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "gainsboro" }}>
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                                                    <Text style={{ color: "gray" }}>Ghi chú</Text>
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
                                                    onPress={() => this.setState({ NoteAll: !this.state.NoteAll })}
                                                >
                                                    {!this.state.NoteAll ? (
                                                        <>
                                                            <Text style={{ marginRight: 5, color: "white" }}>Xem tất cả</Text>
                                                            <FontAwesome5 name="chevron-down" size={16} color="white" />
                                                        </>
                                                    ) : (
                                                            <>
                                                                <Text style={{ marginRight: 5, color: "white" }}>Thu gọn</Text>
                                                                <FontAwesome5 name="chevron-up" size={16} color="white" />
                                                            </>
                                                        )}
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ marginTop: 10, height: !this.state.NoteAll ? 100 : undefined }}>
                                                <LinearGradient
                                                    colors={[
                                                        "transparent",
                                                        !this.state.NoteAll ? "rgba(100, 100, 100, 0.1)" : undefined,
                                                    ]}
                                                    style={{
                                                        height: !this.state.NoteAll ? 100 : undefined,
                                                        width: windowWidth - 14,
                                                    }}
                                                >
                                                    <Text style={{ height: !this.state.NoteAll ? 100 : undefined }}>
                                                        {this.state.SelectedNegativeNews.Note}
                                                    </Text>
                                                </LinearGradient>
                                            </View>
                                        </View>

                                        <View style={{ height: 60 }} />
                                    </ScrollView>
                                )}
                        </View>
                    </Modal>
                ) : (
                        <View></View>
                    )}
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
        height: windowHeight / 6,
        width: windowWidth / 3,
    },
});
