import React, { Component } from 'react'
import { View, AsyncStorage, StyleSheet, Image, Dimensions } from 'react-native'
import LoadingModal from '../../components/LoadingModal'
import HttpUtils from '../../Utils/HttpUtils'
import ApiUrl from '../../constants/ApiUrl'
import AuthenticationParam from '../../DtoParams/AuthenticationParam'

interface iState {
    IsLoading?: boolean
}
export default class Logout extends Component<any, iState> {
    // Cấu hình navigation, ẩn toàn bộ header
    static navigationOptions = {
        header: null,
    };

    constructor(props: any) {
        super(props);
        this.state = {
            IsLoading: false
        };
    }

    async componentDidMount() {
        try {
            // Xóa tài khoản lưu ở Storage
            await this.removePassword();

            // Đăng xuất khỏi server
            await this.logoutServer();

        } catch (e) {
            console.log(e);
        }

        // Tắt loading
        this.setState({ IsLoading: false });

        // Nhảy sang trang login
        setTimeout(() => { this.props.navigation.navigate('SrcLogin') }, 1000);
    }

    async logoutServer() {
        await HttpUtils.post<AuthenticationParam>(ApiUrl.Authentication_Logout, "", "", true);
    }

    async removePassword() {
        await AsyncStorage.removeItem("USER_NAME");
        await AsyncStorage.removeItem("PASS_WORD");
    }

    render() {
        return (
            <View style={styles.body}>
                <Image
                    source={require('../../../assets/logout.png')}
                    style={styles.welcomImage} />
                <LoadingModal Loading={this.state.IsLoading} />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    body: {
        backgroundColor: '#3b709d',
        margin: 0,
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        padding: 50,
        flexDirection: "row"
    },
    welcomImage: {
        flex: 1,
        //alignSelf: 'stretch',
        //width: Dimensions.get('window').width - 50, // Padding mỗi bên 10px. Cần xác định width của ảnh, sau đó mới scale
        resizeMode: "center"
    }
});