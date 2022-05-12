import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { MetaData } from "../../app/models/pagination";
import { Product, ProductParams } from "../../app/models/products";
import { RootState } from "../../app/store/configureStore";


// Interface for the CatalogState, this is variabel declaration.
interface CatalogState {
    productsLoaded: boolean;
    filtersLoaded: boolean;
    status: string;
    brands: string[];
    types: string[];
    productParams: ProductParams;
    metaData: MetaData | null;
}


const productsAdapter = createEntityAdapter<Product>();

// I have to 'convert' my productParams of type ProductParams to URLSearchParams to match 'params' type in agent.ts file.
function getAxiosParams(productParams: ProductParams){
    const params = new URLSearchParams();

    // All of those have to match parameters that API expect. Variables that are not string have to convert to string.
    // parameters that have to be parsed
    params.append('pageNumber', productParams.pageNumber.toString());
    params.append('pageSize', productParams.pageSize.toString());
    params.append('orderBy', productParams.orderBy);

    // optional parameters
    if(productParams.searchTerm){
        params.append('searchTerm', productParams.searchTerm);
    }

    if(productParams.brands.length > 0){
        params.append('brands', productParams.brands.toString());
    }

    if(productParams.types.length > 0){
        params.append('types', productParams.types.toString());
    }

    // When all parameters has been appended, return the params.
    return params;
}

// This is an async method that will fetch list of products from API. I'm not passing any arguments.
export const fetchProductsAsync = createAsyncThunk<Product[], void, {state: RootState}>(
    'catalog/fetchProductsAsync',
    // '_' for non existing argument, equivalent to 'void'
    async (_, thunkAPI) => {

        // this '{state: RootState} helping 'thynkAPI.getState() method to know what type it's going to return from this bellow.
        const params = getAxiosParams(thunkAPI.getState().catalog.productParams);

        try {

            // Save the response in a variable
            const response = await agent.Catalog.list(params);

            // setMetaData from the response.
            thunkAPI.dispatch(setMetaData(response.metaData));

            // here i need only products so i'm returning the items back.
            return response.items;

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
            return await agent.Catalog.details(productId);

        } catch (error: any) {
            // instead of just logging value. If it catch error it will do so that whole 'inner' function be rejected
            // rather then fulfilled.
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

// This method will fetch filters
export const fetchFilters = createAsyncThunk(
    'catalog/fetchFilters',
    async(_, thunkAPI) => {
        try {
            return await agent.Catalog.fetchFilters()
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

// Init params function that set the values for the productParams that is going to be send in query to the API
function initParams() {
    return {
        pageNumber: 1,
        pageSize: 6,
        orderBy: 'name',
        brands: [],
        types: []
    }
}

// 
export const catalogSlice = createSlice({
    name: 'catalog',
    // Those all are initial states.
    initialState: productsAdapter.getInitialState<CatalogState>({
        productsLoaded: false,
        status: 'idle',
        // This three properties below are for the fetchFilters
        filtersLoaded: false,
        brands: [],
        types: [],
        productParams: initParams(),
        metaData: null
    }),
    // Just a normal reducers to be able to set this functions.
    reducers: {
        setProductParams: (state, action) => {
            // Set to false becase I want to be able to trigger my useEffect method which listen on productsLoaded state change.
            state.productsLoaded = false;

            // add new productsPrams (...state.ProductParams) to existing one (action.Payload). Use spread operator.
            // reset pageNumber to 1, this will be triggered in 'filter' components.
            state.productParams = {...state.productParams, ...action.payload, pageNumber: 1};
        },

        // Reducer to set the pageNumber. AppPagination will use this one while all other componenter will use 'setProductParams'
        setPageNumber: (state, action) => {
            state.productsLoaded = false;

            state.productParams = {...state.productParams, ...action.payload};
        },

        // new reducer to reset productParams to its initial values.
        resetProductParams: (state) =>
        {
            state.productParams = initParams();
        },

        setMetaData: (state, action) => {
            state.metaData = action.payload;
        }

        // DONT forget to export those functions from this catalogSlice actions
    },
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


        // Those cases are for the sigle product
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

        // Cases for the fetchFilters
        builder.addCase(fetchFilters.pending, (state) => {
            state.status = 'pendingFetchingFilters';
        });
        builder.addCase(fetchFilters.fulfilled, (state, action) => {
            state.brands = action.payload.brands;
            state.types = action.payload.types;
            state.filtersLoaded = true;
             state.status = 'idle';
        });
        builder.addCase(fetchFilters.rejected, (state, action) => {
            console.log(action.payload);
            state.status = 'idle';
        });
    })
})


// Export 'Selectors'
export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);

// Export Actions
export const {setProductParams, resetProductParams, setMetaData, setPageNumber} = catalogSlice.actions;