import { Cookie } from "@mui/icons-material";
import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { buildQueries } from "@testing-library/react";
import { stat } from "fs";
import agent from "../../app/api/agent";
import { Basket } from "../../app/models/basket";
import { getCookie } from "../../app/util/util";

interface BasketState {
    /** first variable is going to be of type Basket or null */
    basket: Basket | null;   

    // Second variable is going to be of type string
    status: string;
}


const initialState: BasketState = {
    // Initial value is null
    basket: null,

    // Initial value is idle - neaktivan
    status: 'idle'
}

// Moved code from App.tsx. All agent call have to be here.
export const fetchBasketAsync = createAsyncThunk<Basket>(
    'basket/fetchBasketAsync',
    async (_, thunkAPI) => {
        try {

            /** fetch basket from API */
            return await agent.Basket.get()

        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    },
    // In this case the condition is if there is a cookie with the name 'buyerId'.
    // So the API call will be made only is there IS a cookie with the buyerId.
    {
        condition: () => {
            
            if(!getCookie('buyerId')) {

                return false;
            }
        }
    }

)

// Create an async method. Return type is 'Basket' and I'm providing 'productId' and 'quantity'.
// OBS: 'quantity' is optional argument with default value of 1.
export const addBasketItemAsync = createAsyncThunk<Basket, {productId: number, quantity?: number}>(
    'basket/addBasketItemAsync',
    // be carefull 'productId and quantity' are together first argument, thunkAPI is second argument.
    async ({productId, quantity = 1}, thunkAPI) => {
        try {
           return await agent.Basket.addItem(productId, quantity)
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)


// Remove Basket Item
export const removeBasketItemAsync = createAsyncThunk<void, {productId: number, quantity: number, name?: string}>(
    'basket/removeBasketItemAsync',
    async ({productId, quantity, name}, thunkAPI) => {
        try {
            // No RETURN need because I'm not returning anything. This is 'void' function.
            await agent.Basket.removeItem(productId, quantity)
        } catch (error: any) {
            thunkAPI.rejectWithValue({error: error.data})
        }
    }
)


export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        setBasket: (state, action) => {
            // this 'basket' comes from interface 'BasketState'
            state.basket = action.payload
        },

        // add a method to clear the basket.
        clearBasket: (state) => {
            state.basket = null;
        }
    },
    // ?? Write a comment.
    extraReducers: (builder => {
        
        // This is going to happen while I'm waiting for the API to send me back an response. It will set the status to 'pending'
        builder.addCase(addBasketItemAsync.pending, (state, action) => {
            console.log(action)
            // This 'action.meta.arg.productId' do clicked button to be unique.
            state.status = 'pendingAddItem' + action.meta.arg.productId;
        });




        // Builder for removing item from basket
        builder.addCase(removeBasketItemAsync.pending, (state,action) => {
            console.log('Action.Type: ' + action.type)
            state.status = 'pendingRemoveItem' + action.meta.arg.name + action.meta.arg.productId;
        });

        builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {

            const {productId, quantity} = action.meta.arg;
            const itemIndex = state.basket?.items.findIndex(i => i.productId === productId);
            if(itemIndex === -1 || itemIndex === undefined){
                return;
            }
            state.basket!.items[itemIndex].quantity -= quantity;
            if(state.basket?.items[itemIndex].quantity === 0) {
                state.basket.items.splice(itemIndex, 1);
            }
            state.status = 'idle';
            

        })

        builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
            state.status = 'idle';
            console.log(action);
        });

        // When the request is successed, put the payload which is of type 'Basket' in state.Basket. Set status back to idle.
        builder.addMatcher(isAnyOf(addBasketItemAsync.fulfilled, fetchBasketAsync.fulfilled), (state, action) => {
            state.basket = action.payload;
            state.status = 'idle';
        });

        // If there is any issue, set the status to idle.
        builder.addMatcher(isAnyOf(addBasketItemAsync.rejected, fetchBasketAsync.rejected) ,(state, action) => {
            console.log(action.payload);
            state.status = 'idle';
        });
    })
})

// Export actions
export const {setBasket, clearBasket} = basketSlice.actions;

/* function async(arg0: { productId: any; quantity: any; }): import("@reduxjs/toolkit").AsyncThunkPayloadCreator<Basket, { productId: number; quantity /** first variable is going to be of type Basket or null : number; }, {}> {
    throw new Error("Function not implemented.");
} */
