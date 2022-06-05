import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Paper } from '@mui/material';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useState } from 'react';
import agent from '../../app/api/agent';
import { FieldValues, useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { ErrorSharp } from '@mui/icons-material';
import { useAppDispatch } from '../../app/store/configureStore';
import { singInUser } from './accountSlice';


export default function Login() {

  // useHistory to be able to redirect the user to some other page/component after successed login.
  const history = useHistory();

  // to get location from the react hook.
  const location = useLocation<any>();

  // bring in dispatch so that I can dispatch to new action that I created.
  const dispatch = useAppDispatch();

  // useForm() comes from react-hook-form
    const {register, handleSubmit, formState: {isSubmitting, errors, isValid}} = useForm({
      // I can specify the mode I want to use to validate the inputs.
      // onTouched -> as soon as the user click into an input and the click out again, it's going to validate the input field
      mode: 'all'
    })


// create a function submitForm. FieldValues I get from react-hook-form as well
// react-hook-form is going to trach the loading status when I'm submitting the form.
async function submitForm(data: FieldValues) {
      try {
          await dispatch(singInUser(data));
          // So when I log in the location will not be set to, and I'm going to be redirect to 'catalog'.
          // If I'm in the basket and I'm not logged in when I press 'checkout'. It will remember the 'checkout' page.
          // Location will be set to 'checkout' but I'm going to be redirected to login page. When I log in I will be redirected to 'location'.
          history.push(location.state?.from?.pathname || '/catalog');
      } catch(error: any) {
          console.log(error)
      }

}

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
            Sign in
          </Typography>
          {/** handleSubmit comes from react-hook-form and I have to parse in async function I created. */}
          <Box component="form" onSubmit={handleSubmit(submitForm)} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              label="Username"
              //name="username"
              autoComplete="username"
              autoFocus
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
              {...register('password', {required: 'Password is required'})}
              error={!!errors.password}
              helperText={errors?.password?.message}
            />
            <LoadingButton
              loading={isSubmitting}
              // if its the opposite of isValid it will disable the submit button.
              disabled={!isValid}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </LoadingButton>
            <Grid container>
              <Grid item>
                <Link to="/">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/register">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
      </Container>
  );
}