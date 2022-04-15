import { DarkMode } from "@mui/icons-material";
import { AppBar, Switch, Toolbar, Typography } from "@mui/material";

interface Props{
    darkMode: boolean;
    handleThemeChange: () => void;
}

export default function Header({darkMode, handleThemeChange}: Props)
{
    return (
        /** sx is a propery and we're giving margin-botom (spacing) 4 */
        <AppBar position='static' sx={{mb: 4}}>
            <Toolbar>
                <Typography variant='h6' >
                    RE-STORE
                </Typography>
                <Switch checked={darkMode} onChange={handleThemeChange} />
            </Toolbar>
        </AppBar>
    )
}