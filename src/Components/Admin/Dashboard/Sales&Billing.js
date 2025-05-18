import { Chip, Stack, Button } from '@mui/material';
import React, { useState } from 'react';
import SalesTab from './SalesTab';
import CustomersTab from './CustomersTab';
import BillingsTab from './BillingsTab';
import PaymentsTab from './PaymentsTab';


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
                {selectedSalesNBillingScreen === "Sales" &&
                    <div className='gap-x-5 grid grid-flow-col'>
                        <Button variant='contained' size='medium' className='!py-2'
                            style={{
                                background: "#004385", borderRadius: "5px", padding: "0 2rem"
                            }} onClick={() => setselectedSalesNBillingScreen("Billing")}>
                            Add New Sale
                        </Button>
                    </div>
                }

            </div>

            <div className="Sales">

                {selectedSalesNBillingScreen === "Sales" &&
                    <SalesTab />
                }

                {selectedSalesNBillingScreen === "Customers" &&
                    <CustomersTab />
                }

                {selectedSalesNBillingScreen === "Billing" &&
                    <BillingsTab />
                }

                {selectedSalesNBillingScreen === "Payments" &&
                    <PaymentsTab />
                }

            </div>

        </div>
    );
}

export default SalesBilling;
