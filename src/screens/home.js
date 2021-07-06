import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button, TouchableHighlight, Dimensions, Image, RefreshControl } from 'react-native';
import Header from '../components/Header';
import { withNavigation } from 'react-navigation';
import firestore from '@react-native-firebase/firestore';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useDispatch, useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { getTodos, deleteTodo, addDoneTodo } from "../actions";

const windowWidth = Dimensions.get("window").width;
export default function Home(props) {
    const dispatch = useDispatch();
    const { navigation } = props;

    const dataReducer = useSelector((state) => state.dataReducer);
    const { todos } = dataReducer;
    const [refreshing, setRefreshing] = useState(false);
    //refreshing the view
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            getData()
            setRefreshing(false)
        }, 2000);
    }, []);
    //getting data from db
    useEffect(() => getData(), []);
    const getData = () => {
        firestore()
            .collection('Todos').where('done', '==', false)
            .get()
            .then(querySnapshot => {
                console.log('Total Todos: ', querySnapshot.size);
                let todos = []
                querySnapshot.forEach(documentSnapshot => {
                    const data = documentSnapshot.data()

                    data.id = documentSnapshot.id
                    todos.push(data)
                });
                dispatch(getTodos(todos))
                console.log(todos);
            });
    };
    //deleting tasks
    const deleteTasks = (data) => {
        console.log(data.item.id)
        firestore()
            .collection('Todos')
            .doc(data.item.id)
            .delete()
            .then(() => {
                dispatch(deleteTodo(data.item.id))
                ToastAndroid.showWithGravity(
                    "Deleted Successfully!",
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                );
            });
    };
    //marking tasks done
    const markDoneTask = (data) => {
        console.log(data)
        onPostLike(data.item.id)
            .then(() => console.log('Done Marked via a transaction'))
            .catch(error => console.error(error));
        ;
    };
    
    //function to update in db
    function onPostLike(postId) {
        const postReference = firestore().doc(`Todos/${postId}`);

        return firestore().runTransaction(async transaction => {
            // Get post data first
            const postSnapshot = await transaction.get(postReference);

            if (!postSnapshot.exists) {
                ToastAndroid.showWithGravity(
                    "Refresh Page Before Marking Done!",
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                );
                throw 'Post does not exist!';
            }

            transaction.update(postReference, {
                done: true,
            });
        });
    }

    const updateTask = (data) => {
        navigation.navigate('AddTask', { todo: data.item })
    };

    let Image_Http_URL = { uri: 'https://img.icons8.com/color/48/000000/cristiano-ronaldo.png' };
    return (
        <View style={styles.view}>
            <Header />
            <SwipeListView
                data={todos}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
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
                        <Text style={{ fontSize: 14, color: 'white', marginLeft: 15 }}
                            onPress={() => updateTask(data)}>Edit</Text>
                        <Text style={{ fontSize: 14, color: 'white', marginLeft: 190 }}
                            onPress={() => markDoneTask(data)}>Mark As Done</Text>

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
