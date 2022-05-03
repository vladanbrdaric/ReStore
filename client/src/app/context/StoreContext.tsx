import { createContext, PropsWithChildren, useContext, useState } from "react";
import NotFoundError from "../errors/NotFoundError";
import { Basket } from "../models/basket";

/** OBS: I dont need a method to add an item to the basket.
 *       Because when ever I add an item in the basket I will get
 *       Basket back from the API and I can use that basket to i.g. update 
 *       the quantity on the basket number in the header. 
 *       But when I remove item I get nothing back from the API except code 200 and that's the reason that
 *       I need removeItem method here.
 */

interface StoreContextValue {
    /** first variable is going to be of type Basket or null */
    basket: Basket | null;   
    /** second variable is a methods to set basket, it takes basket as parameter. It r eturns nothing */
    setBasket: (basket: Basket) => void;
    /** third variable is an method to removeItem. It takes productId and quantity as parameters. */
    removeItem: (productId: number, quantity: number) => void;
}

/** StoreContext is of type StoreContextValue or undefined. Default value is undefined. */
export const StoreContext = createContext<StoreContextValue | undefined>(undefined);


/** In order to consume StoreContext and its basket variable and two methods I have
 *  to create my own custom react hook
 *  Note that React hook always start with word 'use'
*/

export function useStoreContext(){

    /** I'm going to use another reach hook here */
    const context = useContext(StoreContext);

    /** Check if context is undefined */
    if(context === undefined){
        throw Error('Oops - we do not seem to be inside the provider...')
    }

    return context;
}

/** Check "lession 73" again */
/** I'm going to wrap my app with this StoreProvider, and then this basket, and two methids
 * will be available to the all children in my app.
 * They will be able to access the store context directly using the store context hook
 * 'useStoreContext' that I created earlier.
 */
export function StoreProvider({children}: PropsWithChildren<any>){

    /** Create 'State' for the variable and methods that I have to support. */

    const [basket, setBasket] = useState<Basket | null>(null);

    /** Create little bit of logic to reduce the quantity or remove the whole item from the basket. */
    function removeItem(productId: number, quantity: number){

        /** Check if the basket is null, it so stop execution. */
        if(!basket){
            return;
        }

        /** Otherwise do next. OBS '...basket' is a spread operator. */
        /** When I use the spread operator, it will crate a new copy of this array 'basket.items'
         * and it's going to store it inside this variable 'items'.
         */

        /** OBS: When I'm setting states inside the component ('basket, setBasket'), then it's not advisable to mutate states
        *       I'm going to create a new copy of that state and then replace the existing stare with this new one.
        *       reach prefers it if I work that way.
        */
        const items = [...basket.items];

        /** I have to find index of that product in array. It returns -1 if product not found. */
        const itemIndex = items.findIndex(i => i.productId === productId);

        /** Let's be defensive here and check for the itemIndex and it's value. */
        if(itemIndex < 0){
            return <NotFoundError />
        }
        else{
            /** reduct the quantity */
            items[itemIndex].quantity -= quantity;

            /** check for the quantity. If its 0 remove product from the basket */
            if(items[itemIndex].quantity === 0){
                items.splice(itemIndex, 1);
                
                /** replace basket.items with updated 'items' which is the copy of array*/
                setBasket(prevState => {
                    return {...prevState!, items}
                })
            }
        }

        console.log(`Basket inside Store Context when removing an item: ${items[itemIndex].quantity}`)
    }

    return(
        /** Return the StoreContext provider because I'm providing this context to my app. */
        /** In the 'value' I have to specify what I'm providing - variable and two method. */
        <StoreContext.Provider value={{basket, setBasket, removeItem}}>
            {children}
        </StoreContext.Provider>
    )
}