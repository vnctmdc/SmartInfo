import React from "react";
import { View, Text, Alert } from "react-native";
import { inject, observer } from "mobx-react";
import SMX from "../constants/SMX";
import GlobalStore from "../Stores/GlobalStore";
import { ExceptionType } from "../SharedEntity/SMXException";
import SMAlert from "./SMAlert";
import { reload } from "../Screens/NavigationService";

interface iProps {
    GlobalStore?: GlobalStore;
}

interface iState {}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class ErrorHandler extends React.Component<iProps, iState> {
    handlerPostFailed(msg?: string) {
        setTimeout(() => {
            alert(msg);
        }, 100);
        return <View></View>;
    }

    handlerGetFailed(msg?: string) {
        return (
            <SMAlert
                Title={"Có lỗi xảy ra"}
                Message={msg}
                okClick={() => {
                    reload();
                }}
                Show={true}
            />
        );
    }

    handlerBadRequest(msg?: string) {
        setTimeout(() => {
            alert(msg);
        }, 100);
        return <View></View>;
    }

    handlerNotAcceptable(msg?: string) {
        setTimeout(() => {
            alert(msg);
        }, 100);
        return <View></View>;
    }

    render() {
        const ex = this.props.GlobalStore!.Exception;

        if (ex) {
            let msg = ex?.Message;
            let type = ex.Type;

            switch (type) {
                case ExceptionType.PostFailed:
                    return this.handlerPostFailed(msg);

                case ExceptionType.GetFailed:
                    return this.handlerGetFailed(msg);

                case ExceptionType.BadRequest:
                    return this.handlerBadRequest(msg);

                case ExceptionType.NotAcceptable:
                    return this.handlerNotAcceptable(msg);
            }
        }

        return <></>;
    }
}
