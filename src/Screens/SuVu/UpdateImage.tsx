import React from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import ImageObject from "../../SharedEntity/ImageObject";
import adm_Attachment from "../../Entities/adm_Attachment";
import HttpUtils from "../../Utils/HttpUtils";
import ApiUrl from "../../constants/ApiUrl";
import SMX from "../../constants/SMX";
import * as Enums from "../../constants/Enums";
import Theme from '../../Themes/Default';
import { inject, observer } from "mobx-react";
import Toolbar from "../../components/Toolbar";
import GlobalStore from "../../Stores/GlobalStore";
import PickAndTakeImage from "../../components/PickAndTakeImage";
import { CommonDto } from '../../DtoParams/CommonDto';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface iProps {
    navigation: any;
    route: any;
    GlobalStore: GlobalStore;
}

interface iState {
    attachment: adm_Attachment;
    file: ImageObject;
    NewsID: number;
    ECMRefType: number;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class SrcUpdateImage extends React.Component<iProps, iState> {
    constructor(props: iProps) {
        super(props);
        this.state = {
            attachment: this.props.route.params.attachment,
            file: new ImageObject(),
            NewsID: this.props.route.params.NewsID,
            ECMRefType: this.props.route.params.ECMRefType
        };
    }

    async componentDidMount() {
        await this.LoadData();
    }

    async LoadData() {
        try {
            this.props.GlobalStore.ShowLoading();

            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
            this.props.GlobalStore.HideLoading();
        }
    }

    TransferImage = async (image: adm_Attachment) => {
        this.setState({file: image});
    };

    async Upload() {
        try {
            this.props.GlobalStore.ShowLoading();
            let request = new CommonDto();
            let att = new adm_Attachment();
            att.AttachmentID = this.state.attachment.AttachmentID;
            att.RefID = this.state.attachment.RefID;
            att.RefType = this.state.attachment.RefType;
            att.FileName = this.state.file.FileName;
            att.DisplayName = this.state.file.FileName;
            att.ContentType = `image/${this.state.file.FileExtension}`;
            att.ImageBase64String = this.state.file.Base64;
            request.Attachment = att;

            let response = await HttpUtils.post<CommonDto>(
                ApiUrl.Common_ExecuteAttachment,
                SMX.ApiActionCode.UpdateAttachment,
                JSON.stringify(request),
                true
            )
            this.props.GlobalStore.UpdatedStatusTrigger();
            this.props.GlobalStore.HideLoading();
            this.props.navigation.goBack();
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
            this.props.GlobalStore.HideLoading();
        }
    }


}

