
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { accountSlice } from "../../features/account/accountSlice";
import { basketSlice } from "../../features/basket/basketSlice";
import { catalogSlice } from "../../features/catalog/catalogSlice";
import { counterSlice } from "../../features/contact/counterSlice";


// This one is for Redux Toolkit
export const store = configureStore({
    reducer: {
        counter: counterSlice.reducer,
        basket: basketSlice.reducer,
        catalog: catalogSlice.reducer,
        account: accountSlice.reducer
    }
})

// I just want the type of thing that this return, and I gonna store it in this type variable caled RootState
export type RootState = ReturnType<typeof store.getState>;

// There are just types to make it easier for me to use... 
export type AppDispatch = typeof store.dispatch;


// Let's create couple custom hooks

// Instead of using 'useDispatch' that I get from ReactRedux, I'm going to use my own custom hook, 
// which is already typed to 'AppDispatch' which is of type of store.Dispatch.
export const useAppDispatch = () => useDispatch<AppDispatch>();

// I'm going to do the same for the appSelector.
// So instead of using 'useSelector' that I get from ReactRedux, I'm creating my own useAppSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;