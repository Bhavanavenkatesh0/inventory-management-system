import { Chip, Stack } from '@mui/material';
import React, { useState } from 'react';

const SalesBilling = () => {

    // Select Sales&Billing Tab
    const [selectedSalesNBillingScreen, setselectedSalesNBillingScreen] = useState("Sales");

    return (
        <div style={{ fontFamily: "Roboto" }} className='grid gap-y-4'>

            <span className='font-semibold text-2xl m-0 p-0' style={{ color: "#252627" }}>Sales & Billing</span>

            <div className='grid grid-flow-col justify-between items-center'>
                <Stack direction="row" spacing={1.5} >
                    <Chip variant='outlined'
                        label='Sales'
                        sx={{
                            background: selectedSalesNBillingScreen === "Sales" ? "#004385" : "transparent",
                            color: selectedSalesNBillingScreen === "Sales" ? "white" : "#004385",
                            border: selectedSalesNBillingScreen === "Sales" ? "2.5px inset #004385" : "2.5px outset #004385",
                            fontWeight: "500", letterSpacing: "0.5px",
                            cursor: "pointer", transition: "0.3s ease-in-out",
                            "&:hover": {
                                background: "#004385 !important",
                                color: "white",
                            },
                        }}
                        onClick={() => setselectedSalesNBillingScreen("Sales")}
                    />
                    <Chip variant='outlined'
                        label='Customers'
                        sx={{
                            background: selectedSalesNBillingScreen === "Customers" ? "#004385" : "transparent",
                            color: selectedSalesNBillingScreen === "Customers" ? "white" : "#004385",
                            border: selectedSalesNBillingScreen === "Customers" ? "2.5px inset #004385" : "2.5px outset #004385",
                            fontWeight: "500", letterSpacing: "0.5px",
                            cursor: "pointer", transition: "0.3s ease-in-out",
                            "&:hover": {
                                background: "#004385 !important",
                                color: "white",
                            },
                        }}
                        onClick={() => setselectedSalesNBillingScreen("Customers")}
                    />
                    <Chip variant='outlined'
                        label='Billing'
                        sx={{
                            background: selectedSalesNBillingScreen === "Billing" ? "#004385" : "transparent",
                            color: selectedSalesNBillingScreen === "Billing" ? "white" : "#004385",
                            border: selectedSalesNBillingScreen === "Billing" ? "2.5px inset #004385" : "2.5px outset #004385",
                            fontWeight: "500", letterSpacing: "0.5px",
                            cursor: "pointer", transition: "0.3s ease-in-out",
                            "&:hover": {
                                background: "#004385 !important",
                                color: "white",
                            },
                        }}
                        onClick={() => setselectedSalesNBillingScreen("Billing")}
                    />
                    <Chip variant='outlined'
                        label='Payments'
                        sx={{
                            background: selectedSalesNBillingScreen === "Payments" ? "#004385" : "transparent",
                            color: selectedSalesNBillingScreen === "Payments" ? "white" : "#004385",
                            border: selectedSalesNBillingScreen === "Payments" ? "2.5px inset #004385" : "2.5px outset #004385",
                            fontWeight: "500", letterSpacing: "0.5px",
                            cursor: "pointer", transition: "0.3s ease-in-out",
                            "&:hover": {
                                background: "#004385 !important",
                                color: "white",
                            },
                        }}
                        onClick={() => setselectedSalesNBillingScreen("Payments")}
                    />
                </Stack>
            </div>

            <div className="Sales">

                {selectedSalesNBillingScreen === "Sales" &&
                    <div className=''>
                        <h1>Sales</h1>
                    </div>
                }

                {selectedSalesNBillingScreen === "Customers" &&
                    <div className=''>
                        <h1>Customers</h1>
                    </div>
                }

                {selectedSalesNBillingScreen === "Billing" &&
                    <div className=''>
                        <h1>Billing</h1>
                    </div>
                }

                {selectedSalesNBillingScreen === "Payments" &&
                    <div className=''>
                        <h1>Payments</h1>
                    </div>
                }

            </div>

        </div>
    );
}

export default SalesBilling;
