import React from "react";
import { View, Modal, ActivityIndicator, StyleSheet, Text, Platform, Dimensions } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import MarkerObject from "../SharedEntity/MarkerObject";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import ApiUrl from "../constants/ApiUrl";
import GlobalCache from "../Caches/GlobalCache";

const { width, height } = Dimensions.get("window");

interface iProps {
    location?: MarkerObject;
    parentCallback?: (me: any) => void;
    enableScroll?: boolean;
}
interface iState {
    location?: MarkerObject;
}

export default class GoogleMapSingleMarker extends React.Component<iProps, iState> {
    constructor(props: iProps) {
        super(props);
        this.state = {
            location: new MarkerObject(1, 21.0245, 105.84117, "Default")
        };
    }

    async componentDidMount() {
        await this.getLocationAsync();
    }

    async getLocationAsync() {
        let statusAfter: any = null;
        let { status } = await Permissions.getAsync(Permissions.LOCATION);
        if (status !== "granted") {
            statusAfter = (await Permissions.askAsync(Permissions.LOCATION)).status;
            if (statusAfter !== "granted") {
                return;
            }
        }

        let location = await Location.getCurrentPositionAsync({});
        this.setState({
            location: new MarkerObject(1, location.coords.latitude, location.coords.longitude, "Vị trí của tôi")
        });
    }

    SetMyCoordinate(me: any) {
        const { latitude, longitude } = me.nativeEvent.coordinate;
        let marker = new MarkerObject(1, latitude, longitude, "Me");
        this.SendToParent(marker);
    }

    SendToParent = me => {
        this.props.parentCallback(me);
    };

    render() {
        //console.log(location);
        return (
            <View style={styles.container}>
                <MapView
                    ref={map => {
                        //@ts-ignore
                        this.map = map;
                    }}
                    // onMapReady={() =>
                    //     //@ts-ignore
                    //     this.map.fitToElements(true)
                    // }
                    //@ts-ignore
                    //apikey={GOOGLE_MAPS_API_KEY}
                    //mapType={Platform.OS == "android" ? "none" : "standard"}
                    showsUserLocation={true}
                    pitchEnabled={true}
                    provider={PROVIDER_GOOGLE}
                    style={styles.mapStyle}
                    //fillColor="red"
                    //strokeColor="black"
                    scrollEnabled={this.props.enableScroll}
                    initialRegion={{
                        latitude: this.props.location != null ? this.props.location.Latitude : this.state.location.Latitude,
                        longitude: this.props.location != null ? this.props.location.Longitude : this.state.location.Longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421
                    }}
                >
                    {this.props.location != null ? (
                        <Marker
                            draggable
                            coordinate={{
                                latitude: this.props.location.Latitude,
                                longitude: this.props.location.Longitude
                            }}
                            title={"Marker"}
                            description={"Vị trí tài sản"}
                            pinColor="#ff0000"
                            onDragEnd={e => this.SetMyCoordinate(e)}
                        ></Marker>
                    ) : (
                        undefined
                    )}
                </MapView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {        
        flex: 1,
        //backgroundColor: "#fff",       
        alignItems: "center",
        justifyContent: "center"
    },
    mapStyle: {
        width: width,
        height: height
    }
});
