import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Product } from "../../app/models/products";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchProductsAsync, productSelectors } from "./catalogSlice";
import ProductList from "./ProductList";

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

    // I need state as well
    const {productsLoaded, status} = useAppSelector(state => state.catalog);

    /** Variabel for loading component */
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        
        // check if products are not loaded. If so fetch them from the API
        if(!productsLoaded){
            dispatch(fetchProductsAsync())
        }

        // I have to use 'productsLoaded' as dependency
    }, [productsLoaded, dispatch])

    // check if I'm loading  
    if(status.includes('pending')){
        return <LoadingComponent message="Loading products..."/>
    }

    /** OLD ONE, Before centralizing requests in agent.ts file. The same efect as function above */
/*     useEffect(() => {
      fetch('http://localhost:5000/api/products')
        .then(response => response.json())
        .then(data => setProducts(data)) 
        // very important to pass [] as second argument, otherwicse it will be endless loop.
    }, []) */



/*     function addProduct() {
        setProducts(prevState => [...products, {
            id: prevState.length + 101,
            name: "pro" + (prevState.length + 1),
            description: "some description",
            price: prevState.length * 200.00 + 100.00,
            pictureUrl: 'http://picsum/200',
            type: 'some type',
            brand: 'some brand',
            quantityInStock: 22222
        }]) */

        return (
        /** Equvalent as 'Fragment' or 'div' in HTML. You can return ONLY one element */
        <>  
            <ProductList products={products}/>
        </>
        )
    }




