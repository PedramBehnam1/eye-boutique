import React, { useState, useEffect } from 'react'
import axiosConfig from '../../axiosConfig';
import Footer from '../../layout/footer';
import Header from '../../layout/Header';
import { Accordion, AccordionDetails, AccordionSummary,  Divider, Grid, IconButton, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';



const FaqPage = () => {
    const [faqs, setFaqs] = useState([]);
    const [isRemoved, setIsRemoved] = useState(false);
    const[showCartPage,setShowCartPage]=useState(false)
    const [trigger,setTrigger] = useState(0)
    const [_trigger, _setTrigger] = useState(0);

    useEffect(() => {
        refreshList();
    }, [])

    const refreshList = () => {
        axiosConfig.get('/admin/faq/all')
            .then(res => {
                setFaqs(res.data.faqs.filter(f=>f.status === 1))
            })
    }

    return (
        <Grid xs={12}>
            <Header trigger={trigger} _trigger={_trigger} showShoppingCard={showCartPage} closeShowShoppingCard={()=>{setShowCartPage(false)}}
                isRemoved={(isRemoved) => {
                setIsRemoved(isRemoved)
                }}
                _trigger_={(trigger) => {
                setTrigger(trigger);
                _setTrigger(trigger);
                }}
            />

            <Grid xs={12} style={{ backgroundColor: 'white', minHeight: '600px' }} display='flex' alignItems='center' justifyContent='center' >
                <Grid xs={7}>
                    <Grid xs={12} pl={2} pb={5} display='flex' justifyContent='space-between' alignItems='center'>
                        <Grid xs={3}>
                            <Typography variant='h19'>FAQ</Typography>
                        </Grid>
                        <Grid xs={9}
                            className="form-group has-search"
                        >
                            <Typography className="fa fa-search ">
                                <IconButton color="inherit"
                                    className="form-control-feedback"
                                    style={{ paddingTop: '17px' }}
                                >
                                    <SearchIcon />
                                </IconButton>
                            </Typography>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search in FAQ"
                                style={{ backgroundColor: '#E0E0E0', width: '100%' }}
                            />


                        </Grid>
                    </Grid>
                    {faqs.map((faq, index) => {
                        return (
                            <>
                                <Accordion style={{ boxShadow: 'none' }} >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography variant='menuitem'>{index + 1 + '. ' + faq.question.charAt(0).toUpperCase() + faq.question.slice(1)}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='h16'>
                                            {faq.answer.charAt(0).toUpperCase() + faq.answer.slice(1)}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                                <Divider />
                            </>

                        )
                    })}
                </Grid>
            </Grid>
            <Footer />
        </Grid>
    )
}

export default FaqPage