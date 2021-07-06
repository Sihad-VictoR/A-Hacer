export const TODOS_AVAILABLE = 'TODOS_AVAILABLE';
export const ADD_TODO = 'ADD_TODO';
export const UPDATE_TODO = 'UPDATE_TODO';
export const DELETE_TODO = 'DELETE_TODO';

// Get todos
export const getTodos = (todos) => ({
    type: TODOS_AVAILABLE,
    data: { todos }
});

// Add todo - CREATE (C)
export const addTodo = (todo) => ({
    type: ADD_TODO,
    data: { todo }
});

// Update todo - UPDATE (U)
export const updateTodo = (todo) => ({
    type: UPDATE_TODO,
    data: { todo }
});

// Delete todo - DELETE (D)
export const deleteTodo = (id) => ({
    type: DELETE_TODO,
    data: { id }
});
