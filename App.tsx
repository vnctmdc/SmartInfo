import "react-native-gesture-handler";

import React, { useState } from "react";
import AppContainer from "./src/Screens/router";
import { MobXProviderContext } from "mobx-react";
import {
    setJSExceptionHandler,
    //setNativeExceptionHandler,
} from "react-native-exception-handler";
import * as Device from "expo-device";

import { GlobalDto } from "./src/DtoParams/GlobalDto";
import LogManager from "./src/Utils/LogManager";
import GlobalStore from "./src/Stores/GlobalStore";
import ErrorHandler from "./src/components/ErrorHandler";
import LoadingModal from "./src/components/LoadingModal";

console.disableYellowBox = true;

const handleError = async (error, isFatal) => {
    if (error) {
        try {
            let content = error.message + ": " + JSON.stringify(error.stack);
            let request = new GlobalDto();
            request.DeviceInfo = Device.brand + " " + Device.modelName;
            request.ExceptionInfo = content;

            LogManager.Log(request);
        }
        catch (e) {
            console.log(e);
        }
    }
};

setJSExceptionHandler((error, isFatal) => {
    //console.log("setJSExceptionHandler");
    handleError(error, isFatal);
}, true);

// setNativeExceptionHandler(errorString => {
//   //console.log("setNativeExceptionHandler");
//   handleError(errorString, true);
// });

export function Provider({ children, ...propsValue }) {
    const contextValue = React.useContext(MobXProviderContext);
    const [value] = React.useState(() => ({
        ...contextValue,
        ...propsValue,
    }));

    // if (process.env.NODE_ENV !== "production") {
    //     const newValue = { ...value, ...propsValue } // spread in previous value for the context based stores
    //     if (!shallowEqual(value, newValue)) {
    //         throw new Error(
    //             "MobX Provider: The set of provided stores has changed. Please avoid changing stores as the change might not propagate to all children"
    //         )
    //     }
    // }

    return <MobXProviderContext.Provider value={value}>{children}</MobXProviderContext.Provider>;
}

export default function App() {
    return (
        <Provider GlobalStore={new GlobalStore()}>
            <AppContainer />
            <ErrorHandler />
            <LoadingModal Loading={false} />
        </Provider>
    );
}
