import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import { toast } from "react-toastify";
import { history } from "../..";
import agent from "../../app/api/agent";
import { User } from "../../app/models/user";
import { setBasket } from "../basket/basketSlice";

// this will be returned from the API
interface AccountState {
    user: User | null;

    // I dont need 'status' here because react-hook-form is taking care of it.
}

// Set initial state to null
const initialState: AccountState = {
    user: null
}

// im sending in FieldValues which are username and password and returning back email/username and token dvs User interface object.
export const singInUser = createAsyncThunk<User, FieldValues>(
    'account/signInUser',
    async (data, thunkAPI) => {
        try {
            // This 'user' dvs data that comes back from the API is going to be saved in local storage in browser
            // so that it don't get wiped out when user reload the page.
            // this is userDto because it can have 'basket' beside information about the user itself.
            const userDto = await agent.Account.login(data)

            // I have to distructure this 'userDto' property and 'basket' and the rest which is going to be 'username' and 'token'.
            // So 'basket' will be put in basket, and 'username' and 'token' will be put in '...user'
            const {basket, ...user} = userDto;

            // check if I have a basket, if so set basket to basket value that I received from the API
            // OBS: with 'thunkAPI' I can access all the slices I created.
            if(basket){
                thunkAPI.dispatch(setBasket(basket));
            }

            // store 'user' object in local storage and convert JSON object into string.
            localStorage.setItem('user', JSON.stringify(user));

            // return 'user' at the end.
            return user;

        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)


// I'm returning email/username and token in the api that is UserDto, here on the client side is User
export const fetchCurrentUser = createAsyncThunk<User>(
    'account/fetchCurrentUser',
    // '_' becauser I'm not parsing any arguments to the API
    async (_, thunkAPI) => {

        // set the user to 'state' because at this point I know that I have 'user' object in local storage.
        // I'm doing this because 'state' is presistante on reload while localstorage gets wiped out on reload.
        // When I login and grab token, I save it in localstorage, and then with this line I save it in 'state'.
        thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)));


        try {
            const userDto = await agent.Account.currentUser();
            
            const {basket, ...user} = userDto;

            if(basket){
                thunkAPI.dispatch(setBasket(basket));
            }

            // Overwrite the user in the local storage with the updated token that I'm getting back from the API
            localStorage.setItem('user', JSON.stringify(user));

            return user;

        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    },
    {
        // I can put a condition here. I the condition is not met dvs I don't have token in local storage then I don't want
        // to send an API call to get current user. Because no user is loged in.
        condition: () => {

            if(!localStorage.getItem('user')){

                // just return false and async method will not be called. if the condition is false.
                return false;
            }
        }
    }
)


export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        // create signOut function.
        signOut: (state) => {
            // reset the user state back to null.
            state.user = null;

            // remove the user from the local storage
            localStorage.removeItem('user');

            // redirect user back to the home page
            history.push('/')

            // dont forget to export this function
        },

        // create function to setUser
        setUser: (state, action) => {

            console.log(`State.User: ${JSON.stringify(state.user)}`)
            console.log(`Action.Payload: ${JSON.stringify(action.payload)}`)
            // set the payload to user state.
            state.user = action.payload;
        }
    },

    // because I created a 'createAsyncThunk' methods I have to use 'extra reducers'
    // extra reducers are for the async methods.
    extraReducers: (builder => {

        // OBS: AddCase must be called before AddMatcher!!!
        // if the fetch current user get rejected. it can be that the token has been expired in meanwhile.
        builder.addCase(fetchCurrentUser.rejected, (state) => {

            // set user to null.
            state.user = null;

            // remove user from local storage
            localStorage.removeItem('user');

            // show message to user that someting is wrong
            toast.error('Session expired - please login again!');

            // redirect user to home page
            history.push('/');
        }) 


        // addMatcher -> both (async) methods singInUser and fetchCurrentUser returning a 'user'.
        // So I want to use the same case for both of the different methods.
        // this first one is for the 'fulfilled' which means 'succeeded'
        builder.addMatcher(isAnyOf(singInUser.fulfilled, fetchCurrentUser.fulfilled), (state, action) => {
            state.user = action.payload;
        });



        // this one if the first 'addMatcher' failed.
        builder.addMatcher(isAnyOf(singInUser.rejected), (state, action) => {
            // In case of error, I will be redirected to a 'server-error' page.
            // Earlier I just console.log(action.payload).
            throw action.payload;

            // after 'throwing'. Go to Login.tsx file and in submitForm function. Add try catch block when 'await dispatch(signInUser...)'...
        });
    })
})

// export reducer function
export const {signOut, setUser} = accountSlice.actions;