import { Chip, Stack, Button, Modal, Card, MenuItem, TextField, Select } from '@mui/material';
import React, { useState } from 'react';
import SalesTab from './SalesTab';
import CustomersTab from './CustomersTab';
import BillingsTab from './BillingsTab';
import PaymentsTab from './PaymentsTab';
import CloseIcon from '@mui/icons-material/Close';


const SalesBilling = () => {

    // Select Sales&Billing Tab
    const [selectedSalesNBillingScreen, setselectedSalesNBillingScreen] = useState("Sales");

    // ADD Category MODAL
    const [openAddNewSaleModal, setOpenAddNewSaleModal] = useState(false);
    const addNewSaleModalOpen = () => setOpenAddNewSaleModal(true);
    const addNewSaleModalClose = () => setOpenAddNewSaleModal(false);


    // VALUES TO ADD
    const [customerName, setCustomerName] = useState();
    const [customerContact, setCustomerContact] = useState();


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
                            }} onClick={addNewSaleModalOpen}>
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

            {/* ADD SALES MODAL */}
            <Modal
                open={openAddNewSaleModal}
                onClose={addNewSaleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Card
                    className='w-3/6'
                    sx={{
                        position: 'absolute', top: '50%',
                        left: '50%', transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper', border: '1px outset #f5f5f5',
                        boxShadow: 24, p: 5,
                    }}>
                    <header className='grid grid-flow-col justify-between items-center'>
                        <span></span>
                        <span className='font-bold h2 text-gray-950'>Add New Sale</span>
                        <CloseIcon sx={{ color: "red", fontSize: "30px", cursor: "pointer" }} onClick={addNewSaleModalClose} />
                    </header>
                    <hr />

                    <form onSubmit={(e) => e.preventDefault()}
                        className='grid grid-cols-2 gap-x-5 gap-y-3 items-center'>

                        <div className='flex flex-col'>
                            <label className="h6">Customer Name</label>
                            <TextField id="outlined-basic"
                                variant="outlined"
                                type="text"
                                placeholder="Enter Customer Name"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                required
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className="h6">Customer Contact</label>
                            <TextField id="outlined-basic"
                                variant="outlined"
                                type="text"
                                placeholder="Enter Customer Contact"
                                value={customerContact}
                                onChange={(e) => setCustomerContact(e.target.value)}
                                required
                            />
                        </div>

                        <div className='flex flex-col gap-2.5 col-span-2'>
                            <div className='flex items-baseline gap-3 bg-red-500'>
                                <label className="h6 bg-cyan-400">Add Product</label>
                                <Button
                                    variant='contained'
                                    className=''
                                    size='small'
                                    style={{
                                        background: "#004385", borderRadius: "5px", fontSize: "1rem",
                                    }}>
                                    Add product
                                </Button>
                            </div>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select" required
                                variant='outlined'
                                renderValue={(selected) => selected || "Select Category"}
                                displayEmpty >
                                <MenuItem >Hello</MenuItem>
                                <MenuItem disabled>No Category available</MenuItem>
                            </Select>
                        </div>

                        <div className='flex flex-col'>
                            <label className="h6">Item Color</label>
                            <TextField id="outlined-basic"
                                variant="outlined"
                                type="text"
                                placeholder="Enter Item color"
                                required
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className="h6">Item Origin</label>
                            <TextField id="outlined-basic"
                                variant="outlined"
                                type="text"
                                placeholder="Enter Item origin"
                                required
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className="h6">Item Apperance</label>
                            <TextField id="outlined-basic"
                                variant="outlined"
                                type="text"
                                placeholder="Enter Item Apperance"
                                required
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className="h6">Common Applications</label>
                            <TextField id="outlined-basic"
                                variant="outlined"
                                type="text"
                                placeholder="Enter common applications"
                                required
                            />

                        </div>

                        <div className='grid grid-flow-col grid-cols-3 col-span-2 gap-x-5'>

                            <div className='flex flex-col'>
                                <label className="h6">Slab thickness</label>
                                <TextField id="outlined-basic"
                                    variant="outlined"
                                    type="text"
                                    placeholder="Enter Slab thickness"
                                    required
                                />
                            </div>

                            <div className='flex flex-col'>
                                <label className="h6">Slab Size</label>
                                <TextField id="outlined-basic"
                                    variant="outlined"
                                    type="text"
                                    placeholder="Enter Slab size"
                                    required
                                />
                            </div>

                            <div className='flex flex-col'>
                                <label className="h6">Item Quantity</label>
                                <TextField id="outlined-basic"
                                    variant="outlined"
                                    type="text"
                                    placeholder="Enter Item Quantity"
                                    required
                                />
                            </div>

                        </div>




                        <Button
                            variant='contained'
                            className='col-span-2 py-2.5 mt-2'
                            size='medium'
                            style={{
                                background: "#004385", borderRadius: "5px", fontSize: "1rem",
                            }}>
                            Add Item
                        </Button>

                    </form>
                </Card>
            </Modal>





        </div>
    );
}

export default SalesBilling;
