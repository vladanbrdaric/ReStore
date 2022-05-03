import { DarkMode, ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Link, NavLink } from "react-router-dom";
import { useStoreContext } from "../context/StoreContext";

interface Props{
    darkMode: boolean;
    handleThemeChange: () => void;
}


const midLinks = [
    {title: 'catalog', path: '/catalog'},
    {title: 'about', path: '/about'},
    {title: 'contact', path: '/contact'}
]

const rightLinks = [
    {title: 'login', path: '/login'},
    {title: 'register', path: '/register'}
]

/** Styling for NavLink */
const navStyles = {
                    color: 'inherit',
                    textDecoration: 'none',
                    typography: 'h6',
                    '&:hover': {
                        color: 'grey.500'
                    },
                    '&.active': {
                        color: 'text.secondary'
                    }
}

const navGroupStyle = {
    display: 'flex',
    alignItems: 'center'
}





export default function Header({darkMode, handleThemeChange}: Props)
{
    /** Lession 75 */
    /** From useStoreContext I want to use 'basket' */
    const {basket} = useStoreContext();

    /** in the reduce, I'm passing in callback 'sum' that will hold value summerad value, and item, and then i call item.quantity. 
     * this '0' is the starting value for the sum, and it is zero.
    */
    const itemCount = basket?.items.reduce((sum, item) => sum + item.quantity, 0);
    console.log(`Items in basket: ${itemCount}`)

    return (
        /** sx is a propery and we're giving margin-botom (spacing) 4 */
        <AppBar position='static' sx={{mb: 4}}>
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>

                {/* This is the first element group on the tack bar. 'Home page' and switch button */}
                <Box sx={navGroupStyle}>
                    <Typography variant='h6' component={NavLink} 
                        to='/'
                        exact
                        sx={navStyles}>
                        RE-STORE
                    </Typography>
                    <Switch checked={darkMode} onChange={handleThemeChange} />
                </Box>


                {/* This is the second element group on the tack bar. */}
                <List sx={{display: 'flex'}}>
                    {midLinks.map(({title, path}) => (
                        <ListItem
                            component={NavLink}
                            to={path}
                            key={path}
                            sx={navStyles}
                        >
                            {title.toUpperCase()}
                        </ListItem>
                    ))}    
                </List>     

                {/* This is the third element group on the tack bar. 'Box' is a way of grouping elements. */}
                <Box sx={navGroupStyle}>
                    <IconButton size='large' component={Link} to='/basket' sx={{color: 'inherit'}}>
                        <Badge badgeContent={itemCount} color='secondary'>
                            <ShoppingCart />
                        </Badge>
                    </IconButton>

                    <List sx={{display: 'flex'}}>
                        {rightLinks.map(({title, path}) => (
                            <ListItem
                                component={NavLink}
                                to={path}
                                key={path}
                                sx={navStyles}
                            >
                                {title.toUpperCase()}
                            </ListItem>
                        ))}    
                    </List>   
                </Box>


            </Toolbar>
        </AppBar>
    )
}