import { combineReducers } from 'redux';

import { TODOS_AVAILABLE, ADD_TODO, UPDATE_TODO, DELETE_TODO } from "./actions"
//Importing the actions types constant  defined in  actions

let dataState = { todos: [] };

const dataReducer = (state = dataState, action) => {
    switch (action.type) {
        case ADD_TODO:
            let { todo } = action.data;

            //cloning the current state
            let clone = JSON.parse(JSON.stringify(state.todos));

            clone.unshift(todo); //adding the new todo to the top

            return { ...state, todos: clone };

        case TODOS_AVAILABLE:
            let { todos } = action.data;

            return { ...state, todos };

        case UPDATE_TODO: {
            let { todo } = action.data;

            //cloning the current state
            let clone = JSON.parse(JSON.stringify(state.todos));

            //checking if bookmark already exist
            const index = clone.findIndex((obj) => obj.id === todo.id);

            //if the todo is in the array, updating the todo
            if (index !== -1) clone[index] = todo;

            return { ...state, todos: clone };
        }

        case DELETE_TODO: {
            let { id } = action.data;

            //cloning the current state
            let clone = JSON.parse(JSON.stringify(state.todos));

            //checking if todo already exist
            const index = clone.findIndex((obj) => obj.id === id);

            //if the todo is in the array, removing the todo
            if (index !== -1) clone.splice(index, 1);

            return { ...state, todos: clone };
        }

        default:
            return state;
    }
};

// Combine all the reducers
const rootReducer = combineReducers({ dataReducer });

export default rootReducer;