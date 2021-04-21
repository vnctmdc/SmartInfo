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
import { LinearGradient } from "expo-linear-gradient";
import DropDownBoxSmall from "../../components/DropDownBoxSmall";
import News from "../../Entities/News";
import NegativeNews from "../../Entities/NegativeNews";
import DateTimePicker from "../../components/DateTimePicker";
import NegativeNewsDto, { NegativeNewsFilter } from "../../DtoParams/NegativeNewsDto";

const { width, height } = Dimensions.get("window");

interface iProps {
    navigation: any;
    GlobalStore: GlobalStore;
}

interface iState {
    News: News;
    NegativeNews: NegativeNews;
    ListPressAgency: agency_PressAgency[];
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class AdvanceSearchScreen extends React.Component<iProps, iState> {

    constructor(props: iProps) {
        super(props);
        this.state = {
            News: new News(),
            NegativeNews: new NegativeNews(),
            ListPressAgency: [],
        };
    }

    async componentDidMount() {
        await this.SetupViewForm();
    }

    async SetupViewForm() {
        try {
            this.props.GlobalStore.ShowLoading();
            let request = new NegativeNewsDto();
            let res = await HttpUtils.post<NegativeNewsDto>(
                ApiUrl.NegativeNews_ExecuteNegativeNews,
                SMX.ApiActionCode.SetupViewForm,
                JSON.stringify(request),
                true
            );

            this.setState({
                ListPressAgency: res!.ListPressAgency!,
            });

            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
            this.props.GlobalStore.HideLoading();
        }
    }

    async btn_Search() {
        let { News, NegativeNews } = this.state;

        let trigger = new NegativeNewsFilter();
        trigger.News = News;
        trigger.NegativeNews = NegativeNews;

        this.props.GlobalStore.AdvanceSearchValue = trigger;

        this.props.GlobalStore.AdvanceSearchTrigger();
        this.props.navigation.goBack();

    }

    render() {
        let { News, NegativeNews } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: "#E8E8E8" }}>
                <Toolbar Title="TÌM KIẾM NÂNG CAO SỰ VỤ" navigation={this.props.navigation} />
                <KeyboardAvoidingView behavior="height" style={{ flex: 1, paddingHorizontal: 8 }}>
                    <ScrollView showsVerticalScrollIndicator={false}>

                        <View style={Theme.ViewGeneral}>
                            <View style={Theme.ViewTitle}>
                                <Text style={{ fontSize: 15, fontWeight: "600", color: '#FFFFFF' }}>
                                    SỰ VỤ
                                </Text>
                            </View>
                            <View style={Theme.ViewContent}>
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: 'row' }}>
                                        <Text>Ngày phát sinh từ </Text>
                                    </View>
                                    <View style={{ flex: 3 }}>
                                        <DateTimePicker
                                            SelectedDate={News.FromIncurredDTG}
                                            OnselectedDateChanged={(val) => {
                                                News.FromIncurredDTG = val;
                                                this.setState({ News });
                                            }}
                                        />
                                    </View>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                    }}
                                />
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: 'row' }}>
                                        <Text>Ngày phát sinh đến </Text>
                                    </View>
                                    <View style={{ flex: 3 }}>
                                        <DateTimePicker
                                            SelectedDate={News.ToIncurredDTG}
                                            OnselectedDateChanged={(val) => {
                                                News.ToIncurredDTG = val;
                                                this.setState({ News });
                                            }}
                                        />
                                    </View>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                    }}
                                />
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: 'row' }}>
                                        <Text>Mức độ sự vụ </Text>
                                    </View>
                                    <View style={{ flex: 3 }}>
                                        <DropDownBoxSmall
                                            TextField="Value"
                                            ValueField="Key"
                                            DataSource={SMX.Classification.dicName}
                                            SelectedValue={News.Classification}
                                            OnSelectedItemChanged={(item) => {
                                                News.Classification = item.Key;
                                                this.setState({ News });
                                            }}
                                        />
                                    </View>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                    }}
                                />
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: 'row' }}>
                                        <Text>Tình trạng </Text>
                                    </View>
                                    <View style={{ flex: 3 }}>
                                        <DropDownBoxSmall
                                            TextField="Value"
                                            ValueField="Key"
                                            DataSource={SMX.NewStatus.dicName}
                                            SelectedValue={News.Status}
                                            OnSelectedItemChanged={(item) => {
                                                News.Status = item.Key;
                                                this.setState({ News });
                                            }}
                                        />
                                    </View>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                    }}
                                />
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: 'row' }}>
                                        <Text>Từ khóa </Text>
                                    </View>
                                    <View style={{ flex: 3 }}>
                                        <TextInput
                                            multiline={true}
                                            numberOfLines={4}
                                            style={[Theme.TextInput, { height: 75 }]}
                                            textAlignVertical="top"
                                            value={News.SearchText}
                                            onChangeText={(val) => {
                                                News.SearchText = val;
                                                this.setState({ News });
                                            }}
                                        />

                                    </View>
                                </View>

                            </View>
                        </View>

                        <View style={Theme.ViewGeneral}>
                            <View style={Theme.ViewTitle}>
                                <Text style={{ fontSize: 15, fontWeight: "600", color: '#FFFFFF' }}>
                                    CHI TIẾT SỰ VỤ
                                </Text>
                            </View>
                            <View style={Theme.ViewContent}>
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: 'row' }}>
                                        <Text>Thời gian từ </Text>
                                    </View>
                                    <View style={{ flex: 3 }}>
                                        <DateTimePicker
                                            SelectedDate={NegativeNews.FromIncurredDTG}
                                            OnselectedDateChanged={(val) => {
                                                NegativeNews.FromIncurredDTG = val;
                                                this.setState({ NegativeNews });
                                            }}
                                        />
                                    </View>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                    }}
                                />
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: 'row' }}>
                                        <Text>Thời gian đến </Text>
                                    </View>
                                    <View style={{ flex: 3 }}>
                                        <DateTimePicker
                                            SelectedDate={NegativeNews.ToIncurredDTG}
                                            OnselectedDateChanged={(val) => {
                                                NegativeNews.ToIncurredDTG = val;
                                                this.setState({ NegativeNews });
                                            }}
                                        />
                                    </View>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                    }}
                                />
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: 'row' }}>
                                        <Text>Loại sự vụ </Text>
                                    </View>
                                    <View style={{ flex: 3 }}>
                                        <DropDownBoxSmall
                                            TextField="Value"
                                            ValueField="Key"
                                            DataSource={SMX.NegativeNews.dicName}
                                            SelectedValue={NegativeNews.Type}
                                            OnSelectedItemChanged={(item) => {
                                                NegativeNews.Type = item.Key;
                                                this.setState({ NegativeNews });
                                            }}
                                        />
                                    </View>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                    }}
                                />
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: 'row' }}>
                                        <Text>Trạng thái xử lý </Text>
                                    </View>
                                    <View style={{ flex: 3 }}>
                                        <DropDownBoxSmall
                                            TextField="Value"
                                            ValueField="Key"
                                            DataSource={SMX.NewStatus.dicName}
                                            SelectedValue={NegativeNews.Status}
                                            OnSelectedItemChanged={(item) => {
                                                NegativeNews.Status = item.Key;
                                                this.setState({ NegativeNews });
                                            }}
                                        />
                                    </View>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                    }}
                                />
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: 'row' }}>
                                        <Text>Tổ chức đăng bài </Text>
                                    </View>
                                    <View style={{ flex: 3 }}>
                                        <DropDownBoxSmall
                                            TextField="Name"
                                            ValueField="PressAgencyID"
                                            DataSource={this.state.ListPressAgency}
                                            SelectedValue={NegativeNews.PressAgencyID}
                                            OnSelectedItemChanged={(item) => {
                                                NegativeNews.PressAgencyID = item.PressAgencyID;
                                                this.setState({ NegativeNews });
                                            }}
                                        />
                                    </View>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                    }}
                                />

                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: 'row' }}>
                                        <Text>Từ khóa </Text>
                                    </View>
                                    <View style={{ flex: 3 }}>
                                        <TextInput
                                            multiline={true}
                                            numberOfLines={4}
                                            style={[Theme.TextInput, { height: 75 }]}
                                            textAlignVertical="top"
                                            value={NegativeNews.SearchText}
                                            onChangeText={(val) => {
                                                NegativeNews.SearchText = val;
                                                this.setState({ NegativeNews });
                                            }}
                                        />

                                    </View>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                    }}
                                />

                            </View>
                        </View>

                        <View style={{ marginVertical: 15, justifyContent: 'center', flexDirection: 'row' }}>
                            <TouchableOpacity
                                style={{ marginLeft: 10, justifyContent: 'flex-end', alignItems: 'flex-end' }}
                                onPress={() => {
                                    this.btn_Search();
                                }}
                            >
                                <LinearGradient
                                    colors={SMX.BtnColor}
                                    style={{
                                        width: width / 4 + 8,
                                        height: 40,
                                        backgroundColor: "#007AFF",
                                        borderRadius: 5,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexDirection: 'row',

                                    }}
                                >
                                    <Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>Tìm kiếm</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ marginLeft: 10, justifyContent: 'flex-end', alignItems: 'flex-end' }}
                                onPress={() => {
                                    this.props.navigation.goBack();
                                }}
                            >
                                <LinearGradient
                                    colors={SMX.BtnColor}
                                    style={{
                                        width: width / 4 + 8,
                                        height: 40,
                                        backgroundColor: "#007AFF",
                                        borderRadius: 5,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexDirection: 'row',

                                    }}
                                >
                                    <Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>Bỏ qua</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>


            </View>
        );
    }
}

const styles = StyleSheet.create({
    Item: {
        flexDirection: "row",
        paddingVertical: 4,
        alignItems: "center",
        justifyContent: "space-between",
    },
    Item123: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomColor: "gainsboro",
        borderBottomWidth: 1,
    },
    ItemNote: {
        flexDirection: "row",
        paddingVertical: 8,
    },
});

