import React from 'react';
import {View, Text, TouchableOpacity,Image} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

interface iProps {
    navigation: any;
}
export default class GoBack extends React.Component<iProps,any> {

    constructor(props: iProps) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity style={{marginLeft:10}} onPress={() => this.props.navigation.goBack()}>
                <Image style={{width:30,height:30}} source={require('../../assets/homescreen/back1.png')}/>
            </TouchableOpacity>
        )
    }
}