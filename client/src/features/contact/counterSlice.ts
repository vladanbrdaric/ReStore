import { createSlice } from "@reduxjs/toolkit";

export interface CounterState {
    data: number;
    title: string;
}


// This initialState is an object of type 'CounterState'
const initialState: CounterState = {
    data: 42,
    title: 'YARC (yet another tedux counter with redux toolkit)'
}

// I'm exporting this function. createSlice comes from redux toolkit
export const counterSlice = createSlice({
    // sliceName is 'counter'
    name: 'counter',
    // initialState is this object above,
    initialState,
    // reducers are going to be increment and decrement
    reducers: {
        increment: (state, action) => {
            state.data += action.payload
        },
        decrement: (state, action) => {
            state.data -= action.payload
        }
    }

})


// export those two functions which are actions.
export const {increment, decrement} = counterSlice.actions;