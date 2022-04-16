import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/products";



export default function ProductDetails(){

    /** This is a parameter that has been trown in the url. Even if I know that this is a number it will be a string. */    
    const {id} = useParams<{id: string}>();
    
    /** I need somewhere to store the single product that comes from API endpoint. */
    /** Here I'm saying that the type vill be Product (if exist) OR null (if it not exist). Initial value is null. */
    const [product, setProduct] = useState<Product | null>(null);


    /** this 'loading' will be set to true when the component has been initialized */
    const [loading, setLoading] = useState(true);


    /** API get request. [id] at the end is a dependency so that we dont get an endless loop. */
    useEffect(() => {
        {/* JavaScript sintax for string interpolation >> `http://localhost/api/products/${id}`  <<*/}
        axios.get(`http://localhost:5000/api/products/${id}`)
            .then(response => setProduct(response.data))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    },[id])


    /** COUPLE OF CONDITIONS BEFORE I RETURN A PROJECT */

    /** Check for loading status (If the component has been initialized) */
    if (loading) return <h3>Loading...</h3>

    /** If there is no product return message to user. */
    if (!product) return <h3>Product not found...</h3>

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

            </Grid>

        </Grid>
    )
}