import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';

import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import SplashScreen from './src/screens/splashScreen';

import Routes from './src/navigation/routes';
import PushController from './src/pushController'

GoogleSignin.configure({
  webClientId: '381963610555-pg10d0qvko495g021k0ff2siifd5tcqf.apps.googleusercontent.com',
});


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

function LoginApp() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    if (user !== null) {
      Alert.alert("Logged in as " + user.email)
    }
    setUser(user);
    if (initializing) setInitializing(false);

  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <View style={styles.container}>
        <SplashScreen />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Routes />
    </View>
  );
}


class App extends Component {
  render() {

    return (
      <View style={styles.container}>
        <LoginApp />
        <PushController />
      </View>
    );
  }
}


export default App;
