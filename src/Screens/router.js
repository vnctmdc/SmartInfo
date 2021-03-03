import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import { NavigationContainer, CommonActions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createSwitchNavigator } from "@react-navigation/compat";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Octicons from "react-native-vector-icons/Octicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { setTopLevelNavigator } from "./NavigationService";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { DrawerItem, DrawerContentScrollView, createDrawerNavigator } from "@react-navigation/drawer";

import GoBack from "../components/GoBack";
// Shared
import Welcome from "./shared/Welcome";
import SrcLogin from "./shared/Login";
import SrcLogout from "./shared/Logout";
import Home from "./Home";

import AuthenticationService from "../Utils/AuthenticationService";
import Error from "./shared/Error";

import TinTucScreen from "../Screens/TinTuc/TinTuc";
import TinTucDetailScreen from "../Screens/TinTuc/TinTucDetail";

import SuVuScreen from "../Screens/SuVu/SuVu";
import CoQuanBaoTriScreen from "../Screens/CoQuanBaoTri/CoQuanBaoTri";
import ThongBaoScreen from "../Screens/ThongBao/ThongBao";
import DetailNegativeNews from "../Screens/SuVu/Display";
import CoQuanBaoTriDetailScreen from "../Screens/CoQuanBaoTri/CoQuanBaoTriDetail";
import ThongTinNhanSuScreen from "../Screens/CoQuanBaoTri/ThongTinNhanSu";
import DetailDisplayNegativeNews from "../Screens/SuVu/DetailDisplay";
import NotificationDisplay from "../Screens/ThongBao/Display";
import UploadOrtherImage from "../Screens/CoQuanBaoTri/UploadOrtherImage";

// ? Default title style
const defaultTitleStyle = {
    headerStyle: {
        backgroundColor: "#2EA8EE",
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
        fontWeight: "bold",
    },
    headerBackTitle: "",
};

const HomeStack = createStackNavigator();
function HomeContainer() {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen
                name="Home"
                component={Home}
                options={({ navigation, route }) => ({
                    title: "Trang chủ",
                    ...defaultTitleStyle,
                    headerShown: false,
                    headerLeft: (props) => (
                        <View style={{ flexDirection: "row" }}>
                            <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => navigation.openDrawer()}>
                                <FontAwesome5 name="bars" size={size} />
                            </TouchableOpacity>
                        </View>
                    ),
                })}
            />

            <HomeStack.Screen
                name="DetailNegativeNews"
                component={DetailNegativeNews}
                options={{ headerShown: false, title: "Display", ...defaultTitleStyle }}
            />

            <HomeStack.Screen name="TinTucDetail" component={TinTucDetailScreen} options={{ headerShown: false }} />
        </HomeStack.Navigator>
    );
}

const TinTucStack = createStackNavigator();
function TinTucs() {
    return (
        <TinTucStack.Navigator>
            <TinTucStack.Screen name="TinTuc" component={TinTucScreen} options={{ headerShown: false }} />
            <TinTucStack.Screen name="TinTucDetail" component={TinTucDetailScreen} options={{ headerShown: false }} />
        </TinTucStack.Navigator>
    );
}

const CoQuanBaoTriStack = createStackNavigator();
function CoQuanBaoTris() {
    return (
        <CoQuanBaoTriStack.Navigator>
            <CoQuanBaoTriStack.Screen
                name="CoQuanBaoTri"
                component={CoQuanBaoTriScreen}
                options={{ headerShown: false }}
            />
            <CoQuanBaoTriStack.Screen
                name="CoQuanBaoTriDetail"
                component={CoQuanBaoTriDetailScreen}
                options={{ headerShown: false }}
            />
            <CoQuanBaoTriStack.Screen
                name="ThongTinNhanSu"
                component={ThongTinNhanSuScreen}
                options={{ headerShown: false }}
            />
            <CoQuanBaoTriStack.Screen
                name="UploadOrtherImage"
                component={UploadOrtherImage}
                options={{ headerShown: false }}
            />
        </CoQuanBaoTriStack.Navigator>
    );
}

const Tab = createBottomTabNavigator();
function Tabs() {
    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: "#4764DF",
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeContainer}
                options={{
                    tabBarLabel: "SmartInfo",
                    tabBarIcon: ({ color, size }) => <FontAwesome5 name="home" color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Suvu"
                component={NeGativeNewsDisplay}
                options={{
                    tabBarLabel: "Sự vụ",
                    tabBarIcon: ({ color, size }) => <FontAwesome5 name="satellite-dish" color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="TinTuc"
                component={TinTucs}
                options={{
                    tabBarLabel: "Tin tức",
                    tabBarIcon: ({ color, size }) => <FontAwesome name="file-text-o" color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="CoQuanBaoTri"
                component={CoQuanBaoTris}
                options={{
                    tabBarLabel: "Tổ chức",
                    tabBarIcon: ({ color, size }) => <FontAwesome5 name="user-friends" color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="ThongBao"
                component={DetailNotification}
                options={{
                    tabBarLabel: "Reminder",
                    tabBarIcon: ({ color, size }) => <FontAwesome5 name="bell" color={color} size={size} />,
                }}
            />
        </Tab.Navigator>
    );
}

const Notification = createStackNavigator();
function DetailNotification() {
    return (
        <Notification.Navigator initialRouteName="ThongBao">
            <Notification.Screen
                name="ThongBao"
                component={ThongBaoScreen}
                options={{ headerShown: false, title: "Default", ...defaultTitleStyle }}
            />
            <Notification.Screen
                name="DetailNotification"
                component={NotificationDisplay}
                options={{ headerShown: false, title: "Display", ...defaultTitleStyle }}
            />
        </Notification.Navigator>
    );
}

const NegativeNews = createStackNavigator();
function NeGativeNewsDisplay() {
    return (
        <NegativeNews.Navigator initialRouteName="SuVu">
            <NegativeNews.Screen
                name="SuVu"
                component={SuVuScreen}
                options={{ headerShown: false, title: "Default", ...defaultTitleStyle }}
            />

            <NegativeNews.Screen
                name="DetailNegativeNews"
                component={DetailNegativeNews}
                options={{ headerShown: false, title: "Display", ...defaultTitleStyle }}
            />

            <NegativeNews.Screen
                name="DetailDisplayNegativeNews"
                component={DetailDisplayNegativeNews}
                options={{ headerShown: false, title: "Display", ...defaultTitleStyle }}
            />
        </NegativeNews.Navigator>
    );
}

const Stack = createStackNavigator();
function AppContainer() {
    return (
        <NavigationContainer ref={(navigationRef) => setTopLevelNavigator(navigationRef)}>
            <Stack.Navigator initialRouteName="Welcome">
                <Stack.Screen name="SwitchStack" component={SwitchStack} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const SwitchStack = createSwitchNavigator(
    {
        Welcome: Welcome,
        SrcLogin: SrcLogin,
        Tabs: Tabs,
        SrcError: Error,
    },
    {
        initialRouteName: "Welcome",
    }
);

export default AppContainer;
