import * as React from "react";
import { CommonActions, useNavigationState, StackActions } from "@react-navigation/native";

function JumToErrorPage(msg: string) {
    _navigator.dispatch(
        CommonActions.navigate({
            name: "SrcError",
            params: {
                Message: msg,
            },
        })
    );
}

let _navigator;

function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef;
}

function getCurrentRouteName(navState: any) {
    if (navState !== undefined && Array.isArray(navState.routes) && navState.routes.length > 0) {
        if (navState.routes[navState.index].state !== undefined)
            return getCurrentRouteName(navState.routes[navState.index].state);
        else return navState.routes[navState.index].name;
    }
    return "";
}

function reload() {
    let currentName = getCurrentRouteName(_navigator.getRootState().routes[0].state);
    _navigator.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [
                {
                    name: currentName,
                    params: { ...this.params },
                },
            ],
        })
    );
}

function navigate(routeName, params) {
    _navigator.dispatch(
        CommonActions.navigate({
            name: routeName,
            params,
        })
    );
}

// add other navigation functions that you need and export them

export { navigate, setTopLevelNavigator, JumToErrorPage, reload };
