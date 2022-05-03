import { TableContainer, Paper, Table, TableBody, TableRow, TableCell, Typography } from "@mui/material";
import { useState } from "react";
import { useStoreContext } from "../../app/context/StoreContext";
import { formatPrice } from "../../app/util/util";

export default function BasketSummary() {

    /** Lession 75 */
    /** From useStoreContext I want to use 'basket' */
    const {basket} = useStoreContext();

    // get basket, count subtotal, parse it in a function to get right format and convert it to a number.
    let subtotal = Number(formatPrice(basket?.items.reduce((sum, item) => sum + item.price * item.quantity, 0)));
    
    // CHECK THIS OUT   => ?? 0 at the end means that if basket?... returning 'null' or 'undefined', return '0' instead.
    // test = basket?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;

    // Delivery fee
    let deliveryFee = subtotal > 100 ? 0 : 5;
    
    // Total price 0 as default.
    let total = 0
    //const [total, setTotal] = useState<number>();


    // Check if subtotal has a value
    if(subtotal){

        // set total to summa of subtotal and delivery fee which is going to be 5 dolars or zero.
        total = subtotal + deliveryFee;
    }


    return (
        <>
            <TableContainer component={Paper} variant={'outlined'}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2}>Subtotal</TableCell>
                            <TableCell align="right">${subtotal}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Delivery fee*</TableCell>
                            <TableCell align="right">${deliveryFee}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell align="right">${total}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <span style={{fontStyle: 'italic'}}>*Orders over $100 qualify for free delivery</span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}