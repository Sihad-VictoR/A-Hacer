import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import HomeScreen from '../screens/home';
import DoneTasksScreen from '../screens/doneTasks';
import auth from '@react-native-firebase/auth';
import { View, StyleSheet, Button, Alert } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();
function LogOutScreen({ navigation }) {
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', e => {
            // Prevent default behavior
            e.preventDefault();
        });

        return unsubscribe;
    }, [navigation]);

    return null;
}
const Tabs = () => {
    return (
        <Tab.Navigator keyboardShouldPersistTaps='handled' tabBarOptions={{
            activeTintColor: '#850404',
            labelStyle: { textTransform: "none", fontSize: 15 },
            style: { height: 70 },
        }} >
            <Tab.Screen name="Home" component={HomeScreen} options={{
                tabBarLabel: 'Todo',
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="format-list-bulleted-square" color={color} size={size} />
                ),
            }} />
            <Tab.Screen name="Done Tasks" component={DoneTasksScreen} options={{
                tabBarLabel: 'Done',
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="clipboard-check" color={color} size={size} />
                ),
            }} />

            <Tab.Screen name="LogOut" component={LogOutScreen} listeners={{
                tabPress: e => {
                    // Prevent default action
                    e.preventDefault();
                    // Shows up the alert without redirecting anywhere
                    Alert.alert(
                        'Confirmation required'
                        , 'Do you really want to logout?'
                        , [
                            {
                                text: 'Accept', onPress: () => {
                                    auth()
                                        .signOut()
                                        .then(() => console.log('User signed out!'));
                                }
                            },
                            { text: 'Cancel' }
                        ]
                    );;
                },
            }} options={{
                tabBarLabel: 'Logout',
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="logout" color={color} size={size} />
                ),
            }} />
        </Tab.Navigator>
    );
}

export default Tabs;