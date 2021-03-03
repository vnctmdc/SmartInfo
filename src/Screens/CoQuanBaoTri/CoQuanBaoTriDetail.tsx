import React from "react";
import {
    View,
    Alert,
    Text,
    KeyboardAvoidingView,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
    StyleSheet,
    TextInput,
    FlatList,
} from "react-native";
import { inject, observer } from "mobx-react";
import SMX from "../../constants/SMX";
import Toolbar from "../../components/Toolbar";
import agency_PressAgency from "../../Entities/agency_PressAgency";
import agency_PressAgencyHR from "../../Entities/agency_PressAgencyHR";
import agency_PressAgencyHRHistory from "../../Entities/agency_PressAgencyHRHistory";
import GlobalStore from "../../Stores/GlobalStore";
import { PressAgencyDto, PressAgencyFilter } from "../../DtoParams/PressAgencyDto";
import HttpUtils from "../../Utils/HttpUtils";
import ApiUrl from "../../constants/ApiUrl";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Fontisto from "react-native-vector-icons/Fontisto";
import Utility from "../../Utils/Utility";
import GlobalCache from "../../Caches/GlobalCache";
import agency_PressAgencyMeeting from "../../Entities/agency_PressAgencyMeeting";
import agency_PressAgencyHistory from "../../Entities/agency_PressAgencyHistory";
import agency_RelationsPressAgency from "../../Entities/agency_RelationsPressAgency";
import Comment from "../../Entities/Comment";
import Theme from "../../Themes/Default";
import ImageView from "../../components/ImageView";
import * as Enums from "../../constants/Enums";
import { CommentDto, CommentFilter } from "../../DtoParams/CommentDto";
import CommentUC from "../Uc/CommentUC";
import News from "../../Entities/News";
import adm_Attachment from "../../Entities/adm_Attachment";
import Gallery from "../../components/Gallery";
import agency_RelationshipWithMB from "../../Entities/agency_RelationshipWithMB";

const { width, height } = Dimensions.get("window");

interface iProps {
    navigation: any;
    GlobalStore: GlobalStore;
    route: any;
}

interface iState {
    Agency: agency_PressAgency;
    LstAgencyHR: agency_PressAgencyHR[];
    LstAgencyMeeting: agency_PressAgencyMeeting[];
    LstAgencyHistory: agency_PressAgencyHistory[];
    LstRelationalAgency: agency_RelationsPressAgency[];
    LstOrtherImage: adm_Attachment[];
    LstRelationshipWithMB: agency_RelationshipWithMB[];

    Visible: boolean; // show ảnh

    IndexSelected: Enums.RenderPressAgencyDetailType;

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
export default class CoQuanBaoTriDetailScreen extends React.Component<iProps, iState> {
    constructor(props: iProps) {
        super(props);
        this.state = {
            Agency: new agency_PressAgency(),
            LstAgencyHR: [],
            LstAgencyMeeting: [],
            LstAgencyHistory: [],
            LstRelationalAgency: [],
            LstRelationshipWithMB: [],

            Visible: false,
            IndexSelected: Enums.RenderPressAgencyDetailType.CoCauToChuc,

            CommentPageIndex: 0,
            LstComment: [],
            Content: "",
            Comment: null,
            LstOrtherImage: [],
        };
    }

    async componentDidMount() {
        this.props.GlobalStore.UpdateImageTrigger = () => {
            this.LoadData();
        };
        await this.LoadData();
    }

    async LoadData() {
        try {
            this.props.GlobalStore.ShowLoading();

            let request = new PressAgencyDto();
            let filter = new PressAgencyFilter();
            filter.PressAgencyID = this.props.route.params.PressAgencyID;
            request.Filter = filter;

            let res = await HttpUtils.post<PressAgencyDto>(
                ApiUrl.PressAgency_ExecutePressAgency,
                SMX.ApiActionCode.SetupDisplay,
                JSON.stringify(request)
            );

            this.setState({
                Agency: res.Agency!,
                LstAgencyHR: res.LstPressAgencyHR!,
                LstAgencyMeeting: res.LstPressAgencyMeeting!,
                LstAgencyHistory: res.LstAgencyHistory!,
                LstRelationalAgency: res.LstRelationalAgency!,
                LstOrtherImage: res.LstOrtherImage!,
                LstRelationshipWithMB: res.LstRelationshipWithMB,
            });

            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
            this.props.GlobalStore.HideLoading();
        }
    }

    renderAgencyHR(LstAgencyHR: agency_PressAgencyHR[]) {
        return LstAgencyHR.map((en) => (
            <TouchableOpacity
                style={{
                    marginTop: 10,
                    flexDirection: "row",
                    marginHorizontal: 15,
                    backgroundColor: "#F5F6F8",
                    borderRadius: 10,
                    padding: 10,
                }}
                onPress={() =>
                    this.props.navigation.navigate("ThongTinNhanSu", {
                        AgencyID: this.props.route.params.PressAgencyID,
                        AgencyHRID: en.PressAgencyHRID,
                        Name: en.FullName,
                    })
                }
            >
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    {en.Attachment && en.Attachment.AttachmentID != null ? (
                        <Image
                            source={{
                                uri: `${ApiUrl.Attachment_ImagePreview}?id=${en.Attachment!.AttachmentID}&ecm=${
                                    en.Attachment!.ECMItemID
                                }&name=${en.Attachment!.FileName}&size=1&token=${GlobalCache.UserToken}`,
                            }}
                            style={{ width: 50, height: 50, resizeMode: "contain", borderRadius: 5 }}
                        />
                    ) : (
                        <FontAwesome5 name="user" size={50} color="#2EA8EE" />
                    )}

                    {/* <View
                        style={{
                            backgroundColor: Utility.GetDictionaryValue(SMX.Attitudes.dicColor, en.Attitude),
                            padding: 3,
                            borderRadius: 5,
                            marginTop: 3,
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                color: "white",
                            }}
                        >
                            {Utility.GetDictionaryValue(SMX.Attitudes.dicName, en.Attitude)}
                        </Text>
                    </View> */}
                </View>
                <View style={{ marginLeft: 10, justifyContent: "center" }}>
                    <Text style={{ fontWeight: "bold" }}>{en.FullName}</Text>
                    <Text style={{ marginTop: 3 }}>{en.Position}</Text>
                    <Text
                        style={{
                            color: Utility.GetDictionaryValue(SMX.Attitudes.dicColor, en.Attitude),
                            fontWeight: "bold",
                        }}
                    >
                        {Utility.GetDictionaryValue(SMX.Attitudes.dicName, en.Attitude)}
                    </Text>
                </View>
            </TouchableOpacity>
        ));
    }

    renderAgencyMeeting(LstAgencyMeeting: agency_PressAgencyMeeting[]) {
        return LstAgencyMeeting.map((en) => (
            <View style={{ paddingTop: 10, paddingHorizontal: 10 }}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingHorizontal: 10,
                    }}
                >
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontWeight: "bold" }}>Đối tác: </Text>
                        <Text>{en.Partner}</Text>
                    </View>
                    <Text>{Utility.GetDateString(en.MeetDTG)}</Text>
                </View>
                <View
                    style={{
                        backgroundColor: "#F5F6F8",
                        padding: 10,
                        marginTop: 10,
                        borderRadius: 10,
                    }}
                >
                    <View style={{ borderBottomWidth: 1, borderColor: "gainsboro", paddingBottom: 10 }}>
                        <Text style={{ color: "#9C9C9D" }}>Địa điểm: </Text>
                        <Text style={{ fontWeight: "bold" }}>{en.Location}</Text>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={{ color: "#9C9C9D" }}>Nội dung: </Text>
                        <Text style={{ fontWeight: "bold" }}>{en.Content}</Text>
                    </View>
                </View>
            </View>
        ));
    }

    renderAgencyHistory(LstAgencyHistory: agency_PressAgencyHistory[]) {
        return LstAgencyHistory.map((en) => (
            <View style={{ flexDirection: "row" }}>
                <View style={{ width: 30, alignItems: "center" }}>
                    <View style={{ width: 20, height: 20, borderRadius: 100, backgroundColor: "#C4C4C4" }}></View>
                    <View style={{ flex: 1, width: 1, backgroundColor: "#C4C4C4" }}></View>
                </View>
                <View style={{ marginLeft: 5, paddingRight: 5 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: width - 40,
                        }}
                    >
                        <View style={{ flexDirection: "row" }}>
                            <Text>Vị trí: </Text>
                            <Text style={{ fontWeight: "bold" }}>{en.PositionChange}</Text>
                        </View>
                        <Text>{Utility.GetDateString(en.ChangeDTG)}</Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            backgroundColor: "#8C8C8C",
                            padding: 10,
                            marginVertical: 5,
                            borderRadius: 100,
                        }}
                    >
                        <Text style={{ color: "white" }}>Nhân sự cũ: </Text>
                        <Text style={{ color: "white" }}>{en.OldEmployee}</Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            backgroundColor: "#52C41A",
                            padding: 10,
                            marginVertical: 5,
                            borderRadius: 100,
                        }}
                    >
                        <Text style={{ color: "white" }}>Nhân sự mới: </Text>
                        <Text style={{ color: "white" }}>{en.NewEmployee}</Text>
                    </View>
                </View>
            </View>
        ));
    }

    renderAgencyRelational(LstRelationalAgency: agency_RelationsPressAgency[]) {
        return LstRelationalAgency.map((en) => (
            <View style={{ paddingTop: 10, paddingHorizontal: 10 }}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingHorizontal: 10,
                    }}
                >
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontWeight: "bold" }}>Cơ quan: </Text>
                        <Text>{en.Name}</Text>
                    </View>
                    <View></View>
                </View>
                <View
                    style={{
                        backgroundColor: "#F5F6F8",
                        padding: 10,
                        marginTop: 10,
                        borderRadius: 10,
                    }}
                >
                    <View style={{ borderBottomWidth: 1, borderColor: "gainsboro", paddingBottom: 10 }}>
                        <Text style={{ color: "#9C9C9D" }}>Quan hệ: </Text>
                        <Text style={{ fontWeight: "bold" }}>{en.Relationship}</Text>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={{ color: "#9C9C9D" }}>Ghi chú: </Text>
                        <Text style={{ fontWeight: "bold" }}>{en.Note}</Text>
                    </View>
                </View>
            </View>
        ));
    }

    renderOrtherImage(lstOrtherImage: adm_Attachment[]) {
        return (
            <View>
                <Gallery Images={lstOrtherImage} numberColumn={2} />
                <TouchableOpacity
                    style={{
                        marginLeft: 10,
                        alignSelf: "flex-start",
                        width: width / 2 - 15,
                        height: 50,
                        backgroundColor: "gainsboro",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 5,
                        marginVertical: 10,
                    }}
                    onPress={() =>
                        this.props.navigation.navigate("UploadOrtherImage", {
                            PressAgencyID: this.state.Agency.PressAgencyID,
                        })
                    }
                >
                    <Image
                        source={require("../../../assets/photo.png")}
                        style={{
                            width: "50%",
                            height: 30,
                            resizeMode: "contain",
                        }}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    renderRelationshipWithMB(lstRelationshipWithMB: agency_RelationshipWithMB[]) {
        return lstRelationshipWithMB.map((en, index) => (
            <View
                style={{
                    backgroundColor: "#F5F6F8",
                    marginVertical: 5,
                    marginHorizontal: 10,
                    padding: 10,
                    borderRadius: 10,
                }}
            >
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontWeight: "bold" }}>Mức độ quan hệ</Text>
                    <Text
                        style={{ color: Utility.GetDictionaryValue(SMX.RelationshipWithMB.dicColor, en.Relationship) }}
                    >
                        {Utility.GetDictionaryValue(SMX.RelationshipWithMB.dicName, en.Relationship)}
                    </Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 3 }}>
                    <Text style={{ fontWeight: "bold" }}>TG từ</Text>
                    <Text>{Utility.GetDateString(en.FromDTG)}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 3 }}>
                    <Text style={{ fontWeight: "bold" }}>TG đến</Text>
                    <Text>{Utility.GetDateString(en.ToDTG)}</Text>
                </View>
            </View>
        ));
    }

    renderContentByIndex(
        LstAgencyHR: agency_PressAgencyHR[],
        LstAgencyMeeting: agency_PressAgencyMeeting[],
        LstAgencyHistory: agency_PressAgencyHistory[],
        LstRelationalAgency: agency_RelationsPressAgency[],
        LstOrtherImage: adm_Attachment[],
        LstRelationshipWithMB: agency_RelationshipWithMB[]
    ) {
        if (this.state.IndexSelected === Enums.RenderPressAgencyDetailType.CoCauToChuc) {
            return this.renderAgencyHR(LstAgencyHR);
        } else if (this.state.IndexSelected === Enums.RenderPressAgencyDetailType.LichSuGapMat) {
            return this.renderAgencyMeeting(LstAgencyMeeting);
        } else if (this.state.IndexSelected === Enums.RenderPressAgencyDetailType.LichSuThayDoiNhanSu) {
            return this.renderAgencyHistory(LstAgencyHistory);
        } else if (this.state.IndexSelected === Enums.RenderPressAgencyDetailType.QuanHeGiuaCacCoQuanBT) {
            return this.renderAgencyRelational(LstRelationalAgency);
        } else if (this.state.IndexSelected === Enums.RenderPressAgencyDetailType.AnhKhac) {
            return this.renderOrtherImage(LstOrtherImage);
        } else if (this.state.IndexSelected === Enums.RenderPressAgencyDetailType.LichSuQuanHe) {
            return this.renderRelationshipWithMB(LstRelationshipWithMB);
        }
    }

    render() {
        let {
            Agency,
            LstAgencyHR,
            LstAgencyMeeting,
            LstAgencyHistory,
            LstRelationalAgency,
            LstOrtherImage,
            LstRelationshipWithMB,
        } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Toolbar Title="Cơ quan báo chí" navigation={this.props.navigation} />
                <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
                    <ScrollView>
                        <View style={{ backgroundColor: "#F5F6F8" }}>
                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5, padding: 15 }}>
                                {Agency.Attachment &&
                                Agency!.Attachment!.AttachmentID &&
                                Agency!.Attachment!.AttachmentID != null ? (
                                    <TouchableOpacity onPress={() => this.setState({ Visible: true })}>
                                        <Image
                                            source={{
                                                uri: `${ApiUrl.Attachment_ImagePreview}?id=${
                                                    Agency!.Attachment!.AttachmentID
                                                }&ecm=${Agency!.Attachment!.ECMItemID}&name=${
                                                    Agency!.Attachment!.FileName
                                                }&size=1&token=${GlobalCache.UserToken}`,
                                            }}
                                            style={{ width: 80, height: 50, resizeMode: "contain", borderRadius: 5 }}
                                        />
                                    </TouchableOpacity>
                                ) : (
                                    <FontAwesome5 name="newspaper" size={50} color="#2EA8EE" />
                                )}

                                <View style={{ marginLeft: 10 }}>
                                    <Text style={{ fontWeight: "bold", fontSize: 16, width: width - 80 - 30 }}>
                                        {Agency.Name}
                                    </Text>
                                    <Text style={{ width: width - 80 - 30 }}>{Agency.Address}</Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    backgroundColor: "white",
                                    borderTopRightRadius: 20,
                                    borderTopLeftRadius: 20,
                                    padding: 15,
                                    borderTopWidth: 1,
                                    borderLeftWidth: 1,
                                    borderRightWidth: 1,
                                    borderColor: "gainsboro",
                                }}
                            >
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <View style={{ height: 20, width: 5, backgroundColor: "#1D39C4" }}></View>
                                    <Text style={{ fontWeight: "bold", color: "#1D39C4", marginLeft: 10 }}>
                                        Thông tin tòa soạn
                                    </Text>
                                </View>
                                <View style={styles.TTToaSoanItem}>
                                    <Text style={{ fontWeight: "bold", flex: 1.5 }}>Ngày thành lập: </Text>
                                    <Text style={{ flex: 2.5 }}>{Utility.GetDateString(Agency.EstablishedDTG)}</Text>
                                </View>
                                <View style={styles.TTToaSoanItem}>
                                    <Text style={{ fontWeight: "bold", flex: 1.5 }}>Điện thoại: </Text>
                                    <Text style={{ flex: 2.5 }}>{Agency.Phone}</Text>
                                </View>
                                <View style={styles.TTToaSoanItem}>
                                    <Text style={{ fontWeight: "bold", flex: 1.5 }}>Fax: </Text>
                                    <Text style={{ flex: 2.5 }}>{Agency.Fax}</Text>
                                </View>
                                <View style={styles.TTToaSoanItem}>
                                    <Text style={{ fontWeight: "bold", flex: 1.5 }}>Email: </Text>
                                    <Text style={{ flex: 2.5 }}>{Agency.Email}</Text>
                                </View>
                                <View style={styles.TTToaSoanItem}>
                                    <Text style={{ fontWeight: "bold", flex: 1.5 }}>Cơ quan chủ quản: </Text>
                                    <Text style={{ flex: 2.5 }}>{Agency.Agency}</Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        marginTop: 10,
                                        alignItems: "center",
                                    }}
                                >
                                    <Text style={{ fontWeight: "bold", flex: 1.5 }}>Địa chỉ: </Text>
                                    <Text style={{ flex: 2.5 }}>{Agency.Address}</Text>
                                </View>
                            </View>

                            <ScrollView
                                showsHorizontalScrollIndicator={false}
                                horizontal={true}
                                style={{ backgroundColor: "white", padding: 15 }}
                            >
                                <TouchableOpacity
                                    style={[
                                        styles.ButtonHorizontalItem,
                                        {
                                            borderColor:
                                                this.state.IndexSelected ===
                                                Enums.RenderPressAgencyDetailType.CoCauToChuc
                                                    ? "#1D39C4"
                                                    : undefined,
                                            borderWidth:
                                                this.state.IndexSelected ===
                                                Enums.RenderPressAgencyDetailType.CoCauToChuc
                                                    ? 1
                                                    : undefined,
                                        },
                                    ]}
                                    onPress={() =>
                                        this.setState({ IndexSelected: Enums.RenderPressAgencyDetailType.CoCauToChuc })
                                    }
                                >
                                    <Text
                                        style={{
                                            color:
                                                this.state.IndexSelected ===
                                                Enums.RenderPressAgencyDetailType.CoCauToChuc
                                                    ? "#1D39C4"
                                                    : undefined,
                                        }}
                                    >
                                        Danh sách liên hệ
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.ButtonHorizontalItem,
                                        {
                                            borderColor:
                                                this.state.IndexSelected ===
                                                Enums.RenderPressAgencyDetailType.LichSuThayDoiNhanSu
                                                    ? "#1D39C4"
                                                    : undefined,
                                            borderWidth:
                                                this.state.IndexSelected ===
                                                Enums.RenderPressAgencyDetailType.LichSuThayDoiNhanSu
                                                    ? 1
                                                    : undefined,
                                        },
                                    ]}
                                    onPress={() =>
                                        this.setState({
                                            IndexSelected: Enums.RenderPressAgencyDetailType.LichSuThayDoiNhanSu,
                                        })
                                    }
                                >
                                    <Text
                                        style={{
                                            color:
                                                this.state.IndexSelected ===
                                                Enums.RenderPressAgencyDetailType.LichSuThayDoiNhanSu
                                                    ? "#1D39C4"
                                                    : undefined,
                                        }}
                                    >
                                        Lịch sử thay đổi nhân sự
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.ButtonHorizontalItem,
                                        {
                                            borderColor:
                                                this.state.IndexSelected ===
                                                Enums.RenderPressAgencyDetailType.LichSuGapMat
                                                    ? "#1D39C4"
                                                    : undefined,
                                            borderWidth:
                                                this.state.IndexSelected ===
                                                Enums.RenderPressAgencyDetailType.LichSuGapMat
                                                    ? 1
                                                    : undefined,
                                        },
                                    ]}
                                    onPress={() =>
                                        this.setState({ IndexSelected: Enums.RenderPressAgencyDetailType.LichSuGapMat })
                                    }
                                >
                                    <Text
                                        style={{
                                            color:
                                                this.state.IndexSelected ===
                                                Enums.RenderPressAgencyDetailType.LichSuGapMat
                                                    ? "#1D39C4"
                                                    : undefined,
                                        }}
                                    >
                                        Lịch sử hợp tác gặp gỡ
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.ButtonHorizontalItem,
                                        {
                                            borderColor:
                                                this.state.IndexSelected ===
                                                Enums.RenderPressAgencyDetailType.QuanHeGiuaCacCoQuanBT
                                                    ? "#1D39C4"
                                                    : undefined,
                                            borderWidth:
                                                this.state.IndexSelected ===
                                                Enums.RenderPressAgencyDetailType.QuanHeGiuaCacCoQuanBT
                                                    ? 1
                                                    : undefined,
                                        },
                                    ]}
                                    onPress={() =>
                                        this.setState({
                                            IndexSelected: Enums.RenderPressAgencyDetailType.QuanHeGiuaCacCoQuanBT,
                                        })
                                    }
                                >
                                    <Text
                                        style={{
                                            color:
                                                this.state.IndexSelected ===
                                                Enums.RenderPressAgencyDetailType.QuanHeGiuaCacCoQuanBT
                                                    ? "#1D39C4"
                                                    : undefined,
                                        }}
                                    >
                                        Quan hệ giữa các cơ quan báo chí
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.ButtonHorizontalItem,
                                        {
                                            borderColor:
                                                this.state.IndexSelected ===
                                                Enums.RenderPressAgencyDetailType.LichSuQuanHe
                                                    ? "#1D39C4"
                                                    : undefined,
                                            borderWidth:
                                                this.state.IndexSelected ===
                                                Enums.RenderPressAgencyDetailType.LichSuQuanHe
                                                    ? 1
                                                    : undefined,
                                        },
                                    ]}
                                    onPress={() =>
                                        this.setState({
                                            IndexSelected: Enums.RenderPressAgencyDetailType.LichSuQuanHe,
                                        })
                                    }
                                >
                                    <Text
                                        style={{
                                            color:
                                                this.state.IndexSelected ===
                                                Enums.RenderPressAgencyDetailType.LichSuQuanHe
                                                    ? "#1D39C4"
                                                    : undefined,
                                        }}
                                    >
                                        Lịch sử quan hệ
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.ButtonHorizontalItem,
                                        {
                                            borderColor:
                                                this.state.IndexSelected === Enums.RenderPressAgencyDetailType.AnhKhac
                                                    ? "#1D39C4"
                                                    : undefined,
                                            borderWidth:
                                                this.state.IndexSelected === Enums.RenderPressAgencyDetailType.AnhKhac
                                                    ? 1
                                                    : undefined,
                                        },
                                    ]}
                                    onPress={() =>
                                        this.setState({
                                            IndexSelected: Enums.RenderPressAgencyDetailType.AnhKhac,
                                        })
                                    }
                                >
                                    <Text
                                        style={{
                                            color:
                                                this.state.IndexSelected === Enums.RenderPressAgencyDetailType.AnhKhac
                                                    ? "#1D39C4"
                                                    : undefined,
                                        }}
                                    >
                                        Ảnh khác
                                    </Text>
                                </TouchableOpacity>
                            </ScrollView>

                            <View style={{ paddingBottom: 15, backgroundColor: "white" }}>
                                {this.renderContentByIndex(
                                    LstAgencyHR,
                                    LstAgencyMeeting,
                                    LstAgencyHistory,
                                    LstRelationalAgency,
                                    LstOrtherImage,
                                    LstRelationshipWithMB
                                )}
                            </View>
                        </View>

                        <CommentUC
                            RefID={this.props.route.params.PressAgencyID}
                            RefType={Enums.CommentRefType.PressAgency}
                            RefTitle={this.props.route.params.Name}
                            GlobalStore={this.props.GlobalStore}
                        />
                    </ScrollView>
                </KeyboardAvoidingView>

                {/* {Agency.Attachment && Agency.Attachment != null ? (
                    <ImageView
                        ECMItemID={Agency!.Attachment!.ECMItemID}
                        AttachmentID={Agency!.Attachment!.AttachmentID}
                        FileName={Agency!.Attachment!.FileName}
                        Visible={this.state.Visible}
                    />
                ) : undefined} */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    TTToaSoanItem: {
        paddingBottom: 10,
        flexDirection: "row",
        marginTop: 10,
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: "gainsboro",
    },
    ButtonHorizontalItem: {
        padding: 10,
        borderRadius: 100,
        marginRight: 15,
    },
});
