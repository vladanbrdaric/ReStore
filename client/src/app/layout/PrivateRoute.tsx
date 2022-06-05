import { ComponentType } from "react";
import { Redirect, Route, RouteComponentProps, RouteProps } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";

// Create Props that is going to be parsed to this component.
// In this case I'm going to parse a component type that this component is going to accept.
// Interface I created extends from RouteProps.
// This is something new I learned.
interface Props extends RouteProps{
    // with this line I'm covering all the cases dvs. types of components.
    component: ComponentType<RouteComponentProps<any>> | ComponentType<any>
}


// This component is created to redirect NOT logged in user to login page if it try to access checkout page inside the basket.

// I'm parsing in 'component' but i'm going to call it 'Component'. I'm not sure what the 'rest' is. 
export default function PrivateRoute({ component: Component, ...rest }: Props) {
  
    // get user from (account) state
    const {user} = useAppSelector(state => state.account)
    return (
        <Route
        {...rest}
        // I'm parsing 'props' here.
        render={ props =>
            // check if there is a 'user'. 
            user ? (
                // if the user is logged in I want to return a component (like checkout) with all of the props.
                // I think that the 'props' are all of the properties that I'm parsing in 'checkout' component or any
                // other component that is going to be parsed to this PrivateRoute component.
                // So use all of the props and spread them across to my component.
                <Component {...props} />
            ) : (
            <Redirect
                to={{
                pathname: "/login",
                // So if the user is not logged in. I will force him to login and then I'm going to redirect him to the 'location'
                // The 'location' is page/component where he wanted to go in the first place.
                state: { from: props.location }
                }}
            />
          )
        }
      />
    );
}