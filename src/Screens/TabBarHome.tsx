import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface iState {
    CurrentView: string
}
export default class TabBarHome extends Component<any, iState> {
    constructor(props:any) {
        super(props);

        this.state = {
            CurrentView: 'ListProcessValuationDocument',
        }
    }

    handleChangeView(viewName) {
        this.setState({ CurrentView: viewName });
        this.props.onChangeScreen(viewName);
    }

    getStyle(viewName) {
        if (viewName === this.state.CurrentView) {
            return "#f4511e";
        }
        else {
            return "#000000";
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} activeOpacity={0.5}
                    onPress={() => this.handleChangeView("ListProcessValuationDocument")}>
                    <FontAwesome5 name="book" size={18} style={{ color: this.getStyle("ListProcessValuationDocument") }} />
                    <Text style={[styles.buttonText, { color: this.getStyle("ListProcessValuationDocument") }]}>Thông Tin</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} activeOpacity={0.5}
                    onPress={() => this.handleChangeView('MapProcessValuationDocument')}>
                    <FontAwesome5 name="map-marker-alt" size={18} style={{ color: this.getStyle("MapProcessValuationDocument") }} />
                    <Text style={[styles.buttonText, { color: this.getStyle("MapProcessValuationDocument") }]}>Địa chỉ</Text>
                </TouchableOpacity>                
            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',       
        flexDirection: 'row',
        paddingVertical:5,
        borderTopWidth: 3,
        borderTopColor: '#ababab'
    },
    buttonIcon: {
        flex: 2,
        marginTop: 5
    },
    buttonText: {
        textAlign: "center"
    },
    button: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white'
    }
})
