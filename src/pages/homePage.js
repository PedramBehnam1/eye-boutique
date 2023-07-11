import React, { useState } from 'react'
import GridHomePage from '../components/homePage/gridHomePage'
import Footer from '../layout/footer';
import Header from '../layout/Header';

const HomePage = () => {
    const [banners,setBanners]= useState([]);
    const [timer, setTimer] = useState('');
    const [sliders, setSliders] = useState([]);
    const [isRemoved, setIsRemoved] = useState(false);
    const[showCartPage,setShowCartPage]=useState(false)
    const [trigger,setTrigger] = useState(0)
    const [_trigger, _setTrigger] = useState(0);
    
    return (
        <div>
            <Header theme='black' 
                banners={(banners) => setBanners(banners)}
                timer={(timer) => setTimer(timer)}
                sliders={(sliders) => setSliders(sliders)} 
                trigger={trigger} _trigger={_trigger} showShoppingCard={showCartPage} closeShowShoppingCard={()=>{setShowCartPage(false)}}
                isRemoved={(isRemoved) => {
                  setIsRemoved(isRemoved)
                }}
                _trigger_={(trigger) => {
                  setTrigger(trigger);
                  _setTrigger(trigger);
                }}
            />
            <GridHomePage banners={banners} timer={timer} sliders={sliders} />
            <Footer />
        </div>

    );
}

export default HomePage
