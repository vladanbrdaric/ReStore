import { ThemeProvider } from "@emotion/react";
import { Container, createTheme, CssBaseline } from "@mui/material";
import { useState } from "react";
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

function App() {
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

  return (
    <ThemeProvider theme={theme}>
      {/** Toast Container have to be right below ThemeProvider */}
      <ToastContainer position="bottom-right" hideProgressBar/>
      <CssBaseline />
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange}/> 
      <Route exact path='/' component={HomePage} />
      <Route path={'/(.+)'} render={() => (
        <Container sx={{ mt: 4 }}>
          <Switch>
            <Route exact path="/catalog" component={Catalog} />
            <Route path="/catalog/:id" component={ProductDetails} />
            <Route path="/about" component={AboutPage} />
            <Route path="/contact" component={ContactPage} />    
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
