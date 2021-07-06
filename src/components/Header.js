import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

const Header = (props) => {
    //random url to get a image 
    //Header component
    return (
        <View style={styles.header}>
            <Text style={styles.text}>{props.title}</Text>
            <View style={styles.logo}>
                <Image
                    style={styles.tinyLogo}
                    source={{ uri: 'https://t4.ftcdn.net/jpg/02/45/56/35/360_F_245563558_XH9Pe5LJI2kr7VQuzQKAjAbz9PAyejG1.jpg' }}
                />
            </View>
        </View>
    );
};

Header.defaultProps = {
    title: "Todos"
};

const styles = StyleSheet.create({
    logo: {
        marginTop: -34,
        marginLeft: 300,
        backgroundColor: 'white',
        width: 50,
        height: 50,
        borderRadius: 1000,
        alignItems: 'center',
    },
    tinyLogo: {
        borderRadius: 1000,
        width: 50,
        height: 50,
    },
    header: {
        height: 80,
        backgroundColor: '#850404',
    },
    text: {
        color: '#fff',
        fontSize: 23,
        paddingTop: 20,
        paddingLeft: 20,
    }
});

export default Header;
