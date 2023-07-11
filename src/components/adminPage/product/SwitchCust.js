import React from 'react'
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import '../../../asset/css/adminPage/addColor.css'

const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 40,
    height: 20,
    padding: 1,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 21,
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(20px)',
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: '2px',
        '&.Mui-checked': {
            transform: 'translateX(19.5px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#bdbdbd' : '#CB929B',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 16,
        height: 16,
        borderRadius: 8,
        transition: theme.transitions.create(['width'], {
            duration: 200,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 20 / 2,
        opacity: 1,
        backgroundColor:
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
        boxSizing: 'border-box',
    },
}));


const SwitchCust = (check) => {

    const [checked, setChecked] = React.useState(true);
    const handleChange = event => {
        setChecked(event.target.checked);
        check={checked}
    };

    return (
        <div className='switchMain'>
            <AntSwitch defaultChecked
                inputProps={{ 'aria-label': 'ant design' }}
                checked={checked}
                onChange={handleChange}
            />

        </div>
    )
}

export default SwitchCust
