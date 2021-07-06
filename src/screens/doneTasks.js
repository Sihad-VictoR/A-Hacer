import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button, TouchableHighlight, Dimensions, Image, RefreshControl } from 'react-native';
import Header from '../components/Header';
import { withNavigation } from 'react-navigation';
import firestore from '@react-native-firebase/firestore';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useDispatch, useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { addDoneTodo, deleteDoneTodo, getDoneTodos } from "../actions";

const windowWidth = Dimensions.get("window").width;
export default function DoneTasks(props) {
    const dispatch = useDispatch();
    const { navigation } = props;

    const [donetodos, setDoneTodos] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            getData()
            setRefreshing(false)
        }, 2000);
    }, []);

    useEffect(() => getData(), []);
    const getData = () => {
        firestore()
            .collection('Todos').where('done', '==', true)
            .get()
            .then(querySnapshot => {
                console.log('Total Todos: ', querySnapshot.size);
                let donetodos = []
                querySnapshot.forEach(documentSnapshot => {
                    const data = documentSnapshot.data()

                    // adding new property id with id from Firestore
                    data.id = documentSnapshot.id
                    donetodos.push(data)
                });
                setDoneTodos(donetodos);
                console.log(donetodos);
            });
    };
    const deleteTasks = (data) => {
        for (var i = 0; i < donetodos.length; i++) {

            if (donetodos[i].id === data.item.id) {
                donetodos.splice(i, 1);
                firestore()
                    .collection('Todos')
                    .doc(data.item.id)
                    .delete().then(() => {
                        ToastAndroid.showWithGravity(
                            "Deleted Successfully!",
                            ToastAndroid.SHORT,
                            ToastAndroid.CENTER
                        );
                        onRefresh()
                    });
                ;
            }
        }
        console.log(data)

    };

    return (
        <View style={styles.view}>
            <Header title="Done Todos" />
            <SwipeListView
                data={donetodos}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                disableLeftSwipe={true}
                renderItem={(data, rowMap) => (
                    <View style={styles.rowFront}>
                        <Text style={{ fontSize: 21, color: 'black', paddingLeft: 10, paddingTop: 5, fontWeight: 'bold' }}>{data.item.title}</Text>
                        <View style={styles.rowDown}>
                            <MaterialCommunityIcons name="calendar" color="#827D7D" size={27} />
                            <Text style={{ fontSize: 18, color: 'black' }}>{data.item.dueDate}</Text>
                            <View style={styles.logo}>
                                <Image
                                    style={styles.tinyLogo}
                                    source={{ uri: data.item.imgURL }}
                                />
                            </View>

                        </View>
                    </View>
                )}
                renderHiddenItem={(data, rowMap) => (
                    <View style={styles.rowBack}>
                        <Text style={{ fontSize: 14, color: 'white' }} onPress={() => deleteTasks(data)}>Delete</Text>
                    </View>

                )}
                leftOpenValue={105}
                rightOpenValue={-115}
            />
            <Text style={styles.refreshText}>Pull down to Refresh!</Text>
            <TouchableHighlight style={styles.floatingButton}
                underlayColor='#ff7043'
                onPress={() => navigation.navigate('AddTask')}>
                <Text style={{ fontSize: 25, color: 'white' }}>+</Text>
            </TouchableHighlight>
        </View>
    );
}
const styles = StyleSheet.create({
    refreshText: {
        position: 'absolute',
        bottom: 14,
        left: 4,
        fontStyle: 'italic',
    },
    logo: {
        marginTop: -10,
        marginLeft: 200,
    },
    tinyLogo: {
        width: 40,
        height: 40,
    },
    rowDown: {
        flexDirection: 'row',
        padding: 10,
    },
    rowFront: {
        backgroundColor: '#FFF',
        borderRadius: 5,
        height: 80,
        margin: 5,
        marginBottom: 15,
        shadowColor: '#999',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#850404',
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
        margin: 5,
        marginBottom: 15,
        borderRadius: 5,
    },
    floatingButton: {
        backgroundColor: '#850404',
        borderColor: '#6B9EFA',
        height: 55,
        width: 55,
        borderRadius: 55 / 2,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 10,
        right: 15,
        shadowColor: "#000000",
        shadowOpacity: 0.5,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 0
        }
    },
    view: {
        backgroundColor: '#E8DDDD',
        flex: 3
    },
});