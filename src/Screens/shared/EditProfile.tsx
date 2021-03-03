import React, { Component } from 'react'
import { Text, View, ScrollView, Button } from 'react-native'
import Theme from '../../Themes/Default'
import DropDownBox from '../../components/DropDownBox'
import DateTimePicker from '../../components/DateTimePicker'
import LoadingModal from '../../components/LoadingModal'

interface iProp {
    navigation: any
}

interface iState {
    IsLoading?: boolean;

}

export default class EditProfile extends Component<iProp, iState> {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    SetupForm() {
        this.props.navigation.setParam("fn_SaveProfile", this.SaveProfile);
    }

    SaveProfile() {
    }

    async LoadData() {

    }

    render() {
        return (
            <ScrollView style={Theme.Content}>
                <View style={Theme.SectionContent}>
                    <View style={Theme.FormGroup}>
                        <Text style={Theme.Label}>Tài khoản</Text>
                        <Text style={Theme.TextView}>
                            {/* {this.state.standard.AddressProvince} */}
                        </Text>
                    </View>
                    <View style={Theme.FormGroup}>
                        <Text style={Theme.Label}>Datetime picker</Text>
                        <DateTimePicker HasTime={true} />
                    </View>
                </View>
                <View style={Theme.SectionContent}>
                    <Button onPress={() => this.props.navigation.navigate('MapSingle')} title="Map single"></Button>
                    <Button onPress={() => this.props.navigation.navigate('MapMulti')} title="Map multi"></Button>
                </View>
                <LoadingModal Loading={this.state.IsLoading} />
            </ScrollView>
        )
    }
}
