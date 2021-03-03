import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import ApiUrl from '../../constants/ApiUrl';
import SMX from '../../constants/SMX';
import * as Enums from '../../constants/Enums';
import Theme from '../../Themes/Default';
import Toolbar from '../../components/Toolbar';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import GlobalStore from '../../Stores/GlobalStore';
import NegativeNews from '../../Entities/NegativeNews';
import { inject, observer } from 'mobx-react';
import NegativeNewsDto from '../../DtoParams/NegativeNewsDto';
import HttpUtils from '../../Utils/HttpUtils';

interface iProps {
    navigation: any;
    GlobalStore: GlobalStore;
    NegativeNews: NegativeNews;
    route: any;
}

interface iState {
    NegativeNews: NegativeNews;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class DetailDisplay extends React.Component<iProps, iState>{
    constructor(props: iProps) {
        super(props);
        this.state = {
            NegativeNews: this.props.route.params.NegativeNews,
        }

    }

    async componentDidMount() {
        await this.LoadData();
    }

    async LoadData() {
        try {
            this.props.GlobalStore.ShowLoading();
            let request = new NegativeNewsDto();
            request.NegativeNewsID = this.state.NegativeNews.NegativeNewsID;
            let res = await HttpUtils.post<NegativeNewsDto>(
                ApiUrl.NegativeNews_ExecuteNegativeNews,
                SMX.ApiActionCode.DetailDisplay,
                JSON.stringify(request),
                true
            );

            this.setState({ NegativeNews: res.NegativeNews });
            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
            this.props.GlobalStore.HideLoading();
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Toolbar Title="Chi tiết sự vụ phát sinh" navigation={this.props.navigation}>

                </Toolbar>

            </View>
        );
    }
}