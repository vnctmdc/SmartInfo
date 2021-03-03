import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

export class NavigationDrawerStructure extends React.Component {
    render() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { this.props.navigationProps.toggleDrawer() }}>
                    <FontAwesome5 style={{ marginLeft: 5 }} name="bars" size={20} color="#ffffff" />
                </TouchableOpacity>
            </View>
        );
    }
}
