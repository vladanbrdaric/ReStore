import { Grid } from "@mui/material";
import { Product } from "../../app/models/products";
import { useAppSelector } from "../../app/store/configureStore";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

interface Prod {
    products: Product[];
}

export default function ProductList({products}: Prod){
    
    // Include productsLoaded state
    const {productsLoaded} = useAppSelector(state => state.catalog);

    return (
        <Grid container spacing={4}>
            {products.map(product =>  (
                <Grid item xs={4} key={product.id}>

                    {/** if products are not loaded yet, show this sceleton component, otherwise shot catalog with the products */}
                    {!productsLoaded ? (
                        <ProductCardSkeleton />
                    ) : (
                        <ProductCard product={product}/>
                    )}
                </Grid>
            ))}
        </Grid>
    )
}