import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";

interface Props{
    message?: string; 
}

export default function LoadingComponent({message = 'Loading...'}: Props){
    
    return(
        /** This will take whole screen and prevent user from clicking something while
            the app is going through loading of something.
          */
        <Backdrop open={true} invisible={true}>
            {/** Box is for to be able to aligh things here as well */}
            <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
                <CircularProgress size={100} color='secondary' />
                <Typography variant="h4" sx={{justifyContent: 'center',
                                              position: 'fixed',
                                              top: '60%'}}>{message}</Typography>
            </Box>
        </Backdrop>
    )
}