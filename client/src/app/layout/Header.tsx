import { DarkMode, ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { NavLink } from "react-router-dom";

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
                    <IconButton size='large' sx={{color: 'inherit'}}>
                        <Badge badgeContent={4} color='secondary'>
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