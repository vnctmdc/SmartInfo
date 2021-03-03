import React, { Component } from 'react';
import {
    View, TextInput, TouchableOpacity, Platform, Modal, Button, StyleSheet, Text
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import Theme from '../Themes/Default'

interface iProp {
    HasTime?: boolean;
    SelectedDate?: Date;
    OnselectedDateChanged?: ((newDate: Date) => void)
}

interface iState {
    selectedDate?: Date;
    show: boolean;
    mode: any;
}

export default class DateTimePicker extends Component<iProp, iState> {
    pickDate: Date;

    constructor(props: iProp) {
        super(props);
        this.state = {
            selectedDate: this.props.SelectedDate,
            show: false,
            mode: "date"
        };
    }

    displayDateValue(dateVal: Date) {
        if (dateVal) {

            let year = dateVal.getFullYear().toString();

            let month = (dateVal.getMonth() + 1).toString();
            if (month.length < 2) {
                month = "0" + month;
            }

            let day = dateVal.getDate().toString();
            if (day.length < 2) {
                day = "0" + day;
            }

            return day + "/" + month + "/" + year;
        }
        else {
            return "";
        }
    }

    displayTimeValue(dateVal: Date) {
        if (dateVal) {
            let hour = (dateVal.getHours()).toString();
            if (hour.length < 2) {
                hour = "0" + hour;
            }

            let minute = (dateVal.getMinutes()).toString();
            if (minute.length < 2) {
                minute = "0" + minute;
            }

            return hour + ":" + minute;
        }
        else {
            return "";
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps: iProp) {
        // Cần phải check những props nào thay đổi thì gán lại giá trị của state đó để tránh vẽ lại giao diện
        if (this.state.selectedDate !== nextProps.SelectedDate) {
            this.setState({
                selectedDate: nextProps.SelectedDate
            })
        }
    }

    openDatePicker(_mode: string) {
        // Khởi tạo giá trị của datepicker, bắt buộc phải có
        if (this.state.selectedDate) {
            this.pickDate = this.state.selectedDate;
        }
        else {
            this.pickDate = new Date();
        }
        this.setState({ show: true, mode: _mode });
    }

    setDate(newDate) {
        console.log("SetDate");
        console.log(newDate);

        if (newDate) {
            // Do cả DatePicker và TimePicker cùng dùng chung 1 giá trị date. 
            // Cho nên khi mở mode = "date" thì time bị reset về 00:00
            // Khi mở mode = "time" thì date bị reset về Today
            // Đoạn code phía dưới sẽ giữ lại phần Date và Time cũ

            let finalDate: Date = newDate;
            if (this.state.selectedDate) {
                if (this.state.mode === "date") {
                    finalDate.setHours(this.state.selectedDate.getHours());
                    finalDate.setMinutes(this.state.selectedDate.getMinutes());
                }
                else {
                    finalDate.setFullYear(this.state.selectedDate.getFullYear());
                    finalDate.setMonth(this.state.selectedDate.getMonth());
                    finalDate.setDate(this.state.selectedDate.getDate());
                }
            }

            this.setState({
                selectedDate: finalDate,
                show: false
            });
            if (this.props.OnselectedDateChanged) {
                this.props.OnselectedDateChanged(finalDate);
            }
            //console.log(this.state.selectedDate);
        }
    }

    render() {
        return (
            <View style={{ flexDirection: "row" }}>
                {this.props.HasTime === true &&
                    <View style={Theme.TimeInput}>
                        <TouchableOpacity activeOpacity={0.5}
                            style={{ backgroundColor: '#ffffff', flex: 1, flexDirection: "row" }}
                            onPress={() => this.openDatePicker("time")}>
                            <TextInput style={{ fontSize: 16, flex: 1, textAlign: "left" }}
                                editable={false} pointerEvents="none"
                                value={this.displayTimeValue(this.state.selectedDate)} />
                            <FontAwesome style={{ marginTop: 0, fontSize: 20 }} name="clock" color="#000000" />
                        </TouchableOpacity>
                    </View>
                }
                <View style={Theme.PickerInput}>
                    <TouchableOpacity activeOpacity={0.5}
                        style={{ backgroundColor: '#ffffff', flex: 1, flexDirection: "row" }}
                        onPress={() => this.openDatePicker("date")}>
                        <TextInput style={{ fontSize: 16, flex: 1 }}
                            editable={false} pointerEvents="none"
                            value={this.displayDateValue(this.state.selectedDate)} />
                        <FontAwesome style={{ marginTop: 0, fontSize: 20 }} name="calendar-alt" color="#000000" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity activeOpacity={0.5}
                    onPress={() => { this.pickDate = null; this.setState({ selectedDate: null }); }}>
                    <FontAwesome style={{ marginTop: 9, marginLeft: 12, marginRight: 2, fontSize: 20 }} name="times-circle" color="#ff0000" />
                </TouchableOpacity>
                {
                    (this.state.show && Platform.OS === "android") &&
                    <RNDateTimePicker
                        value={this.pickDate}
                        mode={this.state.mode}
                        is24Hour={true}
                        display="spinner"
                        onChange={(event, val) => this.setDate(val)} />
                }
                {
                    (this.state.show && Platform.OS === "ios") &&
                    <Modal visible={true} transparent={true} animationType="fade">
                        <View style={{ backgroundColor: '#B3efefef', padding: 25, flex: 1, justifyContent: "center" }}>
                            <RNDateTimePicker
                                value={this.pickDate}
                                mode={this.state.mode}
                                is24Hour={true}
                                display="spinner"
                                onChange={(event, val) => { this.pickDate = val; }} />
                            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                <TouchableOpacity activeOpacity={0.8}
                                    onPress={() => this.setState({ show: false })}>
                                    <Text style={styles.buttonCancel}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.8}
                                    onPress={() => this.setDate(this.pickDate)}>
                                    <Text style={styles.buttonOK}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create(
    {
        buttonOK: {
            fontSize: 24,
            margin: 20,
            fontWeight: "bold",
            color: "#0000ff",
        },
        buttonCancel: {
            fontSize: 24,
            margin: 20,
            fontWeight: "bold",
            color: "#ff0000",
        }
    }
);