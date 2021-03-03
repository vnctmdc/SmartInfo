import * as React from "react";

export interface AppContextInterface {
    name: string;
    code: string;
}

const ctxt = React.createContext<AppContextInterface | null>(null);

export const AppContextProvider = ctxt.Provider;

export const AppContextConsumer = ctxt.Consumer;

export function withAppContext(Component) {
    // ...and returns another component...
    return function ComponentBoundWithAppContext(props) {
        // ... and renders the wrapped component with the current context!
        // Notice that we pass through any additional props as well
        return (
            <AppContextConsumer>
                {appContext => <Component {...props} appContext={appContext} />}
            </AppContextConsumer>
        );
    };
}