import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { Product } from "../../app/models/products";
import { RootState } from "../../app/store/configureStore";

const productsAdapter = createEntityAdapter<Product>();

// This is an async method that will fetch list of products from API. I'm not passing any arguments.
export const fetchProductsAsync = createAsyncThunk<Product[]>(
    'catalog/fetchProductsAsync',
    // '_' for non existing argument, equivalent to 'void'
    async (_, thunkAPI) => {
        try {
            return await agent.Catalog.list();
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)


// This async method will go and get an individual product. 
// Because it's just a single parameter I have tu specify only the type which is 'number'.
export const fetchProductAsync = createAsyncThunk<Product, number>(
    'catalog/fetchProductAsync',
    // thunkAPI comes with 'createAsyncThunk' and gives me posibility to 
    async(productId, thunkAPI) => {
        try {
            return await agent.Catalog.details(productId)
        } catch (error: any) {
            // instead of just logging value. If it catch error it will do so that whole 'inner' function be rejected
            // rather then fulfilled.
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

// 
export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productsAdapter.getInitialState({
        productsLoaded: false,
        status: 'idle'
    }),
    reducers: {},
    extraReducers: (builder => {

        // Cases for the list of products
        builder.addCase(fetchProductsAsync.pending, (state) => {
            state.status = 'pendingFetchProducts';
        });
        builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
            productsAdapter.setAll(state, action.payload);
            state.status = 'idle';
            state.productsLoaded = true;
        });
        builder.addCase(fetchProductsAsync.rejected, (state, action) => {
            // in the payload will be 'error' that I'm returning from the API.
            console.log(action.payload);
            state.status = 'idle';
        });


        // Those cases are for the sigle project
        builder.addCase(fetchProductAsync.pending, (state) =>
        {
            state.status = 'pendingFetchProduct';
        });
        builder.addCase(fetchProductAsync.fulfilled, (state, action) =>
        {
            // UpsertOne -> it will upsert any product into my product entities that I'm storing inside my state.
            productsAdapter.upsertOne(state, action.payload);
            state.status = 'idle';
        });
        builder.addCase(fetchProductAsync.rejected, (state, action) =>
        {
            console.log(action);
            state.status = 'idle';
        });
    })
})


// Export 'Selectors'
export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);