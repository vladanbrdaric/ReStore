import { Grid } from "@mui/material";
import { Product } from "../../app/models/products";
import ProductCard from "./ProductCard";

interface Prod {
    products: Product[];
}

export default function ProductList({products}: Prod){
    return (
        <Grid container spacing={4}>
            {products.map(product =>  (
                <Grid item xs={3} key={product.id}>
                    <ProductCard product={product}/>
                </Grid>

            ))}
        </Grid>
    )
}