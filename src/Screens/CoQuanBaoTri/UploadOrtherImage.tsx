import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Toolbar from "../../components/Toolbar";
import PickAndTakeImage from "../../components/PickAndTakeImage";
import ImageObject from "../../SharedEntity/ImageObject";
import Theme from "../../Themes/Default";
import GlobalStore from "../../Stores/GlobalStore";
import { inject, observer } from "mobx-react";
import SMX from "../../constants/SMX";
import { AttachmentDto } from "../../DtoParams/AttachmentDto";
import HttpUtils from "../../Utils/HttpUtils";
import ApiUrl from "../../constants/ApiUrl";
import adm_Attachment from "../../Entities/adm_Attachment";
import * as Enums from "../../constants/Enums";

interface iProps {
    navigation: any;
    route: any;
    GlobalStore: GlobalStore;
}
interface iState {
    img: ImageObject;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class UploadOrtherImage extends React.Component<iProps, iState> {
    constructor(props: iProps) {
        super(props);
        this.state = {
            img: new ImageObject(),
        };
    }

    TransferImageData = (image: ImageObject) => {
        this.setState({ img: image });
    };

    async UploadImage() {
        try {
            this.props.GlobalStore.ShowLoading();
            let req = new AttachmentDto();
            let att = new adm_Attachment();
            att.RefID = this.props.route.params.PressAgencyID;
            att.RefType = Enums.AttachmentRefType.PressAgencyOtherImage;
            att.ImageBase64String = this.state.img.Base64;
            att.ContentType = this.state.img.FileExtension;
            att.FileName = this.state.img.FileName;
            att.DisplayName = this.state.img.FileName;
            req.Attachment = att;

            let res = await HttpUtils.post<AttachmentDto>(
                ApiUrl.Common_ExecuteAttachment,
                SMX.ApiActionCode.UpdateAttachment,
                JSON.stringify(req)
            );
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.UpdateImageTrigger();
            this.props.navigation.goBack();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Toolbar Title="Upload ảnh khác" navigation={this.props.navigation} />
                <PickAndTakeImage navigation={this.props.navigation} SendData={this.TransferImageData}>
                    <View style={{ width: "100%", alignItems: "center" }}>
                        <TouchableOpacity style={Theme.BtnSmPrimary} onPress={() => this.UploadImage()}>
                            <Text style={{ color: "white" }}>Tải lên</Text>
                        </TouchableOpacity>
                    </View>
                </PickAndTakeImage>
            </View>
        );
    }
}
