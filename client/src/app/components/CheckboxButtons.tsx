import { FormGroup, FormLabel, FormControlLabel, Checkbox } from "@mui/material";
import { useState } from "react";

interface Props {
    items: string[];
    // this can be empty string if the user have not checked any checkbox,
    // or it can be an array with already checked in checkboxes.
    checked?: string[];
    onChange: (items: string[]) => void;
    filterName?: string;
}

export default function CheckboxButtons({items, checked, onChange, filterName} : Props){

    // Create some local states for checking items.

    // checked comes form parrent component. It can be undefined so that's way im saying [] - empty string.
    const [checkedItems, setCheckedItems] = useState(checked || []);

    function handleOnChecked(value: string){

        // find current index of the value that's been checked. If it is not in the list, then add it,
        // otherwise remove it from the list.
        const currentIndex = checkedItems.findIndex(item => item === value);

        // Create an array to store new checked items in. Initialy it is empty.
        let newCheckedItems: string[] = []

        // check if currentIndex is a -1. Which mean that the value is not in the list.
        if(currentIndex === -1){

            // take copy of whatevet is in the 'checkedItems' array, and add 'value' to it.
            newCheckedItems = [...checkedItems, value]
        }

        else{

            // if the index has some value, then remove the item in the checkedItems where value match value from the array.
            newCheckedItems = checkedItems.filter(item => item !== value);
        }

        // set selectedItems to a new modified array
        setCheckedItems(newCheckedItems);

        // newCheckedItems will be returned back to the parrent component.
        onChange(newCheckedItems);
    }

    return (
 

        <FormGroup>

            <FormLabel id="checkboxes-for-filtering-types">{filterName}</FormLabel>

            {items.map((item) => (
                <FormControlLabel 
                    control={<Checkbox 
                        // so if the index of item is not equal to -1, then obviously we know that is checked.
                        checked={checkedItems.indexOf(item) !== -1}
                        
                        // this function takes in an string as paramter, it will be the value 'Angular' 'NetCore' 'React'...
                        onClick={() => handleOnChecked(item)}
                    />} 
                    label={item} 
                    key={item} 
                />

            ))}
        </FormGroup>

    )
}