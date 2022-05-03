import { LoadingButton } from "@mui/lab";
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import agent from "../../app/api/agent";
import { useStoreContext } from "../../app/context/StoreContext";
import { Product } from "../../app/models/products";

interface Prod {
    product: Product;
}

export default function ProductCard({product}: Prod){
    
    /** Lession 75 */
    /** From useStoreContext I want to use 'setBasket' method. */
    const {setBasket} = useStoreContext();

    /** Because this is a API call, I want to use 'loading' */
    const[loading, setLoading] = useState(false);

    /** Create function to handle addItem */
    function handleAddItem(productId: number){
        /** Set loading to true */
        setLoading(true);

        /** Att to Basket. I don't need to pass in quantity bacause default value is 1. */
        agent.Basket.addItem(productId)
            /** I'm catching error but at the moment. 
             * I'm not doing anything with the basket that is going to come in the response 
            */
            /** I'm getting basket back from the API and setting it with useStoreContext to new updated version. */
            .then(basket => setBasket(basket))
            .catch(error => console.log(error))
            /** Set loading to false. */
            .finally(() => setLoading(false))
    }

    return (
        <Card>
            <CardHeader
                avatar={
                    <Avatar sx={{bgcolor: 'secondary.main'}}>
                        {product.name.charAt(0).toUpperCase()}
                    </Avatar>
                }
                title={product.name}
                titleTypographyProps={{
                    sx: {fontWeight: 'bold', color: 'primary.main'}
                }}
            />
            <CardMedia
                sx={{height: 140, backgroundSize: 'contain', bgcolor: 'primary.light'}}
                image={product.pictureUrl}
                title={product.name}
            />
            <CardContent>
                <Typography gutterBottom color='secondary' variant="h5">
                    ${(product.price / 100).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.brand} / {product.type}
                </Typography>
            </CardContent>
            <CardActions>
                {/** This component give me abillity to display a spinner while something is happening. */}
                <LoadingButton 
                    loading={loading} 
                    onClick={() => handleAddItem(product.id)} 
                    size="small">Add to cart
                </LoadingButton>
                {/* JavaScript sintax for string interpolation >> `/catalog/${product.id}`  <<*/}
                <Button component={Link} to={`/catalog/${product.id}`} size="small">View</Button>
            </CardActions>
        </Card>
    )
}