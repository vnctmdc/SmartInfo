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
import * as Enums from "../../constants/Enums";
import { inject, observer } from "mobx-react";
import GlobalStore from "../../Stores/GlobalStore";
import agency_PressAgency from "../../Entities/agency_PressAgency";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Utility from "../../Utils/Utility";
import {
  PressAgencyDto,
  PressAgencyFilter,
} from "../../DtoParams/PressAgencyDto";
import GlobalCache from "../../Caches/GlobalCache";
import AntDesign from "react-native-vector-icons/AntDesign";
import News from "../../Entities/News";
import PopupModalUpdateNote from "../../components/PopupModalUpdateNote";
import { LinearGradient } from "expo-linear-gradient";
import agency_PressAgencyHR from "../../Entities/agency_PressAgencyHR";
import ContactsDto from "../../DtoParams/ContactsDto";
import * as Linking from "expo-linking";

const { width, height } = Dimensions.get("window");

interface iProps {
  navigation: any;
  route?: any;
  GlobalStore: GlobalStore;
}

interface iState {
  ListPressAgencyHR: agency_PressAgencyHR[];
  PressAgencyHR: agency_PressAgencyHR;
  PageIndex: number;
  FilterName: string;
  showSearch: boolean;
  TabActive: number;
  All: number;
  PressAgency: number;
  Other: number;
  PressAgencyType: number;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class DanhBaScreen extends React.Component<iProps, iState> {
  private onEndReachedDanhBa = false;

  constructor(props: iProps) {
    super(props);
    this.state = {
      ListPressAgencyHR: [],
      PressAgencyHR: new agency_PressAgencyHR(),
      PageIndex: 0,
      FilterName: "",
      showSearch: false,
      TabActive: 1,
      All: 0,
      PressAgency: 0,
      Other: 0,
      PressAgencyType: null,
    };
  }

  async componentDidMount() {
    await this.SetupFormDefault();
    await this.LoadData(false);
  }

  async SetupFormDefault() {
    try {
      this.props.GlobalStore.ShowLoading();

      let request = new ContactsDto();

      let res = await HttpUtils.post<ContactsDto>(
        ApiUrl.Contact_Execute,
        SMX.ApiActionCode.SetupFormDefault,
        JSON.stringify(request),
        true
      );

      let lstGrouped = res!.ListPressAgencyHR;

      let all = lstGrouped.length;
      let pressAgency = lstGrouped.filter(
        (item) => item.PressAgencyType == Enums.PressAgencyType.PressAgency
      ).length;
      let other = lstGrouped.filter(
        (item) => item.PressAgencyType != Enums.PressAgencyType.PressAgency
      ).length;
      this.setState({
        All: all,
        PressAgency: pressAgency,
        Other: other,
      });

      this.props.GlobalStore.HideLoading();
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

  async LoadData(IsLoadMore: boolean) {
    try {
      this.props.GlobalStore.ShowLoading();

      let request = new ContactsDto();
      let filter = this.state.PressAgencyHR;
      filter.PressAgencyType = this.state.PressAgencyType;
      request.PressAgencyHR = filter;

      let res = await HttpUtils.post<ContactsDto>(
        ApiUrl.Contact_Execute,
        SMX.ApiActionCode.SearchData,
        JSON.stringify(request),
        true
      );

      if (!IsLoadMore) {
        this.setState({
          ListPressAgencyHR: res.ListPressAgencyHR!,
        });
      } else {
        this.setState({
          ListPressAgencyHR: this.state.ListPressAgencyHR.concat(
            res.ListPressAgencyHR!
          ),
        });
      }

      this.setState({ PressAgencyHR: new agency_PressAgencyHR() });

      this.props.GlobalStore.HideLoading();
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

  renderItem(item: agency_PressAgencyHR) {
    return (
      <View
        key={item.PressAgencyHRID}
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
            source={require("../../../assets/Contact.png")}
            style={{
              width: 45,
              height: 45,
              resizeMode: "contain",
              marginRight: 5,
            }}
          />
        )}
        {/* <Image
                    source={require("../../../assets/Contact.png")}
                    style={{ width: 45, height: 45, resizeMode: "contain", marginRight: 5 }}
                /> */}

        <View
          style={{ marginLeft: 4, paddingTop: 4, width: width - width / 6 }}
        >
          <Text
            style={{
              color: "#2F54EB",
              fontWeight: "bold",
              width: "95%",
              marginTop: 2,
              fontSize: 14,
            }}
          >
            {item.FullName}
          </Text>
          <Text style={{ marginTop: 2 }}>{item.Position}</Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginTop: 2 }}>SĐT: </Text>
            <TouchableOpacity
              onPress={() => Linking.openURL("tel://" + item.Mobile)}
            >
              <Text style={{ fontWeight: "700", marginTop: 2 }}>
                {item.Mobile}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginTop: 2 }}>Email: </Text>
            <Text style={{ color: "#007AFF", marginTop: 2 }}>{item.Email}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginTop: 2 }}>Địa chỉ: </Text>
            <Text style={{ width: width - 133, marginTop: 2 }}>
              {item.Address}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  showConfirmSearch = () => {
    this.setState({ showSearch: !this.state.showSearch });
  };

  render() {
    let { All, PressAgency, Other } = this.state;
    let lstPA = this.state.ListPressAgencyHR;
    let PressAgencyHR = this.state.PressAgencyHR;
    return (
      <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <Toolbar
          Title="Danh bạ"
          navigation={this.props.navigation}
          HasBottomTab={true}
        >
          <View style={{ marginLeft: 10 }}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                this.setState({ showSearch: true });
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
            style={{
              borderWidth: 1,
              borderColor: "#1D39C4",
              borderRadius: 100,
              padding: 10,
              width: "80%",
            }}
            placeholder="Từ khóa"
            value={this.state.FilterName}
            onChangeText={(val) => {
              this.setState({ FilterName: val });
            }}
          />
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: "#FFFFFF",
          }}
        >
          <View
            style={{
              paddingHorizontal: 20,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <TouchableOpacity
              style={{
                borderBottomWidth: 2,
                borderBottomColor:
                  this.state.TabActive == 1 ? "#1F31A4" : "#CCCCCC",
              }}
              onPress={() =>
                this.setState(
                  {
                    TabActive: 1,
                    PageIndex: 1,
                    PressAgencyType: null,
                  },
                  () => {
                    this.LoadData(false);
                  }
                )
              }
            >
              <Text
                style={{
                  color: this.state.TabActive == 1 ? "#1F31A4" : "#CCCCCC",
                  fontWeight: "500",
                  fontSize: 17,
                  paddingBottom: 4,
                }}
              >
                Tất cả({All})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderBottomWidth: 2,
                borderBottomColor:
                  this.state.TabActive == 2 ? "#1F31A4" : "#CCCCCC",
              }}
              onPress={() =>
                this.setState(
                  {
                    TabActive: 2,
                    PageIndex: 1,
                    PressAgencyType: Enums.PressAgencyType.PressAgency,
                  },
                  () => {
                    this.LoadData(false);
                  }
                )
              }
            >
              <Text
                style={{
                  color: this.state.TabActive == 2 ? "#1F31A4" : "#CCCCCC",
                  fontWeight: "500",
                  fontSize: 17,
                  paddingBottom: 4,
                }}
              >
                Báo trí({PressAgency})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderBottomWidth: 2,
                borderBottomColor:
                  this.state.TabActive == 3 ? "#1F31A4" : "#CCCCCC",
              }}
              onPress={() =>
                this.setState(
                  {
                    TabActive: 3,
                    PageIndex: 1,
                    PressAgencyType: Enums.PressAgencyType.Other,
                  },
                  () => {
                    this.LoadData(false);
                  }
                )
              }
            >
              <Text
                style={{
                  color: this.state.TabActive == 3 ? "#1F31A4" : "#CCCCCC",
                  fontWeight: "500",
                  fontSize: 17,
                  paddingBottom: 4,
                }}
              >
                Khác({Other})
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            style={{ backgroundColor: "#FFF", width: "100%", height: "89%" }}
            data={lstPA.filter((x) =>
              Utility.FormatVNLanguage(x.FullName!.toLowerCase()).includes(
                Utility.FormatVNLanguage(this.state.FilterName.toLowerCase())
              )
            )}
            renderItem={({ item }) => this.renderItem(item)}
            keyExtractor={(item, index) => index.toString()}
            onMomentumScrollBegin={() => {
              this.onEndReachedDanhBa = true;
            }}
            onEndReached={() => {
              if (!this.onEndReachedDanhBa) {
                if (lstPA.length >= 20) {
                  this.setState(
                    { PageIndex: this.state.PageIndex + 1 },
                    async () => {
                      await this.LoadData(true);
                    }
                  );
                  this.onEndReachedDanhBa = true;
                }
              }
            }}
            onEndReachedThreshold={0.5}
          />
        </View>

        <PopupModalUpdateNote
          resetState={this.showConfirmSearch}
          modalVisible={this.state.showSearch}
          title="Tìm kiếm nâng cao"
        >
          <View style={styles.Item}>
            <View style={{ flex: 2, flexDirection: "row" }}>
              <Text>Họ tên </Text>
            </View>
            <View style={{ flex: 3 }}>
              <TextInput
                style={[Theme.TextInput]}
                value={PressAgencyHR.FullName}
                onChangeText={(val) => {
                  PressAgencyHR.FullName = val;
                  this.setState({ PressAgencyHR });
                }}
              />
            </View>
          </View>
          <View style={styles.Item}>
            <View style={{ flex: 2, flexDirection: "row" }}>
              <Text>Điện thoại </Text>
            </View>
            <View style={{ flex: 3 }}>
              <TextInput
                style={[Theme.TextInput]}
                value={PressAgencyHR.Mobile}
                onChangeText={(val) => {
                  PressAgencyHR.Mobile = val;
                  this.setState({ PressAgencyHR });
                }}
              />
            </View>
          </View>
          <View style={styles.Item}>
            <View style={{ flex: 2, flexDirection: "row" }}>
              <Text>Địa chỉ </Text>
            </View>
            <View style={{ flex: 3 }}>
              <TextInput
                style={[Theme.TextInput]}
                value={PressAgencyHR.Address}
                onChangeText={(val) => {
                  PressAgencyHR.Address = val;
                  this.setState({ PressAgencyHR });
                }}
              />
            </View>
          </View>
          <View style={styles.Item}>
            <View style={{ flex: 2, flexDirection: "row" }}>
              <Text>Ghi chú </Text>
            </View>
            <View style={{ flex: 3 }}>
              <TextInput
                style={[Theme.TextInput]}
                value={PressAgencyHR.RelatedInformation}
                onChangeText={(val) => {
                  PressAgencyHR.RelatedInformation = val;
                  this.setState({ PressAgencyHR });
                }}
              />
            </View>
          </View>

          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                PressAgencyHR.PressAgencyType = null;
                this.setState(
                  { showSearch: false, PressAgencyHR, TabActive: 1 },
                  async () => {
                    await this.LoadData(false);
                  }
                );
              }}
            >
              <LinearGradient
                colors={["#007AFF", "#007AFF"]}
                style={{
                  width: width / 4,
                  backgroundColor: "#722ED1",
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                  alignSelf: "center",
                  marginRight: 5,
                }}
              >
                <Text style={{ color: "#FFFFFF" }}>Tìm kiếm</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 80,
                backgroundColor: "#E6E9EE",
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
                alignSelf: "center",
                marginLeft: 5,
              }}
              onPress={() => {
                PressAgencyHR.FullName = "";
                PressAgencyHR.Mobile = "";
                PressAgencyHR.Address = "";
                PressAgencyHR.RelatedInformation = "";
                this.setState({
                  showSearch: false,
                  PressAgencyHR,
                });
              }}
            >
              <Text style={{ color: "#1B2031", fontSize: 15 }}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </PopupModalUpdateNote>
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
  item: {
    backgroundColor: "gainsboro",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    paddingTop: 8,
    marginBottom: 4,
    width: width / 8,
    height: height / 15,
  },
});
