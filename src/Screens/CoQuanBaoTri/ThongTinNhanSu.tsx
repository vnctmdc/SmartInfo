import React from "react";
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    KeyboardAvoidingView,
} from "react-native";
import { inject, observer } from "mobx-react";
import SMX from "../../constants/SMX";
import Toolbar from "../../components/Toolbar";
import GlobalStore from "../../Stores/GlobalStore";
import agency_PressAgencyHR from "../../Entities/agency_PressAgencyHR";
import agency_PressAgencyHRRelatives from "../../Entities/agency_PressAgencyHRRelatives";
import agency_PressAgencyHRHistory from "../../Entities/agency_PressAgencyHRHistory";
import { PressAgencyDto, PressAgencyFilter } from "../../DtoParams/PressAgencyDto";
import HttpUtils from "../../Utils/HttpUtils";
import ApiUrl from "../../constants/ApiUrl";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Utility from "../../Utils/Utility";
import GlobalCache from "../../Caches/GlobalCache";
import agency_PressAgencyHistory from "../../Entities/agency_PressAgencyHistory";
import agency_PressAgencyHRAlert from "../../Entities/agency_PressAgencyHRAlert";
import Theme from "../../Themes/Default";
import ImageView from "../../components/ImageView";
import * as Enums from "../../constants/Enums";
import CommentUC from "../Uc/CommentUC";

const { width, height } = Dimensions.get("window");

interface iProps {
    navigation: any;
    route: any;
    GlobalStore: GlobalStore;
}

interface iState {
    AgencyHR: agency_PressAgencyHR;
    LstPressAgencyHRRelatives: agency_PressAgencyHRRelatives[];
    LstPressAgencyHRHistory: agency_PressAgencyHRHistory[];
    LstAgencyHRAlert: agency_PressAgencyHRAlert[];

    Visible: boolean; // show ảnh
    IndexSelected: Enums.RenderAgencyHRContentType;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class ThongTinNhanSuScreen extends React.Component<iProps, iState> {
    constructor(props: iProps) {
        super(props);
        this.state = {
            AgencyHR: new agency_PressAgencyHR(),
            LstPressAgencyHRHistory: [],
            LstPressAgencyHRRelatives: [],
            LstAgencyHRAlert: [],
            Visible: false,
            IndexSelected: Enums.RenderAgencyHRContentType.NhanThan,
        };
    }

    async componentDidMount() {
        await this.LoadData();
    }

    async LoadData() {
        try {
            this.props.GlobalStore.ShowLoading();

            let request = new PressAgencyDto();
            let filter = new PressAgencyFilter();
            filter.PressAgencyID = this.props.route.params.AgencyID;
            filter.PressAgencyHRID = this.props.route.params.AgencyHRID;
            request.Filter = filter;

            let res = await HttpUtils.post<PressAgencyDto>(
                ApiUrl.PressAgency_ExecutePressAgency,
                SMX.ApiActionCode.HRDetail,
                JSON.stringify(request)
            );

            this.setState({
                AgencyHR: res.AgencyHR!,
                LstPressAgencyHRHistory: res.LstPressAgencyHRHistory!,
                LstPressAgencyHRRelatives: res.LstPressAgencyHRRelatives!,
                LstAgencyHRAlert: res.LstAgencyHRAlert!,
            });

            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
            this.props.GlobalStore.HideLoading();
        }
    }

    renderHRHistory(LstPressAgencyHRHistory: agency_PressAgencyHRHistory[]) {
        return LstPressAgencyHRHistory.map((en) => (
            <View style={{ marginTop: 10, borderBottomWidth: 1, borderColor: "gainsboro", paddingBottom: 10 }}>
                <View>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ color: "#9C9C9D" }}>Ngày: </Text>
                        <Text style={{ color: "#9C9C9D" }}>{Utility.GetDateString(en.MeetedDTG)}</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 3 }}>
                        <Text style={{ fontWeight: "bold" }}>Nội dung: </Text>
                        <Text style={{ fontWeight: "bold" }}>{en.Content}</Text>
                    </View>
                </View>
            </View>
        ));
    }

    renderHRRelative(LstPressAgencyHRRelatives: agency_PressAgencyHRRelatives[]) {
        return LstPressAgencyHRRelatives.map((en) => (
            <View
                style={{
                    marginTop: 10,
                    flexDirection: "row",
                    marginHorizontal: 15,
                    backgroundColor: "#F5F6F8",
                    borderRadius: 10,
                    padding: 10,
                }}
            >
                <View style={{ justifyContent: "center" }}>
                    <View
                        style={{
                            width: width - 50,
                            borderBottomColor: "gainsboro",
                            borderBottomWidth: 1,
                            paddingBottom: 5,
                        }}
                    >
                        <Text style={{ fontWeight: "bold" }}>{en.FullName}</Text>
                    </View>
                    <View style={{ marginTop: 5, flexDirection: "row" }}>
                        <Text style={{ color: "#9C9C9D" }}>Ngày sinh: </Text>
                        <Text style={{ fontWeight: "bold" }}>{Utility.GetDateString(en.DOB)}</Text>
                    </View>
                    {en.Hobby ? (
                        <View style={{ marginTop: 5, flexDirection: "row" }}>
                            <Text style={{ color: "#9C9C9D" }}>Sở thích: </Text>
                            <Text style={{ fontWeight: "bold" }}>{en.Hobby}</Text>
                        </View>
                    ) : undefined}
                </View>
            </View>
        ));
    }

    renderHRAlert(LstAgencyHRAlert: agency_PressAgencyHRAlert[]) {
        return LstAgencyHRAlert.map((en) => (
            <View
                style={{
                    marginTop: 10,
                    marginHorizontal: 15,
                    backgroundColor: "#F5F6F8",
                    padding: 10,
                    borderRadius: 10,
                }}
            >
                <View
                    style={{ flexDirection: "row", borderBottomWidth: 1, borderColor: "gainsboro", paddingBottom: 10 }}
                >
                    <Text style={{ color: "#9C9C9D" }}>Ngày nhắc: </Text>
                    <Text style={{ fontWeight: "bold" }}>{Utility.GetDateString(en.AlertDTG)}</Text>
                </View>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                    <Text style={{ color: "#9C9C9D" }}>Nội dung: </Text>
                    <Text style={{ fontWeight: "bold" }}>{en.Content}</Text>
                </View>
            </View>
        ));
    }

    renderContentByIndex(
        LstPressAgencyHRRelatives: agency_PressAgencyHRRelatives[],
        LstAgencyHRAlert: agency_PressAgencyHRAlert[]
    ) {
        if (this.state.IndexSelected === Enums.RenderAgencyHRContentType.NhanThan) {
            return this.renderHRRelative(LstPressAgencyHRRelatives);
        } else if (this.state.IndexSelected === Enums.RenderAgencyHRContentType.LichNhacNho) {
            return this.renderHRAlert(LstAgencyHRAlert);
        }
    }

    render() {
        let { AgencyHR, LstPressAgencyHRHistory, LstPressAgencyHRRelatives, LstAgencyHRAlert } = this.state;

        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Toolbar Title="Thông tin nhân sự" navigation={this.props.navigation} />
                <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
                    <ScrollView>
                        <View style={{ backgroundColor: "#F5F6F8" }}>
                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5, padding: 15 }}>
                                {AgencyHR!.Attachment &&
                                AgencyHR!.Attachment!.AttachmentID &&
                                AgencyHR!.Attachment!.AttachmentID != null ? (
                                    <TouchableOpacity
                                        onPress={() => this.setState({ Visible: true })}
                                        style={{ borderRadius: 100 }}
                                    >
                                        <Image
                                            source={{
                                                uri: `${ApiUrl.Attachment_ImagePreview}?id=${
                                                    AgencyHR!.Attachment!.AttachmentID
                                                }&ecm=${AgencyHR!.Attachment!.ECMItemID}&name=${
                                                    AgencyHR!.Attachment!.FileName
                                                }&size=1&token=${GlobalCache.UserToken}`,
                                            }}
                                            style={{ width: 80, height: 80, resizeMode: "contain", borderRadius: 5 }}
                                        />
                                    </TouchableOpacity>
                                ) : (
                                    <FontAwesome5 name="newspaper" size={80} color="#2EA8EE" />
                                )}

                                <View style={{ marginLeft: 10 }}>
                                    <Text style={{ fontWeight: "bold", fontSize: 16, width: width - 80 - 30 }}>
                                        {AgencyHR.FullName}
                                    </Text>
                                    <Text style={{ width: width - 80 - 30 }}>{AgencyHR.Position}</Text>

                                    <Text
                                        style={{
                                            fontWeight: "bold",
                                            color: Utility.GetDictionaryValue(
                                                SMX.Attitudes.dicColor,
                                                AgencyHR.Attitude
                                            ),
                                        }}
                                    >
                                        {Utility.GetDictionaryValue(SMX.Attitudes.dicName, AgencyHR.Attitude)}
                                    </Text>
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
                                        Thông tin cá nhân
                                    </Text>
                                </View>
                                <View style={styles.TTToaSoanItem}>
                                    <Text style={{ fontWeight: "bold", flex: 1.5 }}>Tuổi: </Text>
                                    <Text style={{ flex: 2.5 }}>{Utility.GetAge(AgencyHR.DOB)}</Text>
                                </View>
                                <View style={styles.TTToaSoanItem}>
                                    <Text style={{ fontWeight: "bold", flex: 1.5 }}>Ngày sinh: </Text>
                                    <Text style={{ flex: 2.5 }}>{Utility.GetDateString(AgencyHR.DOB)}</Text>
                                </View>
                                <View style={styles.TTToaSoanItem}>
                                    <Text style={{ fontWeight: "bold", flex: 1.5 }}>Điện thoại: </Text>
                                    <Text style={{ flex: 2.5 }}>{AgencyHR.Mobile}</Text>
                                </View>
                                <View style={styles.TTToaSoanItem}>
                                    <Text style={{ fontWeight: "bold", flex: 1.5 }}>Email: </Text>
                                    <Text style={{ flex: 2.5 }}>{AgencyHR.Email}</Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        marginTop: 10,
                                        alignItems: "center",
                                    }}
                                >
                                    <Text style={{ fontWeight: "bold", flex: 1.5 }}>Sở thích: </Text>
                                    <Text style={{ flex: 2.5 }}>{AgencyHR.Hobby}</Text>
                                </View>

                                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}>
                                    <View style={{ height: 20, width: 5, backgroundColor: "#1D39C4" }}></View>
                                    <Text style={{ fontWeight: "bold", color: "#1D39C4", marginLeft: 10 }}>
                                        Lịch sử gặp mặt
                                    </Text>
                                </View>
                                {this.renderHRHistory(LstPressAgencyHRHistory)}
                            </View>
                        </View>

                        <View style={{ flex: 1, flexDirection: "row", paddingHorizontal: 15 }}>
                            <TouchableOpacity
                                style={[
                                    styles.ButtonHorizontalItem,
                                    {
                                        flex: 1,
                                        alignItems: "center",
                                        borderColor:
                                            this.state.IndexSelected === Enums.RenderAgencyHRContentType.NhanThan
                                                ? "#1D39C4"
                                                : undefined,
                                        borderWidth:
                                            this.state.IndexSelected === Enums.RenderAgencyHRContentType.NhanThan
                                                ? 1
                                                : undefined,
                                    },
                                ]}
                                onPress={() =>
                                    this.setState({ IndexSelected: Enums.RenderAgencyHRContentType.NhanThan })
                                }
                            >
                                <Text>Nhân thân</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.ButtonHorizontalItem,
                                    {
                                        flex: 1,
                                        alignItems: "center",
                                        borderColor:
                                            this.state.IndexSelected === Enums.RenderAgencyHRContentType.LichNhacNho
                                                ? "#1D39C4"
                                                : undefined,
                                        borderWidth:
                                            this.state.IndexSelected === Enums.RenderAgencyHRContentType.LichNhacNho
                                                ? 1
                                                : undefined,
                                    },
                                ]}
                                onPress={() =>
                                    this.setState({ IndexSelected: Enums.RenderAgencyHRContentType.LichNhacNho })
                                }
                            >
                                <Text>Lịch nhắc nhở</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ paddingBottom: 15 }}>
                            {this.renderContentByIndex(LstPressAgencyHRRelatives, LstAgencyHRAlert)}
                        </View>
                        <CommentUC
                            RefID={this.props.route.params.AgencyHRID}
                            RefType={Enums.CommentRefType.PressAgencyHR}
                            RefTitle={this.props.route.params.Name}
                            GlobalStore={this.props.GlobalStore}
                        />
                    </ScrollView>
                </KeyboardAvoidingView>
                {/* {AgencyHR.Attachment && AgencyHR.Attachment != null ? (
                    <ImageView
                        ECMItemID={AgencyHR!.Attachment!.ECMItemID}
                        AttachmentID={AgencyHR!.Attachment!.AttachmentID}
                        FileName={AgencyHR!.Attachment!.FileName}
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
