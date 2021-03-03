import React from "react";
import { View, Text, TextInput, TouchableOpacity, Dimensions, FlatList, Alert } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Fontisto from "react-native-vector-icons/Fontisto";
import GlobalStore from "../../Stores/GlobalStore";
import { CommentDto, CommentFilter } from "../../DtoParams/CommentDto";
import HttpUtils from "../../Utils/HttpUtils";
import ApiUrl from "../../constants/ApiUrl";
import SMX from "../../constants/SMX";
import Comment from "../../Entities/Comment";
import * as Enums from "../../constants/Enums";
import Utility from "../../Utils/Utility";
import GlobalCache from "../../Caches/GlobalCache";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

interface iProps {
    GlobalStore: GlobalStore;
    RefID: number;
    RefType: number;
    RefTitle: string;
}
interface iState {
    CommentPageIndex: number;
    LstComment: Comment[];
    Comment: Comment;
    Content: string;
    EditContent?: string;
    EditRow?: number;
    CommentID?: number;
}
export default class CommentUC extends React.Component<iProps, iState> {
    constructor(props: iProps) {
        super(props);
        this.state = {
            LstComment: [],
            CommentPageIndex: 0,
            Comment: null,
            Content: "",
        };
    }

    async componentDidMount() {
        await this.LoadComment(false);
    }

    // UNSAFE_componentWillReceiveProps(nextProps: iProps) {
    //     if (nextProps.LstComment !== this.state.LstComment) {
    //         this.setState({ LstComment: nextProps.LstComment });
    //     }
    // }

    async LoadComment(IsLoadMore: boolean) {
        let request = new CommentDto();
        let filter = new CommentFilter();
        filter.RefID = this.props.RefID;
        filter.RefType = this.props.RefType;
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

    async saveComment(insert: boolean) {
        try {
            this.props.GlobalStore.ShowLoading();
            let request = new CommentDto();
            let filter = new CommentFilter();
            let comment = new Comment();
            comment.RefTitle = this.props.RefTitle;
            comment.RefID = this.props.RefID;
            comment.RefType = this.props.RefType;
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
                let lstCmt = this.state.LstComment;
                lstCmt.push(res!.Comment!);
                this.setState({ Content: "", LstComment: lstCmt });
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
                            alignItems: "center",
                            justifyContent: "center",
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
                                    <View
                                        style={{
                                            marginRight: 8,
                                            marginTop: 8,
                                            flexDirection: "row",
                                            justifyContent: "flex-end",
                                        }}
                                    >
                                        <TouchableOpacity
                                            style={{ marginRight: 15 }}
                                            onPress={() => this.setState({ EditRow: undefined })}
                                        >
                                            <Text style={{ fontWeight: "bold", color: "#848484" }}>Cancel</Text>
                                        </TouchableOpacity>
                                        {this.state.EditContent.length > 0 ? (
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
                                        )}
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
            <View style={{ paddingTop: 4, paddingBottom: 12, paddingHorizontal: 10 }}>
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
        );
    }
}
