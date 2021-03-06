import { ThemeProvider } from "@emotion/react";
import { Container, createTheme, CssBaseline } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AboutPage from "../../features/about/AboutPage";
import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import ContactPage from "../../features/contact/ContactPage";
import HomePage from "../../features/home/HomePage";
import Header from "./Header";
import 'react-toastify/dist/ReactToastify.css';
import ServerError from "../errors/ServerError";
import NotFoundError from "../errors/NotFoundError";
import BasketPage from "../../features/basket/BasketPage";
import { useStoreContext } from "../context/StoreContext";
import { Basket } from "../models/basket";
import { getCookie } from "../util/util";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";
import CheckoutPage from "../../features/checkout/CheckoutPage";
import { basketSlice, fetchBasketAsync, setBasket } from "../../features/basket/basketSlice";
import { useAppDispatch } from "../store/configureStore";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import { fetchCurrentUser } from "../../features/account/accountSlice";
import PrivateRoute from "./PrivateRoute";

function App() {
  /** I have to specify what I'm interested of from useStoreContext */
  // The old one using StoreContext;
  //const {setBasket} = useStoreContext();

  // useAppDispatch comes from 'configureStore.ts' file.
  const dispatch = useAppDispatch(); 

  /** I'm getting basket from API which meands there will be some loading. */
  const [loading, setLoading] = useState(true);

  // Create function to initialize the app. Make it async as well.
  // It have to be Redux callback function.
  const initApp = useCallback(async () => {
    try {

      // So when the page reloads or the app initialize do next:

      // try to fetch loged in user.
      await dispatch(fetchCurrentUser());

      // fetch basket (for the speficic buyerId.) 
      await dispatch(fetchBasketAsync());
    } catch (error) {
      console.log(error)
    }
  }, [dispatch])

  /** In order to go and get the basket when my application loads, use 'useEffect'. */
  useEffect(() => {
    
    // call async function initApp and set loading to false.
    initApp().then(() => setLoading(false));

    /** setBasket is a dependency that I need. */
  },[initApp])

  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  const theme = createTheme(
    {
      palette: {
        mode: paletteType,
        background: {
          default: paletteType === 'light' ? '#eaeaea' : '#121212'
        }
      }
    }
  )

  function handleThemeChange(){
    /**set dark mode to opposite what ever dark mode is */
    setDarkMode(!darkMode)
  }

  /** Check to see if loading, if so, return loading component. */
  if(loading){
    return <LoadingComponent message="Initialising app..."/>
  }

  return (
    <ThemeProvider theme={theme}>
      {/** Toast Container have to be right below ThemeProvider */}
      <ToastContainer position="bottom-right" hideProgressBar/>
      <CssBaseline />
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange}/> 
      <Route exact path='/' component={HomePage} />
      <Route path={'/(.+)'} render={() => (
        <Container sx={{ mt: 6 }}>
          <Switch>
            <Route exact path="/catalog" component={Catalog} />
            <Route path="/catalog/:id" component={ProductDetails} />
            <Route path="/about" component={AboutPage} />
            <Route path="/contact" component={ContactPage} />    
            <Route path="/basket" component={BasketPage} />    
            {/* <Route path="/checkout" component={CheckoutPage} /> -> OLD ONE - NOT PROTECTED. **/}     
            <PrivateRoute path="/checkout" component={CheckoutPage} />    
            <Route path="/login" component={Login} />    
            <Route path="/register" component={Register} />    
            {/** Look at agent.tsx file for the 500 server error. */}
            <Route path="/server-error" component={ServerError} />    
            
            {/** Do not specify path here. If nan of those above path match, it will return this component back. */}
            <Route component={NotFoundError} />    
          </Switch>
        </Container>
      )} />
    </ThemeProvider>
  );
}

export default App;
