import React from 'react';
import { Text, View, Image, Dimensions, TouchableOpacity, Switch, AsyncStorage, Platform, Alert } from 'react-native';
import Toolbar from '../../components/Toolbar';
import Employee from '../../Entities/Employee';
import GlobalStore from '../../Stores/GlobalStore';
import Utility from '../../Utils/Utility';
import HttpUtils from '../../Utils/HttpUtils';
import ProfileDto from '../../DtoParams/ProfileDto';
import ApiUrl from '../../constants/ApiUrl';
import SMX from '../../constants/SMX';
import { observer, inject } from 'mobx-react';
import { LinearGradient } from 'expo-linear-gradient';
import Theme from '../../Themes/Default';
import AuthenticationService from '../../Utils/AuthenticationService';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PopupModalUpdateNote from '../../components/PopupModalUpdateNote';
import { ScrollView } from 'react-native-gesture-handler';
import * as Device from "expo-device";
import * as LocalAuthentication from 'expo-local-authentication';

const { height, width } = Dimensions.get('window');

interface iProps {
  navigation: any;
  route: any;
  GlobalStore: GlobalStore;
}
interface iState {
  Employee: Employee;
  showConfirmFingerprint: boolean;
  showConfirmFacialRecognition: boolean;
  FINGERPRINT?: boolean;
  FACIAL_RECOGNITION?: boolean;
  touch?: boolean;
  face?: boolean;

}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class ProfilesSrc extends React.Component<iProps, iState> {
  constructor(props: any) {
    super(props);
    this.state = {
      Employee: new Employee(),
      showConfirmFingerprint: false,
      showConfirmFacialRecognition: false
    }
  }

  async componentDidMount() {
    await this.checkDeviceForHardware();
    await this.LoadData();
  }

  checkDeviceForHardware = async () => {
    //let compatible = await LocalAuthentication.hasHardwareAsync();
    let lstType = await LocalAuthentication.supportedAuthenticationTypesAsync();
    let isFingerprint = lstType.includes(1);
    let isFace = lstType.includes(2);

    let _touch = await AsyncStorage.getItem("FINGERPRINT");
    let _face = await AsyncStorage.getItem("FACIAL_RECOGNITION");

    this.setState({
      FINGERPRINT: isFingerprint,
      FACIAL_RECOGNITION: isFace,
      touch: _touch === 'true' ? true : false,
      face: _face === 'true' ? true : false
    });

  };

  async LoadData() {
    this.props.GlobalStore.ShowLoading();
    let res = await HttpUtils.post<ProfileDto>(
      ApiUrl.Profile_Execute,
      SMX.ApiActionCode.GetProfile,
      JSON.stringify(new ProfileDto())
    );

    this.setState({
      Employee: res!.Employee!
    });

    this.props.GlobalStore.HideLoading();

  }

  async SaveRegistration() {
    try {
      this.props.GlobalStore.ShowLoading();

      // Checking if device is compatible
      const isCompatible = await LocalAuthentication.hasHardwareAsync();

      if (!isCompatible) {
        throw "Thiết bị của bạn không tương thích với chức năng này.";
      }

      // Checking if device has biometrics records
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!isEnrolled) {
        throw new Error("Bạn chưa thiết lập sinh trắc học cho thiết bị này.");
      }

      // Authenticate user
      const results = await LocalAuthentication.authenticateAsync();

      console.log(222, results);
      

      if (results.success) {
        let guid =
          Platform.OS == "android"
            ? Device.osBuildFingerprint
            : `${Device.brand}/${Device.osVersion}/${Device.modelId}/${Device.osBuildId}`;
        let req = new ProfileDto();
        let employee = new Employee();
        employee.EmployeeID = this.state.Employee.EmployeeID;
        employee.Guid = guid;
        employee.DeviceName = Device.modelName;

        req.Employee = employee;

        await HttpUtils.post<ProfileDto>(
          ApiUrl.Profile_Execute,
          SMX.ApiActionCode.SaveItem,
          JSON.stringify(req)
        );

      } else {
        throw new Error("Thiết lập đăng nhập bằng sinh trắc học thất bại, vui lòng thử lại");
      }

      this.props.GlobalStore.HideLoading();
    } catch (ex) {
      this.props.GlobalStore.HideLoading();
      Alert.alert("Thông báo ", ex?.message);
    }
  }

  async onAllowFingerprint() {
    try {
      if (this.state.touch === true) {
        await this.SaveRegistration();
        await AsyncStorage.setItem("FINGERPRINT", this.state.touch + '');
      } else {
        await AsyncStorage.removeItem("FINGERPRINT");
      }

    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

  async onAllowFacial_Recognition() {
    try {
      if (this.state.face === true) {
        await this.SaveRegistration();
        await AsyncStorage.setItem("FACIAL_RECOGNITION", this.state.face + '');
      } else {
        await AsyncStorage.removeItem("FACIAL_RECOGNITION");
      }

    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

  showConfirmFingerprint = () => {
    this.setState({ showConfirmFingerprint: !this.state.showConfirmFingerprint, touch: false });
  };

  showConfirmFacial_Recognition = () => {
    this.setState({ showConfirmFacialRecognition: !this.state.showConfirmFacialRecognition, face: false });
  };

  render() {
    const { Employee } = this.state;
    return (
      <View style={{ height: height, backgroundColor: "#F6F6FE" }}>
        <Toolbar Title="Thông tin người đăng nhập" navigation={this.props.navigation} />
        <ScrollView
          style={{
            paddingTop: 10,
            flex: 1,
            backgroundColor: "#F6F6FE",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20
          }}
        >

          <View
            style={{
              marginBottom: 10,
              marginHorizontal: 10,
              //height: height / 4,
              borderColor: "#F0F0F4",
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 15,
              backgroundColor: "#FFFFFF",
              justifyContent: "center",
            }}
          >
            <View style={{ paddingTop: 8 }}>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <View>
                  <Image
                    style={{
                      backgroundColor: "#007AFF",
                      borderRadius: 50,
                      width: 100,
                      height: 100,
                      //resizeMode: "contain",
                      //overflow:'hidden'
                    }}
                    source={require("../../../assets/avatar.png")}
                  />
                </View>
                <View style={{ marginTop: 5, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ paddingLeft: 8, fontWeight: "bold", fontSize: 30 }}>
                    {Employee.Name}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View
            style={{
              marginHorizontal: 10,
              borderColor: "#F0F0F4",
              borderWidth: 1,
              borderRadius: 8,
              backgroundColor: "#FFFFFF",
            }}
          >
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 10,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
                <Text>Chức danh</Text>
                <Text style={{ fontWeight: "600" }}>{Employee.Description}</Text>
              </View>
              <View
                style={{
                  height: 1,
                  backgroundColor: "#F0F0F4",
                  marginVertical: 8,
                }}
              ></View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
                <Text>Ngày sinh</Text>
                <Text style={{ fontWeight: "600" }}>{Utility.GetDateString(Employee.DOB)}</Text>
              </View>
              <View
                style={{
                  height: 1,
                  backgroundColor: "#F0F0F4",
                  marginVertical: 8,
                }}
              ></View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
                <Text>Số điện thoại</Text>
                <Text style={{ fontWeight: "600" }}>{Employee.Mobile}</Text>
              </View>
              <View
                style={{
                  height: 1,
                  backgroundColor: "#F0F0F4",
                  marginVertical: 8,
                }}
              ></View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
                <Text>Email</Text>
                <Text style={{ fontWeight: "600" }}>{Employee.Email}</Text>
              </View>
              <View
                style={{
                  height: 1,
                  backgroundColor: "#F0F0F4",
                  marginVertical: 8,
                }}
              ></View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
                <Text>Mô tả</Text>
                <Text style={{ fontWeight: "bold" }}>{Employee.Notes}</Text>
              </View>
            </View>
          </View>

          {
            this.state.FACIAL_RECOGNITION == true ? (
              <View
                style={{
                  marginVertical: 10,
                  marginHorizontal: 10,
                  borderColor: "#F0F0F4",
                  borderWidth: 1,
                  borderRadius: 8,
                  backgroundColor: "#FFFFFF",
                  height: 70,
                  alignItems: 'center'
                }}
              >
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    flexDirection: "row",
                    flex: 5
                  }}
                >
                  <View style={{ flex: .6, justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                      style={{ height: 30, width: 30, resizeMode: "contain" }}
                      source={require("../../../assets/face-id.png")}
                    />
                  </View>
                  <View style={{ justifyContent: 'center', alignItems: 'flex-start', flex: 3.4 }}>
                    <Text style={{ paddingLeft: 5, fontWeight: 'bold', fontSize: 14 }}>
                      Đăng nhập bằng khuôn mặt</Text>
                  </View>
                  <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <Switch
                      value={this.state.face}
                      onValueChange={(val) => {
                        if (val === false) {
                          this.setState({ showConfirmFacialRecognition: val, face: val }, async () => {
                            await this.onAllowFacial_Recognition();
                          });
                        } else {
                          this.setState({ showConfirmFacialRecognition: val, face: val });
                        }

                      }}
                    />
                  </View>
                </View>
              </View>
            ) : (
              <View
                style={{
                  marginVertical: 10,
                  marginHorizontal: 10,
                  borderColor: "#F0F0F4",
                  borderWidth: 1,
                  borderRadius: 8,
                  backgroundColor: "#FFFFFF",
                  height: 70,
                  alignItems: 'center'
                }}
              >
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    flexDirection: "row",
                    flex: 5
                  }}
                >
                  <View style={{ flex: .6, justifyContent: 'center', alignItems: 'center' }}>
                    <MaterialIcons name="fingerprint" size={32} color="#000000" />
                  </View>
                  <View style={{ justifyContent: 'center', alignItems: 'flex-start', flex: 3.4 }}>
                    <Text style={{ paddingLeft: 5, fontWeight: 'bold', fontSize: 14 }}>Đăng nhập bằng vân tay</Text>
                  </View>
                  <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <Switch
                      value={this.state.touch}
                      onValueChange={(val) => {
                        if (val === false) {
                          this.setState({ showConfirmFingerprint: val, touch: val }, async () => {
                            await this.onAllowFingerprint();
                          });
                        } else {
                          this.setState({ showConfirmFingerprint: val, touch: val });
                        }
                      }}
                    />
                  </View>
                </View>
              </View>
            )
          }

          < TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              AuthenticationService.SignOut();
              this.props.navigation.navigate("SrcLogin");
            }}
          >
            <LinearGradient
              colors={["#007AFF", "#007AFF"]}
              style={{
                width: width - 60,
                height: 50,
                backgroundColor: "#007AFF",
                borderRadius: 5,
                justifyContent: "center",
                marginTop: 10,
                alignItems: "center",
              }}
            >
              <Text style={Theme.BtnTextGradient}>Đăng xuất</Text>
            </LinearGradient>
            <Text style={{ color: "#FFF", fontSize: 18, textAlign: "center" }}></Text>
          </TouchableOpacity>

          <PopupModalUpdateNote
            resetState={this.showConfirmFingerprint}
            modalVisible={this.state.showConfirmFingerprint}
            title="Xác nhận"
          >
            <View style={{ padding: 10, marginBottom: 15 }}>
              <Text style={{ fontSize: 15 }}>Bạn có chắc chắn muốn mở tính năng này? </Text>
            </View>

            <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "center" }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ showConfirmFingerprint: false }, async () => {
                    await this.onAllowFingerprint();
                  });
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
                  <Text style={Theme.BtnTextGradient}>Đồng ý</Text>
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
                  this.setState({ showConfirmFingerprint: false, touch: false });
                }}
              >
                <Text style={{ color: "#1B2031", fontSize: 15 }}>Không</Text>
              </TouchableOpacity>
            </View>
          </PopupModalUpdateNote>

          <PopupModalUpdateNote
            resetState={this.showConfirmFacial_Recognition}
            modalVisible={this.state.showConfirmFacialRecognition}
            title="Xác nhận"
          >
            <View style={{ padding: 10, marginBottom: 15 }}>
              <Text style={{ fontSize: 15 }}>Bạn có chắc chắn muốn mở tính năng này? </Text>
            </View>

            <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "center" }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ showConfirmFacialRecognition: false }, async () => {
                    //if(this.)
                    await this.onAllowFacial_Recognition();
                  });
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
                  <Text style={Theme.BtnTextGradient}>Đồng ý</Text>
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
                  this.setState({ showConfirmFacialRecognition: false, face: false });
                }}
              >
                <Text style={{ color: "#1B2031", fontSize: 15 }}>Không</Text>
              </TouchableOpacity>
            </View>
          </PopupModalUpdateNote>

        </ScrollView>
      </View >
    )
  }
}