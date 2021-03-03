import React from "react";
import ActionButton from "react-native-action-button";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

interface iProps {
    ActionButtonProps?: any;
    ActionButtonItemProps?: any;
    onApproval?: any;
    onReject?: any;
}

interface iState {}
export default class FABFlowApproval extends React.Component<iProps, iState> {
    constructor(props: iProps) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <ActionButton
                buttonColor="#2EA8EE"
                degrees={0}
                renderIcon={() => <FontAwesome5 name="ellipsis-v" color={"white"} size={25} />}
                offsetX={10}
                offsetY={10}
                spacing={10}
                {...this.props.ActionButtonProps}
            >
                <ActionButton.Item
                    buttonColor="#008000"
                    onPress={() => this.props.onApproval()}
                    {...this.props.ActionButtonItemProps}
                >
                    <FontAwesome5 name="check" color={"white"} size={25} />
                </ActionButton.Item>
                <ActionButton.Item
                    buttonColor="#FF0000"
                    onPress={() => this.props.onReject()}
                    {...this.props.ActionButtonItemProps}
                >
                    <FontAwesome5 name="times" color={"white"} size={25} />
                </ActionButton.Item>
            </ActionButton>
        );
    }
}
