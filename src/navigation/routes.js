import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './tabs';
import AddTask from '../screens/addTask'
import { Provider } from 'react-redux';
import store from '../store';

const Stack = createStackNavigator();
function MainScreen({ navigation }) {
    return (
        <Tabs />
    );
}

// Navigation using Navigation package React native
function MyStack(props) {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{
                    headerShown: false
                }}>
                    <Stack.Screen name="Home" component={MainScreen} />
                    <Stack.Screen name="AddTask" component={AddTask} />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}

export default MyStack;