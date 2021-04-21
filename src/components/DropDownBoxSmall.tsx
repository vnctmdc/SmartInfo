import React, { Component } from "react";
import { Text, TextInput, View, Modal, TouchableOpacity, FlatList, Dimensions } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import Theme from "../Themes/Default";
const { width, height } = Dimensions.get("window");

interface iProp {
    SelectedValue?: any; // Là giá trị đã chọn của DropdownBox. Là cả object chứ ko chỉ value
    DataSource?: Array<any>; // Dữ liệu của DropdownBox
    ValueField?: string; // Thuộc tính chứa giá trị của mảng
    TextField?: string; // Thuộc tính chứa text của mảng
    PlaceHolder?: string; // Placeholder của dropdown
    OnSelectedItemChanged?: (item: any) => void; // Sự kiện khi change item
}
interface iState {
    showItemList: boolean;
    selectedValue: string; // Có thể chứa cả object vào đây
    //SelectedText?: string
}

export default class DropDownBox extends Component<iProp, iState> {
    constructor(props) {
        super(props);
        this.state = {
            showItemList: false,
            selectedValue: this.props.SelectedValue ? this.props.SelectedValue.toString() : "",
            //SelectedText: this.getSelectedText(this.props.SelectedValue)
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps: iProp) {
        if (this.state.selectedValue !== nextProps.SelectedValue) {
            this.setState({
                selectedValue: nextProps.SelectedValue,
                //SelectedText: this.getSelectedText(nextProps.SelectedValue)
            });
        }
    }

    private getSelectedText(): string {
        const dataSource = this.props.DataSource;

        //console.log(this.props.DataSource);

        //console.log("Selected value: " + value);
        // console.log(this.props.selectedValue);
        const value = this.state.selectedValue;

        if (value === null || value === undefined || dataSource === null || dataSource === undefined) {
            return "";
        }

        let selectedItem = dataSource.find((en) => en[this.props.ValueField] === value);
        //console.log("Selected item: " + JSON.stringify(selectedItem));

        if (selectedItem) {
            return selectedItem[this.props.TextField];
        } else {
            return "";
        }
    }

    showPopupItem() {
        //console.log(this.props.data);
        this.setState({ showItemList: true });
    }

    handleItemClick(item) {
        if (this.state.selectedValue === item[this.props.ValueField]) {
            this.setState({
                showItemList: false,
            });
            return;
        }

        this.setState({
            showItemList: false,
            selectedValue: item[this.props.ValueField],
            //SelectedText: item[this.props.TextField]
        });

        if (this.props.OnSelectedItemChanged) {
            this.props.OnSelectedItemChanged(item);
        }
    }

    renderItem(item: any) {
        return (
            <TouchableOpacity onPress={this.handleItemClick.bind(this, item)}>
                <Text style={{ padding: 5, fontSize: 18, color: "#000000" }}>{item[this.props.TextField]}</Text>
            </TouchableOpacity>
        );
    }

    render() {
        //console.log(this.props.DataSource);
        return (
            <View style={{ flexDirection: "row" }}>
                <View style={Theme.DropdownListInputSmall}>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => {
                            this.showPopupItem();
                        }}
                        style={{ backgroundColor: "#FFFFFF", flex: 1, flexDirection: "row" }}
                    >
                        <TextInput
                            style={{ fontSize: 16, flex: 1, textAlign: "left", color: "#1B2031" }}
                            value={this.getSelectedText()}
                            editable={false}
                            pointerEvents="none"
                            placeholder={this.props.PlaceHolder}
                        />
                        <FontAwesome style={{ marginTop: -10, fontSize: 30 }} name="sort-down" color="#000000" />
                    </TouchableOpacity>
                </View>
                <Modal visible={this.state.showItemList} transparent={true} animationType="fade">
                    <View
                        style={{
                            paddingTop: 80,
                            paddingHorizontal: 30,
                            backgroundColor: "#00000040",
                            flex: 1,
                        }}
                    >
                        <View
                            style={{
                                //flex: 1,
                                backgroundColor: "#ffffff",
                                borderRadius: 10,
                                height: height / 3
                            }}
                        >
                            <View style={{ padding: 10, flex: 1 }}>
                                <FlatList
                                    data={this.props.DataSource}
                                    renderItem={({ item }) => this.renderItem(item)}
                                    keyExtractor={(item) => item[this.props.ValueField].toString()}
                                />
                            </View>
                            <TouchableOpacity
                                style={{
                                    alignItems: "center",
                                    borderTopColor: "#acacac",
                                    borderTopWidth: 1,
                                    padding: 7,
                                }}
                                onPress={() => {
                                    this.setState({ showItemList: false });
                                }}
                            >
                                <Text style={{ color: "#e63946", fontWeight: "bold", fontSize: 18 }}>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}
