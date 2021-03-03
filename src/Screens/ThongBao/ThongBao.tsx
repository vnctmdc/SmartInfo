import React from "react";
import { Text, View, TouchableOpacity, FlatList, Dimensions, Image } from "react-native";
import ApiUrl from "../../constants/ApiUrl";
import Toolbar from "../../components/Toolbar";
import HttpUtils from "../../Utils/HttpUtils";
import SMX from "../../constants/SMX";
import GlobalStore from "../../Stores/GlobalStore";
import { NotifyDto, NotifyFilter } from "../../DtoParams/NotifyDto";
import { inject, observer } from "mobx-react";
import ntf_Notification from "../../Entities/ntf_Notification";
import Utility from "../../Utils/Utility";
import AntDesign from "react-native-vector-icons/AntDesign";

const { width, height } = Dimensions.get("window");

interface iProps {
    navigation: any;
    GlobalStore: GlobalStore;
}

interface iState {
    LstNotification: ntf_Notification[];
    PageIndex: number;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class ThongBaoScreen extends React.Component<iProps, iState> {
    private onEndReachedCalledDuringMomentumNotify: boolean = false;
    constructor(props: iProps) {
        super(props);
        this.state = {
            LstNotification: [],
            PageIndex: 0,
        };
    }

    async componentDidMount() {
        await this.LoadData(false);
    }

    async LoadData(IsLoadMore: boolean) {
        try {
            this.props.GlobalStore.ShowLoading();
            let request = new NotifyDto();
            let filter = new NotifyFilter();
            request.Filter = filter;

            let res = await HttpUtils.post<NotifyDto>(
                ApiUrl.Notification_ExecuteNotification,
                SMX.ApiActionCode.SearchData,
                JSON.stringify(request)
            );

            if (!IsLoadMore) this.setState({ LstNotification: res.LstNotification! });
            else {
                if (res.LstNotification!.length > 0)
                    this.setState({ LstNotification: this.state.LstNotification.concat(res.LstNotification!) });
            }

            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
            this.props.GlobalStore.HideLoading();
        }
    }

    renderItem(item: ntf_Notification) {
        return (
            <TouchableOpacity
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 10,
                    marginTop: 10,
                    borderBottomWidth: 1,
                    borderColor: "gainsboro",
                    paddingBottom: 10,
                }}
                onPress={() =>
                    this.props.navigation.navigate("DetailNotification", {
                        Notification: item,
                    })
                }
            >
                {/* <View
                    style={{
                        height: 50,
                        justifyContent: "center",
                        backgroundColor: "#20a4f3",
                        paddingHorizontal: 10,
                        borderRadius: 10,
                        marginRight: 10,
                    }}
                >
                    <Text style={{ color: "#ffe347", fontWeight: "bold" }}>{Utility.GetDateString(item.DoDTG)}</Text>
                </View> */}
                <Image
                    source={require("../../../assets/notification.png")}
                    style={{ width: 40, height: 40, resizeMode: "contain" }}
                />
                <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontWeight: "bold" }}>
                        {Utility.GetDictionaryValue(SMX.NotificationType.dicName, item.Type)}
                    </Text>
                    <Text style={{ width: width / 2 }}>{item.Content}</Text>
                    <Text>Ngày: {Utility.GetDateString(item.DoDTG)}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Toolbar Title="Thông báo" navigation={this.props.navigation} HasBottomTab={true}>
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

                <FlatList
                    style={{ backgroundColor: "#FFF", width: "100%" }}
                    data={this.state.LstNotification}
                    renderItem={({ item }) => this.renderItem(item)}
                    keyExtractor={(item, index) => index.toString()}
                    removeClippedSubviews={true}
                    onMomentumScrollBegin={() => {
                        this.onEndReachedCalledDuringMomentumNotify = false;
                    }}
                    onEndReached={() => {
                        if (!this.onEndReachedCalledDuringMomentumNotify) {
                            if (this.state.LstNotification.length >= 20) {
                                this.setState({ PageIndex: this.state.PageIndex + 1 }, async () => {
                                    await this.LoadData(true);
                                });
                                this.onEndReachedCalledDuringMomentumNotify = true;
                            }
                        }
                    }}
                    onEndReachedThreshold={0.5}
                />
            </View>
        );
    }
}
