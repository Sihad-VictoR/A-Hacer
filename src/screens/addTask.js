
import { Text, View, TextInput, StyleSheet, Button, Pressable, SafeAreaView, ToastAndroid } from 'react-native';
import Header from '../components/Header'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import { addTodo, updateTodo } from "../actions";
import { useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';

function AddTask({ route, navigation }) {
    const dispatch = useDispatch();
    let todo = route.params;
    const [assignees, setAssignees] = useState([]);
    const [isVisible, setVisible] = useState(false);
    const date = new Date();
    const [title, setTitle] = useState(todo ? todo.todo.title : "")
    const [chosenDate, setDate] = useState(todo ? todo.todo.dueDate : "Select Date");
    const [selectedAssignee, setSAssignee] = useState(todo ? todo.todo.assignee : "Select the Assignee...");
    const [fetched, setFetched] = useState(false);
    const [img, setImage] = useState('https://img.icons8.com/color/48/000000/cristiano-ronaldo.png');

    useEffect(() => {
        const ac = new AbortController();
        Promise.all([
            firestore().collection("assignees").onSnapshot(
                docs => {
                    let assignees = []
                    docs.forEach(doc => {
                        assignees.push(doc.data().name)
                    })
                    setAssignees(assignees);
                    console.log(assignees);
                }
            )
        ]).then(() => setFetched(true))
            .catch(ex => console.error(ex));
        return () => ac.abort();

    }, [])

    const onFocus = () => {
        console.log("text focused")
    }
    const hideDatePicker = (event, selectedDate) => {
        let currentDate = selectedDate || 'Select Date';
        if (currentDate != 'Select Date') {
            setDate(moment(currentDate).format('DD-MM-YYYY'))
        }
        setVisible(false);

        console.log(img)
    }
    const showDatePicker = () => {
        setVisible(true);
    }
    const setSelectedAssignee = (item) => {
        setSAssignee(item);
        if (item == 'Mr.Sachin') {
            setImage('https://img.icons8.com/color/48/000000/cristiano-ronaldo.png');
        } else if (item == "Mr.Rahul") {
            setImage('https://img.icons8.com/color/48/000000/barack-obama.png');
        } else if (item == 'Mr.John') {
            setImage('https://img.icons8.com/color/48/000000/bad-bunny.png');
        } else if (item == 'Ms.Dona Sarkar') {
            setImage('https://img.icons8.com/color/48/000000/dona-sarkar.png');
        }
    }


    const addTaskToDB = async () => {
        if ((selectedAssignee == "Select the Assignee...") || (title == '') || (chosenDate == "Select Date")) {
            alert('Please fill the Form!')
        } else {
            if (typeof todo == 'undefined') {
                firestore().collection('Todos').add({
                    title: title,
                    dueDate: chosenDate,
                    assignee: selectedAssignee,
                    done: false,
                    imgURL: img
                }).then(() => {

                    let addingTodo = {
                        title: title,
                        dueDate: chosenDate,
                        assignee: selectedAssignee,
                        done: false,
                        imgURL: img
                    }
                    dispatch(addTodo(addingTodo));
                    ToastAndroid.showWithGravity(
                        "Task Added Successfully!",
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER
                    );
                });
            } else {
                let addingTodo = {
                    title: title,
                    dueDate: chosenDate,
                    assignee: selectedAssignee,
                    done: false,
                    imgURL: img,
                }
                firestore()
                    .collection('Todos')
                    .doc(todo.todo.id)
                    .update({
                        title: title,
                        dueDate: chosenDate,
                        assignee: selectedAssignee,
                        done: false,
                        imgURL: img,
                    })
                    .then(() => {
                        console.log('User updated!');
                        dispatch(updateTodo(addingTodo));
                    });
            }


        }

    }

    return (
        <View style={styles.view}>
            <Header title="Create Task" />
            <SafeAreaView style={styles.safeView}>
                <View style={styles.single}>
                    <Text style={styles.name}>Title</Text>
                    <TextInput
                        style={styles.input}
                        onFocus={() => onFocus()}
                        onChangeText={data => setTitle(data)}
                        value={title}
                        placeholder="Task title..."
                    />
                </View>
                <View style={styles.single}>
                    <Text style={styles.name}>Assignee</Text>
                    <View style={styles.card}>
                        <Picker
                            selectedValue={selectedAssignee}
                            onValueChange={(itemValue, itemIndex) =>
                                setSelectedAssignee(itemValue)
                            }>
                            <Picker.Item label="Select the Assignee..." value="Select the Assignee..." />
                            {assignees.map((item, index) => {
                                return (<Picker.Item label={item} value={item} key={index} />)
                            })}
                        </Picker>
                    </View>
                </View>
                <View style={styles.single}>
                    <Text style={styles.name}>Due Date</Text>
                    <Pressable style={styles.button2} onPress={() => showDatePicker()}>
                        <Text style={styles.text2}>{chosenDate}</Text>
                    </Pressable>
                    {isVisible && (
                        <DateTimePicker
                            value={date}
                            mode='date'
                            is24Hour={true}
                            display="default"
                            onChange={hideDatePicker}
                        />
                    )}
                </View>
                <View style={styles.single}>
                    <Pressable style={styles.button} onPress={() => addTaskToDB()}>
                        <Text style={styles.text}>+ Add the Task</Text>
                    </Pressable>
                </View>
            </SafeAreaView>


        </View>
    );
}
const styles = StyleSheet.create({

    view: {
        backgroundColor: '#E8DDDD',
        flex: 3
    },
    safeView: {
        padding: 15,
    },
    single: {
        paddingTop: 10
    },
    input: {
        marginTop: 10,
        height: 45,
        backgroundColor: 'white',
        borderRadius: 4,
        paddingTop: 10
    },
    picker: {
        backgroundColor: 'white',
    },
    button: {
        paddingTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#850404',
    },
    button2: {
        marginTop: 8,
        paddingTop: 10,
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 4,
        backgroundColor: 'white',
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    text2: {
        fontSize: 16,
        lineHeight: 21,
        color: '#B9B9B9',
    },
    card: {
        width: 360,
        backgroundColor: "white",
        marginTop: 10,
        borderRadius: 4,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 20
    },
});
export default AddTask;