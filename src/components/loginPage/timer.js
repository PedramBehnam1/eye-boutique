import React, { useState, useRef, useEffect } from 'react'
import {
    Typography,
  } from "@mui/material";

const Timer = () => {

    // We need ref in this, because we are dealing
    // with JS setInterval to keep track of it and
    // stop it when needed
    const Ref = useRef(null);

    // The state for our timer
    const [timer, setTimer] = useState('2:00');


    const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / 1000 * 60 * 60) % 24);
        return {
            total, hours, minutes, seconds
        };
    }


    const startTimer = (e) => {
        let { total, minutes, seconds }
            = getTimeRemaining(e);
        if (total >= 0) {

            // update the timer
            // check if less than 10 then we need to
            // add '0' at the begining of the variable
            setTimer(
                (minutes > 9 ? minutes : minutes) + ':'
                + (seconds > 9 ? seconds : '0' + seconds)
            )
        }
    }


    const clearTimer = (e) => {

        // If you adjust it you should also need to
        // adjust the Endtime formula we are about
        // to code next	
        setTimer('2:00');

        // If you try to remove this line the
        // updating of timer Variable will be
        // after 1000ms or 1sec
        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000)
        Ref.current = id;
    }

    const getDeadTime = () => {
        let deadline = new Date();
        deadline.setMinutes(deadline.getMinutes() + 2)
        // This is where you need to adjust if
        // you entend to add more time
        // deadline.setSeconds(deadline.getSeconds() + 15);
        return deadline;

    }

    // We can use useEffect so that when the component
    // mount the timer will start as soon as possible

    // We put empty array to act as componentDid
    // mount only
    useEffect(() => {
        clearTimer(getDeadTime());
    }, []);

    // Another way to call the clearTimer() to start
    // the countdown is via action event from the
    // button first we create function to be called
    // by the button

    return (
        <div className="App">
            <Typography>{timer}</Typography>
        </div>
    )
}

export default Timer;
