import React from "react";
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
    TextInput,
} from "react-native";
import Theme from "../../Themes/Default";
import ApiUrl from "../../constants/ApiUrl";
import { WebView } from "react-native-webview";
import Toolbar from "../../components/Toolbar";
import HttpUtils from "../../Utils/HttpUtils";
import SMX from "../../constants/SMX";
import { inject, observer } from "mobx-react";
import GlobalStore from "../../Stores/GlobalStore";
import agency_PressAgency from "../../Entities/agency_PressAgency";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Utility from "../../Utils/Utility";
import { PressAgencyDto, PressAgencyFilter } from "../../DtoParams/PressAgencyDto";
import GlobalCache from "../../Caches/GlobalCache";
import AntDesign from "react-native-vector-icons/AntDesign";

const { width, height } = Dimensions.get("window");

interface iProps {
    navigation: any;
    GlobalStore: GlobalStore;
}

interface iState {
    Agencies: agency_PressAgency[];
    PageIndex: number;
    FilterName: string;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class CoQuanBaoTriScreen extends React.Component<iProps, iState> {
    private onEndReachedCalledDuringMomentumCQBT = false;

    constructor(props: iProps) {
        super(props);
        this.state = {
            Agencies: [],
            PageIndex: 0,
            FilterName: "",
        };
    }

    async componentDidMount() {
        await this.LoadData(false);
    }

    async LoadData(IsLoadMore: boolean) {
        try {
            this.props.GlobalStore.ShowLoading();

            let request = new PressAgencyDto();
            let filter = new PressAgencyFilter();
            filter.PageIndex = this.state.PageIndex;
            filter.AgencyName = this.state.FilterName;
            request.Filter = filter;

            let res = await HttpUtils.post<PressAgencyDto>(
                ApiUrl.PressAgency_ExecutePressAgency,
                SMX.ApiActionCode.SearchData,
                JSON.stringify(request)
            );

            if (!IsLoadMore) this.setState({ Agencies: res.Agencies! });
            else this.setState({ Agencies: this.state.Agencies.concat(res.Agencies!) });

            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
            this.props.GlobalStore.HideLoading();
        }
    }

    renderItem(item: agency_PressAgency) {
        return (
            <TouchableOpacity
                style={{
                    backgroundColor: "white",
                    flexDirection: "row",
                    marginHorizontal: 10,
                    padding: 10,
                    alignItems: "center",
                    borderBottomWidth: 1,
                    borderColor: "gainsboro",
                }}
                onPress={() =>
                    this.props.navigation.navigate("CoQuanBaoTriDetail", {
                        PressAgencyID: item.PressAgencyID,
                        Name: item.Name,
                    })
                }
            >
                {item.Attachment && item.Attachment!.AttachmentID && item.Attachment!.AttachmentID != null ? (
                    <Image
                        source={{
                            uri: `${ApiUrl.Attachment_ImagePreview}?id=${item.Attachment!.AttachmentID}&ecm=${
                                item.Attachment!.ECMItemID
                            }&name=${item.Attachment!.FileName}&size=1&token=${GlobalCache.UserToken}`,
                        }}
                        style={{ width: 80, height: 50, resizeMode: "contain", borderRadius: 5 }}
                    />
                ) : (
                    <Image
                        source={require("../../../assets/branch.png")}
                        style={{ width: 40, height: 40, resizeMode: "contain", marginHorizontal: 20 }}
                    />
                )}

                <View style={{ marginLeft: 15, marginRight: 5 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 16, width: width - (80 + 40 + 30) }}>{item.Name}</Text>
                    <Text style={{ width: width - (80 + 40 + 30), marginTop: 3 }}>{item.Address}</Text>
                </View>
                <AntDesign name="right" size={17} color="#B2B2B2" />
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Toolbar Title="Cơ quan báo chí" navigation={this.props.navigation} HasBottomTab={true}>
                    <View style={{ marginLeft: 10 }}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => this.setState({ PageIndex: 0 }, () => this.LoadData(false))}
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
                        placeholder="Tìm theo tên"
                        value={this.state.FilterName}
                        onChangeText={(val) => this.setState({ FilterName: val })}
                    />
                    {/* <TouchableOpacity
                        style={{ marginLeft: 10 }}
                        onPress={() => this.setState({ PageIndex: 0 }, () => this.LoadData(false))}
                    >
                        <FontAwesome5 name="search" size={25} color="#1D39C4" />
                    </TouchableOpacity> */}
                </View>
                <FlatList
                    style={{ backgroundColor: "#FFF", width: "100%", height: "85%" }}
                    data={this.state.Agencies.filter((x) =>
                        Utility.FormatVNLanguage(x.Name!.toLowerCase()).includes(
                            Utility.FormatVNLanguage(this.state.FilterName.toLowerCase())
                        )
                    )}
                    renderItem={({ item }) => this.renderItem(item)}
                    keyExtractor={(item, index) => index.toString()}
                    onMomentumScrollBegin={() => {
                        this.onEndReachedCalledDuringMomentumCQBT = false;
                    }}
                    onEndReached={() => {
                        if (!this.onEndReachedCalledDuringMomentumCQBT) {
                            if (this.state.Agencies.length >= 20) {
                                this.setState({ PageIndex: this.state.PageIndex + 1 }, async () => {
                                    await this.LoadData(true);
                                });
                                this.onEndReachedCalledDuringMomentumCQBT = true;
                            }
                        }
                    }}
                    onEndReachedThreshold={0.5}
                />
            </View>
        );
    }
}
