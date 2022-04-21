import { Button, Container, Divider, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";

export default function ServerError(){

    /** This is the hook that I get so at I can use history in this component the same way that I just used it in agent.tsx */
    const history = useHistory();

    /** This is another hook where I'm creating an object where error will be stored. Type 'any' just to get rid of error. */
    const {state} = useLocation<any>();

    return (
        <Container component={Paper}>
            {/** So state.error is optional but '?' means if I have an error, then return this first one <></> block */}
            {state?.error ? (
                <>
                    <Typography variant="h3" color='error' gutterBottom>{state.error.title}</Typography>
                    <Divider />
                    {/** In develpment I want to see all information about error, while in production only 'Internal Server Error' */}
                    <Typography>{state.error.detail || 'Internal Server Error'}</Typography>
                </>

            ) : (
                /** If there is no error, then return this if true ? return '1' : otherwise return '2'. This is nr 2. */
                <Typography variant="h5" gutterBottom>Server Error</Typography>
            )};

            {/** This two buttons below does the same thing. */}
            <Button component={Link} to={'/catalog'}>Test</Button>
            <Button onClick={() => history.push('/catalog')}>Go Back To The Shop</Button>
            
        </Container>
    )
}