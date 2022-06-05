import { LoadingButton } from "@mui/lab";
import { Alert, AlertTitle, Avatar, Box, Container, Grid, List, ListItem, ListItemText, Paper, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import agent from "../../app/api/agent";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Register() {

    // useHistory to be able to redirect the user to some other page/component after successed login.
    const history = useHistory();
    
    // create some local states and set an empty string as initial value.
    // const [validationErrors, setValidationErrors] = useState([])

    // useForm() comes from react-hook-form
        const {register, handleSubmit, setError, formState: {isSubmitting, errors, isValid}} = useForm({
        // I can specify the mode I want to use to validate the inputs.
        // onTouched -> as soon as the user click into an input and the click out again, it's going to validate the input field
        mode: 'all'
        })
    
    // create function to handle error from the API
    function handleApiErrors(errors: any) {
        
        // Some of the errors are: 'Passwords must be at least 6 characters.', 'Passwords must have at least one digit ('0'-'9').',
        // 'Passwords must have at least one uppercase ('A'-'Z').', 'Passwords must have at least one non alphanumeric character.'
        
        // check if there is anything inside errors
        if(errors){

            // itterate over array
            errors.forEach((error: string) => {
                
                // check if error include word 'Password'
                if(error.includes('Password')) {
                    setError('password', {message: error})
                // check if error include word 'Email'
                } else if( error.includes('Email')){
                    setError('email', {message: error})
                // check if error include word 'Username'
                } else if( error.includes('Username')) {
                    setError('Username', {message: error})
                }
            });
        }

    }

    // OBS => I don't have to add this to Redux state bacouse I'm not getting any data back from the API. Only ValidationProblem or 201
    //async function submitForm(data: FieldValues) {
    //    await dispatch(registerUser(data));
    //    history.push('/login');
    //}
    
    return (
        <Container 
            component={Paper} 
            maxWidth="sm" 
            sx={{
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                p: 4}}
        >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Register
            </Typography>
            {/** handleSubmit comes from react-hook-form and I have to parse in async function I created. */}
            <Box 
                component="form" 
                onSubmit={(handleSubmit((data) => agent.Account.register(data)
                                                            .then(() => {
                                                                toast.success('Registration successful - you can now login.')
                                                                history.push('/login')
                                                            })
                                                            .catch(error => handleApiErrors(error))))} 
                noValidate 
                sx={{ mt: 1 }}
            >
                <TextField
                    margin="normal"
                    fullWidth
                    label="Email address"
                    autoFocus
                    autoComplete="current-email"
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^\w+[\w-.]*@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/,
                            message: 'Not a valid email address'
                        }
                    })}
                    error={!!errors.email}
                    helperText={errors?.email?.message}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Username"
                    //name="username"
                    autoComplete="username"

                    //onChange={handleInputChange}
                    //value={values.username}
                    // Instead of using 'onChange' and 'value' properties, I can use 'register' method that I got from the react-hook-forn
                    // I can remove the 'name' property as well.
                    {...register('username', {required: 'Username is required'})}
        
                    // The double exclmation mark casts username into a booleon, so if it exists in the 'errors' object is going to be true, 
                    // otherwise false
                    error={!!errors.username}
        
                    // helper test is telling the user what the problem actualy is.
                    helperText={errors?.username?.message}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    //name="password"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    //onChange={handleInputChange}
                    //value={values.password}
                    {...register('password', {
                        required: 'Password does not meet complexity requirements',
                        pattern: {
                            value: /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
                            message: 'Not a complex password'
                        }
                    })}
                    error={!!errors.password}
                    helperText={errors?.password?.message}
                />
{/*                 {validationErrors.length > 0 &&
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
                } */}
                <LoadingButton
                    loading={isSubmitting}
                    // if its the opposite of isValid it will disable the submit button.
                    disabled={!isValid}
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Register
                </LoadingButton>
                <Grid container>
                <Grid item>

                    <Link to="/">
                    Forgot password?
                    </Link>
                </Grid>
                <Grid item>
                    <Link to="/login">
                    {"Already have an account? Sign In"}
                    </Link>
                </Grid>
                </Grid>
            </Box>
        </Container>
    );
}