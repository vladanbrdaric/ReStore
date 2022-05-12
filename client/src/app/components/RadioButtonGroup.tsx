import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";

interface Props {
    // This can be t.ex sortOptions or something like that.
    options: any[];
    onChange: (event: any) => void;
    selectedValue: string;
}

export default function RadioButtonGroup({options, onChange, selectedValue}: Props){
    return(
        <FormControl>                                            
            <FormLabel id="orderby-radio-buttons-group">Order By</FormLabel>
            <RadioGroup
                // This will trigger a function 'onChange' that I'm passing in.
                onChange={onChange} 
                value={selectedValue}
            >

                {/** So from sortOptions i need value, and label 'keys' */}
                {options.map(({value, label}) => (

                    <FormControlLabel value={value} control={<Radio />} label={label} key={value}/>

                ))}                
            </RadioGroup>
        </FormControl>
    )
}