import React from 'react';
import { View, Text, Dimensions, ScrollView, TouchableOpacity, KeyboardAvoidingView, Alert, TextInput, FlatList } from 'react-native';
import * as Enums from '../../constants/Enums';
import ApiUrl from '../../constants/ApiUrl';
import SMX from '../../constants/SMX';
import Theme from '../../Themes/Default';
import GlobalStore from '../../Stores/GlobalStore';
import { inject, observer } from 'mobx-react';
import HttpUtils from '../../Utils/HttpUtils';
import Toolbar from '../../components/Toolbar';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Fontisto from "react-native-vector-icons/Fontisto";
import NegativeNewsDto from '../../DtoParams/NegativeNewsDto';
import NegativeNews from '../../Entities/NegativeNews';
import Comment from "../../Entities/Comment";
import ntf_Notification from '../../Entities/ntf_Notification';
import Utility from '../../Utils/Utility';
import { LinearGradient } from 'expo-linear-gradient';
import { CommentDto, CommentFilter } from '../../DtoParams/CommentDto';
import GlobalCache from '../../Caches/GlobalCache';

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

interface iProps {
    navigation: any;
    GlobalStore: GlobalStore;
    route: any;
}

interface iState {
    Notification: ntf_Notification;
    JudgeExpendAll: boolean;
    ResultExpendAll: boolean;

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
export default class Display extends React.Component<iProps, iState>{
    constructor(props: iProps) {
        super(props);
        this.state = {
            Notification: this.props.route.params.Notification,
            JudgeExpendAll: false,
            ResultExpendAll: false,

            CommentPageIndex: 0,
            LstComment: [],
            Content: "",
            Comment: null,
        }
    }

    async componentDidMount() {
        await this.LoadData();
        await this.LoadComment(false);
    }

    async LoadData() {
        // try {
        //     this.props.GlobalStore.ShowLoading();

        //     let res = await HttpUtils.post<NegativeNewsDto>(
        //         ApiUrl.NegativeNews_ExecuteNegativeNews,
        //         SMX.ApiActionCode.SetupDisplay,
        //         JSON.stringify(new NegativeNewsDto()),
        //         true
        //     );
        //     this.setState({ NegativeNews: res.NegativeNews });
        //     this.props.GlobalStore.HideLoading();
        // } catch (ex) {
        //     this.props.GlobalStore.Exception = ex;
        //     this.props.GlobalStore.HideLoading();
        // }
    }

    async LoadComment(IsLoadMore: boolean) {
        let request = new CommentDto();
        let filter = new CommentFilter();
        filter.RefID = this.state.Notification.NotificationID;
        filter.RefType = Enums.CommentRefType.Notification;
        filter.PageIndex = this.state.CommentPageIndex;
        request.Filter = filter;
        let res = await HttpUtils.post<CommentDto>(
            ApiUrl.Comment_ExecuteComment,
            SMX.ApiActionCode.SearchData,
            JSON.stringify(request)
        );

        if (!IsLoadMore) this.setState({ LstComment: res!.LstComment });
        else this.setState({ LstComment: this.state.LstComment.concat(res!.LstComment!) });
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

    async saveComment(insert: boolean) {
        try {
            this.props.GlobalStore.ShowLoading();
            let request = new CommentDto();
            let filter = new CommentFilter();
            let comment = new Comment();
            comment.RefTitle = this.state.Notification.Content;
            comment.RefID = this.state.Notification.NotificationID;
            comment.RefType = Enums.CommentRefType.Notification;
            if (insert) {
                comment.Content = this.state.Content;
            } else {
                comment.CommentID = this.state.CommentID;
                comment.Content = this.state.EditContent;
            }
            comment.Rate = Enums.Rate.BinhThuong;
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
        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Toolbar Title="Chi tiết thông báo" navigation={this.props.navigation}>
                    <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                            style={{ marginRight: 5, flexDirection: "row" }}
                            activeOpacity={0.7}
                            onPress={() => this.LoadData()}
                        >
                            <FontAwesome5 name="bell" size={22} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </Toolbar>
                <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
                    <ScrollView>
                        <View style={{ padding: 12 }}>
                            <View style={{ paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: 'gainsboro' }}>
                                <Text style={{ fontWeight: "bold", fontSize: 17, marginBottom: 4 }}>{this.state.Notification.Content}</Text>
                            </View>

                            <View style={{ paddingTop: 4, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: 'gainsboro' }}>
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                        <FontAwesome5 name="chart-bar" size={windowWidth / 20} color="gray" />
                                        <Text style={{ color: 'gray', marginLeft: 4 }}>Ghi chú</Text>
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
                                        <Text style={{ height: !this.state.JudgeExpendAll ? 100 : undefined }}>{this.state.Notification.Note}</Text>
                                    </LinearGradient>
                                </View>


                            </View>

                            <View style={{ paddingTop: 4, paddingBottom: 12 }}>
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                        <FontAwesome5 name="thumbtack" size={windowWidth / 20} color="gray" />
                                        <Text style={{ color: 'gray', marginLeft: 4 }}>Ý kiến chỉ đạo</Text>
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
                                        <Text style={{ height: !this.state.ResultExpendAll ? 100 : undefined }}>{this.state.Notification.Comment}</Text>
                                    </LinearGradient>
                                </View>
                            </View>
                            <View style={{ paddingTop: 4, paddingBottom: 12 }}>
                                <View
                                    style={{
                                        paddingBottom: 4,
                                        paddingTop: 8,
                                        borderTopWidth: 1,
                                        borderBottomWidth: 1,
                                        borderTopColor: "gainsboro",
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
            </View>
        );
    }

}
