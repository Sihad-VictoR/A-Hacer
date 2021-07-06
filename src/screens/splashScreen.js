import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, ToastAndroid, TextInput, Alert, Modal } from 'react-native';
import { useTheme } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

GoogleSignin.configure({
    webClientId: '381963610555-pg10d0qvko495g021k0ff2siifd5tcqf.apps.googleusercontent.com',
});

const SplashScreen = () => {
    const { colors } = useTheme();
    const [data, setData] = React.useState({
        email: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
        regEmail: '',
        regPassword: '',
        regConfirm_password: '',
        regCheck_textInputChange: false,
        regSecureTextEntry: true,
        regConfirm_secureTextEntry: true,
    });
    const textInputChange = (val) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (val.trim().length >= 4 && reg.test(val)) {
            setData({
                ...data,
                email: val,
                check_textInputChange: true,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                email: val,
                check_textInputChange: false,
                isValidUser: false
            });
        }
    }

    const handlePasswordChange = (val) => {
        if (val.trim().length >= 7) {
            setData({
                ...data,
                password: val,
                isValidPassword: true
            });
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false
            });
        }
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const handleValidUser = (val) => {
        if ((val.trim().length >= 4) && val.includes('@') && (val.includes('.')) && (val.includes('@')) && !val.includes('@.') && !val.includes('.@')) {
            setData({
                ...data,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                isValidUser: false
            });
        }
    }

    const loginHandle = () => {
        if (data.email.length <= 4 || data.email.includes('@.') || data.email.includes('.@') || !data.email.includes('.') || !data.email.includes('@')) {
            Alert.alert('Wrong Input!', 'Invalid Email!', [
                { text: 'Okay' }
            ]);
            return;
        }
        if (data.password.length < 7) {
            Alert.alert('Wrong Input!', 'Weak! Passwords should atleast be 7 characters', [
                { text: 'Okay' }
            ]);
            return;
        }

        auth()
            .signInWithEmailAndPassword(data.email, data.password)
            .then(() => {
                console.log('User sign in Successful!!');
                ToastAndroid.showWithGravity(
                    "User sign in Successful!",
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                );
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    console.log('That email address is already in use!');
                }

                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                }
                ToastAndroid.showWithGravity(
                    "Unable to Login!",
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                );
            });

        console.log(data.email)
        console.log(data.password)

    }
    async function onGoogleButtonPress() {
        // Get the users ID token
        const { idToken } = await GoogleSignin.signIn();

        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

        // Sign-in the user with the credential
        return auth().signInWithCredential(googleCredential);
    }
    async function onFacebookButtonPress() {
        // Attempt login with permissions
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

        if (result.isCancelled) {
            throw 'User cancelled the login process';
        }

        // Once signed in, get the users AccesToken
        const data = await AccessToken.getCurrentAccessToken();

        if (!data) {
            throw 'Something went wrong obtaining access token';
        }

        // Create a Firebase credential with the AccessToken
        const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

        // Sign-in the user with the credential
        return auth().signInWithCredential(facebookCredential);
    }
    const textInputChangeReg = (val) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if ((val.length !== 0) && reg.test(val)) {
            setData({
                ...data,
                regEmail: val,
                regCheck_textInputChange: true
            });
        } else {
            setData({
                ...data,
                regEmail: val,
                regCheck_textInputChange: false
            });
        }
    }
    const handlePasswordChangeReg = (val) => {
        setData({
            ...data,
            regPassword: val
        });
    }

    const handleConfirmPasswordChangeReg = (val) => {
        setData({
            ...data,
            regConfirm_password: val
        });
    }

    const updateSecureTextEntryReg = () => {
        setData({
            ...data,
            regSecureTextEntry: !data.regSecureTextEntry
        });
    }

    const updateConfirmSecureTextEntryReg = () => {
        setData({
            ...data,
            regConfirm_secureTextEntry: !data.regConfirm_secureTextEntry
        });
    }

    const registerUser = () => {
        if (data.regPassword.length < 7 || data.regConfirm_password.length < 7) {
            Alert.alert('Wrong Input!', 'Weak! Passwords should atleast be 7 characters', [
                { text: 'Okay' }
            ]);
            return;
        }
        if (data.regEmail.length <= 4 || data.regEmail.includes('@.') || data.regEmail.includes('.@')) {
            Alert.alert('Wrong Input!', 'Invalid Email!', [
                { text: 'Okay' }
            ]);
            return;
        }
        if (data.regPassword !== data.regConfirm_password) {
            Alert.alert('Wrong Input!', 'Confirm Correct Password', [
                { text: 'Okay' }
            ]);
            return;
        }
        auth()
            .createUserWithEmailAndPassword(data.regEmail, data.regPassword)
            .then(() => {
                console.log('User account created & signed in!');
                ToastAndroid.showWithGravity(
                    "User account created & signed in!",
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                );
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    console.log('That email address is already in use!');
                }

                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                }
                ToastAndroid.showWithGravity(
                    "Unable to Register.",
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                );
            });
    }
    const [modalVisible, setModalVisible] = React.useState(false);
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#850404' barStyle="light-content" />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.text_footer}>Email Address</Text>
                        <View style={styles.action}>
                            <FontAwesome
                                name="user-o"
                                color="#05375a"
                                size={20}
                            />
                            <TextInput
                                placeholder="Your Email"
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => textInputChangeReg(val)}
                            />
                            {data.regCheck_textInputChange ?
                                <Animatable.View
                                    animation="bounceIn"
                                >
                                    <Feather
                                        name="check-circle"
                                        color="green"
                                        size={20}
                                    />
                                </Animatable.View>
                                : null}
                        </View>

                        <Text style={[styles.text_footer, {
                            marginTop: 35
                        }]}>Password</Text>
                        <View style={styles.action}>
                            <Feather
                                name="lock"
                                color="#05375a"
                                size={20}
                            />
                            <TextInput
                                placeholder="Your Password"
                                secureTextEntry={data.regSecureTextEntry ? true : false}
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => handlePasswordChangeReg(val)}
                            />
                            <TouchableOpacity
                                onPress={updateSecureTextEntryReg}
                            >
                                {data.regSecureTextEntry ?
                                    <Feather
                                        name="eye-off"
                                        color="grey"
                                        size={20}
                                    />
                                    :
                                    <Feather
                                        name="eye"
                                        color="grey"
                                        size={20}
                                    />
                                }
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.text_footer, {
                            marginTop: 35
                        }]}>Confirm Password</Text>
                        <View style={styles.action}>
                            <Feather
                                name="lock"
                                color="#05375a"
                                size={20}
                            />
                            <TextInput
                                placeholder="Confirm Your Password"
                                secureTextEntry={data.regConfirm_secureTextEntry ? true : false}
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => handleConfirmPasswordChangeReg(val)}
                            />
                            <TouchableOpacity
                                onPress={updateConfirmSecureTextEntryReg}
                            >
                                {data.regSecureTextEntry ?
                                    <Feather
                                        name="eye-off"
                                        color="grey"
                                        size={20}
                                    />
                                    :
                                    <Feather
                                        name="eye"
                                        color="grey"
                                        size={20}
                                    />
                                }
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => registerUser()}
                        >
                            <Text style={styles.textStyle}>Register User</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button]}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.textStyle}>X</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <View style={styles.header}>
                <Animatable.Image
                    animation="bounceIn"
                    duraton="1500"
                    source={require('../../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="stretch"
                />
            </View>
            <Animatable.View
                style={[styles.footer, {
                    backgroundColor: colors.background
                }]}
                animation="fadeInUpBig"
            >
                <Text style={styles.text}>Sign in with account</Text>
                <Text style={[styles.text_footer, {
                    color: colors.text
                }]}>Email Address</Text>
                <View style={styles.action}>
                    <FontAwesome
                        name="user-o"
                        color={colors.text}
                        size={20}
                    />
                    <TextInput
                        placeholder="Your Email"
                        placeholderTextColor="#666666"
                        style={[styles.textInput, {
                            color: colors.text
                        }]}
                        autoCapitalize="none"
                        onChangeText={(val) => textInputChange(val)}
                        onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
                    />
                </View>
                {data.isValidUser ? null :
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Enter valid Email Address</Text>
                    </Animatable.View>
                }


                <Text style={[styles.text_footer, {
                    color: colors.text,
                    marginTop: 35
                }]}>Password</Text>
                <View style={styles.action}>
                    <Feather
                        name="lock"
                        color={colors.text}
                        size={20}
                    />
                    <TextInput
                        placeholder="Your Password"
                        placeholderTextColor="#666666"
                        secureTextEntry={data.secureTextEntry ? true : false}
                        style={[styles.textInput, {
                            color: colors.text
                        }]}
                        autoCapitalize="none"
                        onChangeText={(val) => handlePasswordChange(val)}
                    />
                    <TouchableOpacity
                        onPress={updateSecureTextEntry}
                    >
                        {data.secureTextEntry ?
                            <Feather
                                name="eye-off"
                                color="grey"
                                size={20}
                            />
                            :
                            <Feather
                                name="eye"
                                color="grey"
                                size={20}
                            />
                        }
                    </TouchableOpacity>
                </View>
                {data.isValidPassword ? null :
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Password cannot be less than 7.</Text>
                    </Animatable.View>
                }
                <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => { loginHandle() }}
                >
                    <LinearGradient
                        colors={['#08d4c4', '#01ab9d']}
                        style={styles.signIn}
                    >
                        <Text style={[styles.textSign, {
                            color: '#fff'
                        }]}>Sign In</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => setModalVisible(true)}
                >

                    <Text style={[styles.textSign, {
                        color: 'black'
                    }]}>Register</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => { onGoogleButtonPress() }}
                >

                    <Text style={[styles.textSign, {
                        color: 'black'
                    }]}>Sign in with Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => { onFacebookButtonPress() }}
                >

                    <Text style={[styles.textSign, {
                        color: 'black'
                    }]}>Sign in with Facebook</Text>
                </TouchableOpacity>

            </Animatable.View>
        </View>
    );
};

export default SplashScreen;

const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#850404'
    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30
    },
    logo: {
        width: height_logo,
        height: height_logo
    },
    title: {
        color: '#05375a',
        fontSize: 30,
        fontWeight: 'bold'
    },
    text: {
        color: 'grey',
        marginTop: 5
    },
    button: {
        alignItems: 'flex-end',
        marginTop: 30
    },
    signIn: {
        width: 150,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        flexDirection: 'row'
    },
    textSign: {
        color: 'white',
        fontWeight: 'bold'
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "stretch",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: 400,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});