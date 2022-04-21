import { Alert, AlertTitle, Button, ButtonGroup, Container, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useState } from "react";
import agent from "../../app/api/agent";

export default function AboutPage(){

    /** Validation errors that commes back in form of string will be stored in this array */
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    /** New function for the validationErrors. It's to much to write everything in line in 'onClick' button. */
    function getValidationError(){
        agent.TestErrors.getValidationError()
            /** This one is if the response is success. */
            .then(() => console.log('Should not see this because the requests to go and get validation will return 400.'))
            .catch(error => setValidationErrors(error))
    }

    return(
        <Container>
            <Typography gutterBottom variant="h2">Errors for testing purpises</Typography>
            <ButtonGroup fullWidth>
                <Button variant="contained" onClick={() => agent.TestErrors.get400Error().catch(error => console.log(error))}>Test 400 Error</Button>
                <Button variant="contained" onClick={() => agent.TestErrors.get401Error().catch(error => console.log(error))}>Test 401 Error</Button>
                <Button variant="contained" onClick={() => agent.TestErrors.get404Error().catch(error => console.log(error))}>Test 404 Error</Button>
                <Button variant="contained" onClick={() => agent.TestErrors.get500Error().catch(error => console.log(error))}>Test 500 Error</Button>
                <Button variant="contained" onClick={getValidationError}>Test Validation Error</Button>
            </ButtonGroup>

            {/** Check if there is something in array. && means 'Execute everything what is to the right of the &&'  */}
            {validationErrors.length > 0 &&
                <Alert severity='error'>
                    <AlertTitle>Validation Errors</AlertTitle>
                    <List>
                        {validationErrors.map(error => (
                            <ListItem key={error}>
                                <ListItemText>{error}</ListItemText>
                            </ListItem>
                        ))}   
                    </List>
                </Alert>
            }
        </Container>

    )
}