import { debounce, TextField } from "@mui/material"
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore"
import { setProductParams } from "./catalogSlice";

export default function ProductSearch(){

    // I'm not quet sure where this productParams comes from. 
    // I think it's from catalogSlice.ts from state.productParams.
    const {productParams} = useAppSelector((state) => state.catalog);
    const dispatch = useAppDispatch();

    // local state. default value will be 'productParams.searchTerm'. 
    // Now I my code down below I can use local state.
    const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);

    // Create a function that delay the dispatch of the action to API.
    // At this point if user press one keyboard key to search it immediatelly
    // go to API. I want go give the user chance to enter a few letters in search field.
    // Debounce: Debounce time is basically and amount of time that the switch doesnt register another click.
    const debouncedSearch = debounce((event: any) => {
        dispatch(setProductParams({searchTerm: event.target.value}))
    }, 1000)


    return (
        // Text field for searching products. (Paper gives me a white background).
        <TextField 
            label='Search products'
            variant='outlined'
            fullWidth
            // Value will be 'searchTerm' or empty string if user don't enter anything.
            value = {searchTerm || ''}
            // I'm parsing in 'event'. This textField value will be added to existing payload.
            onChange={(event: any) => {
                // first setSearchTerm to whatever user enter i Search Field
                setSearchTerm(event.target.value);
                debouncedSearch(event);
            }}
        />
    )
}