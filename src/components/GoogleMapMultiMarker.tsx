import React from "react";
import { View, Modal, ActivityIndicator, StyleSheet, Dimensions, Platform } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import MarkerObject from "../SharedEntity/MarkerObject";
import ApiUrl from "../constants/ApiUrl";
import GlobalCache from "../Caches/GlobalCache";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

let { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 60; //Very high zoom level
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

interface iProps {
    coordinates?: Array<MarkerObject>;
}
interface iState {
    location?: MarkerObject;
}
export default class GoogleMapMultiMarker extends React.Component<iProps, iState> {
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

    render() {
        let coordinates = this.props.coordinates;
        return (
            <View style={styles.container}>
                <MapView
                    ref={map => {
                        //@ts-ignore
                        this.map = map;
                    }}
                    onMapReady={() => {
                        //if (this.props.coordinates.length > 0) {
                        //@ts-ignore
                        this.map.fitToElements(true);
                        //}
                    }}
                    //mapType={Platform.OS == "android" ? "none" : "standard"}
                    //@ts-ignore
                    //apikey={GOOGLE_MAPS_API_KEY}
                    showsUserLocation={true}
                    pitchEnabled={true}
                    provider={PROVIDER_GOOGLE}
                    style={styles.mapStyle}
                    //fillColor="red"
                    //strokeColor="black"
                    initialRegion={{
                        latitude: this.state.location.Latitude,
                        longitude: this.state.location.Longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421
                    }}
                >
                    {coordinates.map((marker: MarkerObject) => (
                        <Marker
                            key={marker.Id}
                            coordinate={{ latitude: marker.Latitude, longitude: marker.Longitude }}
                            title={marker.Name}
                            description={marker.Name}
                            pinColor="#ff0000"
                        ></Marker>
                    ))}
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
