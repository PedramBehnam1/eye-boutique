import React, { useState } from 'react';
import PropTypes from 'prop-types'
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input'
import en from 'react-phone-number-input/locale/en.json'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import '../../asset/css/loginPage/numberSelector.css'


const NumberSelector = (props) => {
    const [country, setCountry] = useState('IR');
    const [value, setValue] = useState();

    
    const handleChange = (event) => {
        setValue(event.target.value);
        props.valueChangeListener(`${getCountryCallingCode(country) + (event.target.value)}`)
    };

    const CountrySelect = ({ value, onChange, labels, ...rest }) => (
        <select
            {...rest}
            value={value}
            onChange={event => onChange(event.target.value || undefined)}>
            <option value="">
                {labels['ZZ']}
            </option>
            {getCountries().map((country) => (
                <option key={country} value={country}>
                    {labels[country]}
                </option>
            ))}
        </select>

    )

    CountrySelect.propTypes = {
        value: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        labels: PropTypes.objectOf(PropTypes.string).isRequired
    }

    return (
        <div>
            <h6 style={{ marginTop: '41px' }}>
                Country
            </h6>
            <CountrySelect
                className="country"
                labels={en}
                value={country}
                onChange={setCountry} />
           
            <TextField
                id="standard-basic"
                type='number'
                label="Number"
                onInput={(e) => {
                    e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                }}
                style={{ marginTop: '33px' }}
                variant="standard"
                value={value}
                onChange={handleChange}
                error={props.error}
                helperText={props.errorMessage}
                fullWidth
                InputProps={{
                    startAdornment: <InputAdornment position="start">+{getCountryCallingCode(country)}   | </InputAdornment>,
                }}
            />
        </div>
    )
}

export default NumberSelector
