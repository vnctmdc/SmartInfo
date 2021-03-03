import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface iProps {
    Title: string;
    Message: string;
    okClick?: () => void;
    cancelClick?: () => void;
    Show: boolean;
}

interface iState {
    Show: boolean;
    Title: string;
    Message: string;
    okClick: () => void;
    cancelClick?: () => void;
}
export default class SMAlert extends React.Component<iProps, iState> {
    constructor(props: iProps) {
        super(props);
        this.state = {
            Show: this.props.Show,
            Title: this.props.Title,
            Message: this.props.Message,
            okClick: this.props.okClick,
            cancelClick: this.props.cancelClick,
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps: iProps) {
        if (nextProps.Show && nextProps.Show !== this.state.Show) {
            this.setState({ Show: nextProps.Show });
        }
        if (nextProps.Title && nextProps.Title !== this.state.Title) {
            this.setState({ Title: nextProps.Title });
        }
        if (nextProps.Message && nextProps.Message !== this.state.Message) {
            this.setState({ Message: nextProps.Message });
        }
        if (nextProps.okClick && nextProps.okClick !== this.state.okClick) {
            this.setState({ okClick: nextProps.okClick });
        }
        if (nextProps.cancelClick && this.state.cancelClick && nextProps.cancelClick !== this.state.cancelClick) {
            this.setState({ cancelClick: nextProps.cancelClick });
        }
    }

    render() {
        return (
            <View
                style={{
                    position: "absolute",
                    zIndex: 99999999,
                    backgroundColor: "rgba(52, 52, 52, 0.4)",
                    width: this.state.Show ? "100%" : 0,
                    height: this.state.Show ? "100%" : 0,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 5,
                    borderColor: "gainsboro",
                }}
            >
                <View
                    style={{
                        display: this.state.Show ? "flex" : "none",
                        position: "relative",
                        backgroundColor: "white",
                        borderRadius: 5,
                        //height: 150,
                        width: 250,
                    }}
                >
                    <View
                        style={{
                            //flex: 2,
                            //borderBottomWidth: 1,
                            paddingLeft: 10,
                            //borderColor: "gainsboro",
                            paddingVertical: 10,
                            justifyContent: "center",
                            backgroundColor: "#2EA8EE",
                            borderTopLeftRadius: 5,
                            borderTopRightRadius: 5,
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: "bold",
                                fontSize: 17,
                                color: "white",
                            }}
                        >
                            {this.state.Title}
                        </Text>
                    </View>
                    <View style={{ padding: 10, borderColor: "gainsboro", borderBottomWidth: 1 }}>
                        <Text>{this.state.Message}</Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                                paddingVertical: 10,
                            }}
                            onPress={() => {
                                if (this.state.okClick) {
                                    this.state.okClick();
                                }
                                this.setState({ Show: false });
                            }}
                        >
                            <Text style={{ fontWeight: "bold", color: "#2EA8EE" }}>Ok</Text>
                        </TouchableOpacity>

                        {this.state.cancelClick ? (
                            <View style={{ width: 1, backgroundColor: "gainsboro" }}></View>
                        ) : undefined}
                        {this.state.cancelClick ? (
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    paddingVertical: 10,
                                }}
                                onPress={() => {
                                    if (this.state.cancelClick) this.state.cancelClick();
                                    this.setState({ Show: false });
                                }}
                            >
                                <Text style={{ fontWeight: "bold" }}>Cancel</Text>
                            </TouchableOpacity>
                        ) : undefined}
                    </View>
                </View>
            </View>
        );
    }
}
