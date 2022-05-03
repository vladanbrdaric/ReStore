import { Add, Delete, ProductionQuantityLimits, Remove } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useState } from "react";
import { isTemplateTail } from "typescript";
import { useStoreContext } from "../../app/context/StoreContext";
import agent from "../../app/api/agent";
import { LoadingButton } from "@mui/lab";
import { loadavg } from "os";
import BasketSummary from "./BasketSummary";
import { Link } from "react-router-dom";

export default function BasketPage(){
    
    /** OBS!!! Lession: 75. After creating StoreContext, I don't have to grab the basket here.
     * I already did this in app.tsx file, on app initialization. */

/*     /** Because Im going to retrieve my basket from the API, I want to add loading state 'loading'
    const[loading, setLoading] = useState(true);

    /** I want to store my basket as well.

    const[basket, setBasket] = useState<Basket | null>(null);
    
    /** To get basket I need to use useEffect
    useEffect(() => {
        /** This get method is located in agent.tsx
        agent.Basket.get()
            /** So I get the basket from API and set to this variable
            .then(basket => setBasket(basket))
            /** If some error occurs, write it to the console.
            .catch(error => console.error(error))
            /** set loading to false
            .finally(() => setLoading(false))
    }, []) 
    
    /** If the loading is true, that the basket has not arrived from the API jet. So show the message to the user.
    if(loading){
        return <LoadingComponent message="Loading basket..." />
    } 
    
*/


    /** Lession: 75 */
    /** From useStoreContext I want to use 'basket' */
    const {basket, setBasket, removeItem} = useStoreContext();
    
    /** This modification is for the buttons to be able to recognize which button has being pressed. */
    const [status, setStatus] = useState({
        loading: false,
        name: ''
    });

    /** If the basket is null */
    if(basket === null){
        <Typography variant="h3">Your basket is empty</Typography>
    }

    console.log(basket?.items.length)

    // My code to hide empty tables when no produce has been added to the basket.
    if(basket && basket.items.length === 0){
        return <Typography variant="h3">Your basket is empty</Typography>
    }


    /** Now, It will only show loading sing with parsed button name that I pass in. */
    function handleAddItem(productId: number, name: string){
        setStatus({loading: true, name});
        agent.Basket.addItem(productId)
            .then(basket => setBasket(basket))
            .catch(error => console.log(error))
            .finally(() => setStatus({loading: false, name: ''}))
    }

    function handleRemoveItem(productId: number, quantity: number, name: string){
        setStatus({loading: true, name});
        agent.Basket.removeItem(productId, quantity)
            .then(() => removeItem(productId, quantity))    
            .catch(error => console.log(error))
            .finally(() => setStatus({loading: false, name: ''}))
    }

    return(
        <>  
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="right">Subtotal</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {basket?.items.map(item => (
                            <TableRow
                                key={item.productId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    <Box display='flex' alignItems='center'>
                                        <img src={item.pictureUrl} alt={item.name} style={{height: 50, marginRight: 20}} />
                                        <span>{item.name}</span>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">${(item.price / 100).toFixed(2)}</TableCell>
                                <TableCell align="center">
                                    <LoadingButton 
                                        loading={status.loading && status.name === 'rem' + item.productId} 
                                        color='error' 
                                        onClick={() => handleRemoveItem(item.productId, 1, 'rem' + item.productId)}>
                                        <Remove />
                                    </LoadingButton>

                                    {item.quantity}

                                    <LoadingButton 
                                        loading={status.loading && status.name === 'add' + item.productId} 
                                        color='secondary' 
                                        onClick={() => handleAddItem(item.productId, 'add' + item.productId)}>
                                    <Add />
                                    </LoadingButton>
                                </TableCell>
                                <TableCell align="right">${((item.price / 100) * item.quantity).toFixed(2)}</TableCell>
                                <TableCell align="right">
                                    <LoadingButton
                                        loading={status.loading && status.name === 'del' + item.productId} 
                                        color="error" 
                                        onClick={() => handleRemoveItem(item.productId, item.quantity, 'del' + item.productId)}>
                                        <Delete />
                                    </LoadingButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid container spacing={0}>
                <Grid xs={6}/>
                <Grid xs={6}>
                    <BasketSummary></BasketSummary>
                    <Button 
                        component={Link}
                        // Go to 'checkout' page
                        to='/checkout'
                        // to be full with color
                        variant='contained'
                        // to be little bit bigger then standard size 
                        size='large'
                        // container full width
                        fullWidth
                        >Checkout
                    </Button>
                </Grid>
            </Grid>
        </>

)}