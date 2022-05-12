import { Grid, Paper } from "@mui/material";
import { useEffect } from "react";
import AppPagination from "../../app/components/AppPagination";
import CheckboxButtons from "../../app/components/CheckboxButtons";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchFilters, fetchProductsAsync, productSelectors, setProductParams, setPageNumber } from "./catalogSlice";
import ProductList from "./ProductList";
import ProductSearch from "./ProductSearch";


// Those properties are for the radio buttons for sorting
const sortOptions = [
    // this 'value' have to match names from API/ProductExtensions 'sort' method
    {value: 'name', label: 'Alphabetical'},
    {value: 'priceDesc', label: 'Price - High to low'},
    {value: 'price', label: 'Price - Low to high'}
]

/** Create interface that represent all 'in' prameters. It's like a contract that this parameters are required. */
/* interface Props {

    First parameter is of type 'Product' and it's an array. 
    products: Product[];

    Second parameter is an function that has no paramters and return nothing.
    addProduct: () => void;
} */

/** props which represnt 'in' arguements is of type 'Props' and has one property and one function. */
export default function Catalog() {

  // OLD code => this will allow me to keep list of products in the memory.
    //const [products, setProducts] = useState<Product[]>([]);

    // Now I have list of all products in this variable.
    const products = useAppSelector(productSelectors.selectAll);

    // I also need access to dispatch.
    const dispatch = useAppDispatch();

    // I need state as well. This comes from cataloSlice.ts file from 'createSlice' method.
    const {productsLoaded, filtersLoaded, brands, types, productParams, metaData} = useAppSelector(state => state.catalog);


    useEffect(() => {
        
        // check if products are not loaded. If so fetch them from the API
        // SO WHEN EVERY THIS 'PRODUCTSLOADED' CHANGES IT WILL TRIGGER THIS USEEFFECT FUNKTION AND FETCH THE PRODUCTS.
        // IM USING ITS STATE TO TRIGGER A REQUEST TO MY API TO GO AND GET THE NEXT PRODUCTS.
        if(!productsLoaded){
            dispatch(fetchProductsAsync())
        }
        // I have to use 'productsLoaded' as dependency. Which mean when 'dependency' change
        // it will trigger this function to run again.
    }, [productsLoaded, dispatch])


    // Another useEffect to avoid multople API cals. If filers are loaded but not products, 
    // it will send another API call to get products againt.
    useEffect(() => {
        
        // If filters are not loaded fetch them.
        if(!filtersLoaded){
            dispatch(fetchFilters());
        }
    },[filtersLoaded, dispatch])


    // If filters are not loaded, then show loading indicator. Products itself has its own ProductCardSceleton as loading component. 
    if(!filtersLoaded){
        return <LoadingComponent message="Loading products..."/>
    }

        return (
        /** Equvalent as 'Fragment' or 'div' in HTML. You can return ONLY one element */
        <>  
            <Grid container columnSpacing={4}>
                <Grid item xs={3}>
                    {/** Text field for searching products. (Paper gives me a white background).  */}
                    <Paper sx={{mb: 2}}>
                        <ProductSearch />
                    </Paper>                  

                    {/** Radio buttons group for the sorting products by name, price ASC/DESC  */}
                    <Paper sx={{mb: 0, p: 2}}>
                        <RadioButtonGroup 
                            options={sortOptions}
                            // this is call back function. I'm returning an event. In my case it is the value 'name', 'price' or
                            // 'priceDesc'
                            onChange={(event) => dispatch(setProductParams({orderBy: event.target.value}))}
                            // this is the default selectedValue. 'Name' or 'Alfabeticaly' in my case.d
                            selectedValue={productParams.orderBy}  
                        />
                    </Paper>

                    {/** Checkboxes for filtering by BRAND  */}
                    <Paper sx={{mb: 2, p: 2}}>

                        <CheckboxButtons 

                            // So as items, I'm passing in an array of available brands that comes from the API
                            items={brands}

                            // this can be empty string if the user have not checked any checkbox,
                            // or it can be an array with already checked in checkboxes.
                            // CHECK DEV tools for this one.
                            checked = {productParams.brands}

                            // first it will return this items from the 'CheckboxButtons' component,
                            // then the array will be passed to the dispatch which build a query filter and user get filtered products.
                            onChange={(items: string[]) => {dispatch(setProductParams({brands: items}))}}

                            filterName='Brands'
                        />

                    </Paper>


                    {/** Checkboxes for filtering by TYPE  */}
                    <Paper sx={{mb: 2, p: 2}}>

                         <CheckboxButtons 

                            // So as items, I'm passing in an array of available brands that comes from the API
                            items={types}

                            // this can be empty string if the user have not checked any checkbox,
                            // or it can be an array with already checked in checkboxes.
                            // CHECK DEV tools for this one.
                            checked = {productParams.types}

                            // first it will return this items from the 'CheckboxButtons' component,
                            // then the array will be passed to the dispatch which build a query filter and user get filtered products.
                            onChange={(items: string[]) => dispatch(setProductParams({types: items}))}

                            filterName='Types'
                        />                       

                    </Paper>

                </Grid>

                <Grid item xs={9}>
                    <ProductList products={products}/>
                </Grid>
                
                {/** This one grid will be empty and it will be located under the types and brands... */}
                <Grid item xs={3}/>
                
                {/** This one grid will be empty and it will be located under the types and brands... */}
                <Grid item xs={9} sx={{mb:2, mt:0, pt:0}}>
                    {/** this 'AppPagination' component will be loaded only it the metaData is true. dvs its not NULL. */}
                    {metaData &&
                        <AppPagination 
                            metaData={metaData}
                            onPageChange={(page: number) => dispatch(setPageNumber({pageNumber: page}))}
                        />
                    }


                </Grid>
            </Grid>
            


        </>
        )
    }




