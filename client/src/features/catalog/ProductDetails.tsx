import { LoadingButton } from "@mui/lab";
import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import agent from "../../app/api/agent";
import { useStoreContext } from "../../app/context/StoreContext";
import NotFoundError from "../../app/errors/NotFoundError";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Product } from "../../app/models/products";



export default function ProductDetails(){

    /** This is a parameter that has been trown in the url. Even if I know that this is a number it will be a string. */    
    const {id} = useParams<{id: string}>();

    /** Get basket from Context */
    const {basket, setBasket, removeItem} = useStoreContext();
    
    /** I need somewhere to store the single product that comes from API endpoint. */
    /** Here I'm saying that the type vill be Product (if exist) OR null (if it not exist). Initial value is null. */
    const [product, setProduct] = useState<Product | null>(null);


    /** this 'loading' will be set to true when the component has been initialized */
    const [loading, setLoading] = useState(true);

    /** This quantity will be used to show the quantity of that particular product in the basket. Set it to 0 by default. */
    const [quantity, setQuantity] = useState(0);

    /** This submitting will be used as loading. The first one loading I use when fetching product from API. Set it to false by default. */
    const [submitting, setSubbmiting] = useState(false);


    /** Try to find that item in the basket. If the item is not in the basket it will return 'undefined'.*/
    const item = basket?.items.find(i => i.productId === product?.id);

    // Get Quantity
    //const quantity = basket?.items.find(item => item.productId === Number(id))?.quantity ?? 0;

    function AddToBasket(productId: number){

        const item = basket?.items.find(item => item.productId === productId)
        console.log(item?.name);
        // check if item exist
        if (item){
            agent.Basket.addItem(item.productId, 1)
                .then(basket => setBasket(basket))
        }
    }

    /** API get request. [id] at the end is a dependency so that we dont get an endless loop. */

    useEffect(() => {

        // check if the item exist, if so set the variable quantity to item.quantity.
        if(item){
            setQuantity(item.quantity);
        }

        agent.Catalog.details(parseInt(id))
            .then(response => setProduct(response))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
        /** If you forget to add dependency the item will not update the quantity in the text field */
    }, [id, item])




    /** OLD ONE Before adding 'agent.ts' helper file */
/*     useEffect(() => {
        { JavaScript sintax for string interpolation >> `http://localhost/api/products/${id}`  <<}
        axios.get(`http://localhost:5000/api/products/${id}`)
            .then(response => setProduct(response.data))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    },[id]) */


    /** This function will handle changes in TextField */
    function handleInputChange(event: any){

        /** Check if value is greater or equal 0 */
        if(event.target.value >= 0){

            /** parseInt to insure that I'm saving this as an integer. */
            setQuantity(parseInt(event.target.value));
        }
    }


    /** This function will update the quantity to */
    function handleUpdateCart(){
        
        // Turn on the loading flag
        setSubbmiting(true);

        // Check if I have an item, and see if the quantity in my local state (text field) is greater than item.quantity thats in the basket.
        // That mean that I'm adding to the basket.
        // If I don't have an item, that means that I'm adding a new item to the basket.
        // So check if the item is not in the basket, or if local quantity is greater then the item.quantity.
        if(!item || quantity > item.quantity){

            // Create new variabel that is going to hols new updaterd quantity
            const updatedQuantity = item ? quantity - item.quantity : quantity;

            // Call the API agent to update the basket.
            agent.Basket.addItem(product?.id!, updatedQuantity)
                .then(basket => setBasket(basket))
                .catch(error => console.log(error))
                .finally(() => setSubbmiting(false));
        }


        /** if the item exist or the quantity is less then the item.quantity. That means that I'm removing from the item.  */
        else{
        
            const updatedQuan = item.quantity - quantity;

            //setStatus({loading: true, name});

            // the other parameter was optional, I change it to not be optional. I dont know it here
            agent.Basket.removeItem(product?.id!, updatedQuan)
                .then(() => removeItem(product?.id!, updatedQuan))
                .catch(error => console.log(error))
                .finally(() => setSubbmiting(false))

            
/*             const updatedQuantity = item.quantity - quantity;
            agent.Basket.removeItem(product?.id!, updatedQuantity)
                .then(() => removeItem(product?.id!, updatedQuantity))
                .catch(error => console.log(error))
                .finally(() => setSubbmiting(false)) */
        }

        // Check if I'm removing items from the cart, as I'm reducing the quantity.


        
        // Check if I'm adding items from the cart, as I'm increasing the quantity.
        


        // Check if I'm adding a new item to the cart as well.
    }


    /** COUPLE OF CONDITIONS BEFORE I RETURN A PROJECT */

    /** Check for loading status (If the component has been initialized) */
    if (loading) return <LoadingComponent message="Loading product..." />

    /** If there is no product return message to user. */
/*     if (!product) return <h3>Product not found...</h3> */
    if (!product) return <NotFoundError />

    return(             
        <Grid container spacing={6}> {/** Spacing between items inside grid */}

            {/* Left side grid */}
            <Grid item xs={6}>
                <img src={product.pictureUrl} alt={product.name} style={{width: '100%'}} />
            </Grid>
            
            {/* Right side grid */}
            <Grid item xs={6}>
                <Typography variant="h3">{product.name}</Typography>
                <Divider sx={{mb: 2}} />
                <Typography variant="h4" color='secondary'>${(product.price / 100).toFixed(2)}</Typography>

                {/* Table container */}
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Desription</TableCell>
                                <TableCell>{product.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>{product.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Brand</TableCell>
                                <TableCell>{product.brand}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Quantity in stock:</TableCell>
                                <TableCell>{product.quantityInStock}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                {/**  */}
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            onChange={handleInputChange}
                            variant='outlined'
                            type='number'
                            label='Quantity in Cart'
                            fullWidth
                            /** If you forget to add dependency [item] the item will not update the quantity in the text field */
                            value={quantity}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <LoadingButton
                            // disable the button if the  quantity remain the same. Or if the item is not in the basket and quantity is equal 0. 
                            disabled={item?.quantity === quantity || !item && quantity === 0}
                            loading={submitting}
                            onClick={handleUpdateCart}
                            sx={{height: '55px'}}
                            color='primary'
                            size='large'
                            variant='contained'
                            fullWidth 
                            >{item ? 'Update Quantity' : 'Add to Cart'}
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Grid>
            
        </Grid>
    )
}