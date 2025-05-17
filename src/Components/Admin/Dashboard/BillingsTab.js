import { Avatar, Button, Card, Chip, IconButton, InputAdornment, MenuItem, Modal, Select, Stack, TextField } from '@mui/material';
import { TableContainer, Table, TableHead, TableRow, TableBody, TableCell } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import React, { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { database } from '../../../firebase';

const BillingsTab = () => {

    // VALUES TO ADD
    const [customerName, setCustomerName] = useState();
    const [customerContact, setCustomerContact] = useState();
    const [productQty, setproductQty] = useState(1);

    const handleIncrement = () => {
        setproductQty(prevQty => prevQty + 1);
    };

    const handleDecrement = () => {
        setproductQty(prevQty => (prevQty > 1 ? prevQty - 1 : 1));
    };

    // Fetch Categories
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const categoriesRef = ref(database, 'categories');
        onValue(categoriesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loadedCategories = Object.values(data).map(item => item.categoryName);
                setCategories(loadedCategories);
            }
        });
    }, []);

    // Add Product Category Chip State
    const [selectedCategoryChip, setSelectedCategoryChip] = useState("All");


    // Fetch products accordingly
    const [items, setItems] = useState([]);
    // -->> Fetch all data
    useEffect(() => {
        const itemsRef = ref(database, "items"); // Adjust "items" based on your Firebase node
        onValue(itemsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setItems(Object.values(data)); // Convert object to array and store
            } else {
                console.log("No items found.");
            }
        });
    }, []);
    // -->> Fetch data corresponding to category
    const handleCategorySelection = (category) => {
        setSelectedCategoryChip(category);

        const itemsRef = ref(database, "items");
        onValue(itemsRef, (snapshot) => {
            if (snapshot.exists()) {
                const allItems = Object.values(snapshot.val());
                if (category === "All") {
                    setItems(allItems); // Show all items
                } else {
                    const filteredItems = allItems.filter(item => item.itemCategory === category);
                    setItems(filteredItems); // Show items matching the category
                }
            }
        });
    };

    // ADD Product MODAL
    const [openAddProductModal, setOpenAddProductModal] = useState(false);
    const addproductModalOpen = () => setOpenAddProductModal(true);
    const addproductModalClose = () => setOpenAddProductModal(false);

    return (
        <div className='w-full max-w-full custom-scroll min-h-[585px] max-h-[585px] overflow-y-auto p-0 m-0'>
            <div className='grid gap-3 p-0 m-0 overflow-y-auto custom-scroll min-h-[585px] max-h-[585px] '>
                <Card className='flex flex-col gap-3 p-2.5 max-h-[580px]'>
                    <span className='h-fit w-full text-center h4 underline font-bold sticky top-0 z-10'>Generate Bill</span>
                    <div className='overflow-y-auto flex-1 custom-scroll'>
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
                                <div className='flex items-baseline gap-3'>
                                    <label className="h6">Add Product</label>
                                    <Button
                                        variant='contained'
                                        className=''
                                        size='small'
                                        style={{
                                            background: "#004385", borderRadius: "5px", fontSize: "1rem",
                                        }}
                                        onClick={addproductModalOpen}>
                                        Add product
                                    </Button>
                                </div>
                                <TableContainer sx={{ maxHeight: 560 }} className='border-2' >
                                    <Table stickyHeader aria-label="simple table" className='whitespace-nowrap'>
                                        <TableHead >
                                            <TableRow >
                                                <TableCell style={{ width: "15%", backgroundColor: "#454647", fontSize: "0.9rem", fontWeight: "600", color: "#fff" }} align="start"> Product ID </TableCell>
                                                <TableCell style={{ width: "30%", backgroundColor: "#454647", fontSize: "0.9rem", fontWeight: "600", color: "#fff" }} align="start"> Product Name </TableCell>
                                                <TableCell style={{ width: "20%", backgroundColor: "#454647", fontSize: "0.9rem", fontWeight: "600", color: "#fff" }} align="start"> Quantity </TableCell>
                                                <TableCell style={{ width: "17%", backgroundColor: "#454647", fontSize: "0.9rem", fontWeight: "600", color: "#fff" }} align="start"> Price </TableCell>
                                                <TableCell style={{ width: "17%", backgroundColor: "#454647", fontSize: "0.9rem", fontWeight: "600", color: "#fff" }} align="start"> Total </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow >
                                                <TableCell align="start">GR4691</TableCell>
                                                <TableCell component="th" scope="row">Natural Finish Kadappa Stone</TableCell>
                                                <TableCell align="start" className='p-0'>
                                                    <div className='w-fit m-0 p-1 !h-100 flex justify-items-start items-center gap-2'>
                                                        <IconButton className='!h-10 !w-10 rounded-md' sx={{ color: '#fff', backgroundColor: '#262524', '&:hover': { backgroundColor: '#353637' } }}
                                                            onClick={handleDecrement}>
                                                            <RemoveIcon />
                                                        </IconButton>
                                                        <TextField id="outlined-basic" size='small' fullWidth='false'
                                                            className='h-10 !w-16 !p-0 !m-0 items-center text-center'
                                                            variant="outlined"
                                                            type="number"
                                                            placeholder="Quantity"
                                                            value={productQty}
                                                            onChange={(e) => setproductQty(Math.max(1, Number(e.target.value)))}
                                                            required
                                                            InputProps={{
                                                                inputProps: { min: 1 },
                                                                // Disable up/down arrows
                                                                sx: {
                                                                    '& input': {
                                                                        textAlign: 'center', // Center-align text
                                                                    },
                                                                    '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                                                                        '-webkit-appearance': 'none',
                                                                        margin: 0,
                                                                    },
                                                                    '& input[type=number]': {
                                                                        '-moz-appearance': 'textfield',
                                                                    },
                                                                },
                                                            }}
                                                        />
                                                        <IconButton className='!h-10 !w-10 rounded-md' sx={{ color: '#fff', backgroundColor: '#004385', '&:hover': { backgroundColor: '#003366' } }}
                                                            onClick={handleIncrement}>
                                                            <AddIcon />
                                                        </IconButton>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="start">Dept</TableCell>
                                                <TableCell align="start">Shift</TableCell>
                                            </TableRow>
                                            <TableRow sx={{ height: "30px", minHeight: "30px", padding: 0 }}>
                                                <TableCell className='py-0 w-full px-0' colSpan={4} align="right">
                                                    <div className='grid'>
                                                        <span className='py-0 text-base font-bold'>Total Amount : </span>
                                                        <span className='py-0 text-base font-bold'>Discount Amount : </span>
                                                        <span className='py-0 text-base font-bold'>Final Amount : </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className='py-0' align="start">
                                                    <div className='grid'>
                                                        <span className='py-0 text-base font-normal'>₹ 0.00 /-</span>
                                                        <span className='py-0 text-base font-normal'>₹ 0.00 /-</span>
                                                        <span className='py-0 text-base font-normal'>₹ 0.00 /-</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
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

                            <Button
                                variant='contained'
                                className='col-span-2 py-2.5 mt-2'
                                size='medium'
                                style={{
                                    background: "#004385", borderRadius: "5px", fontSize: "1rem",
                                }}>
                                generate bill
                            </Button>

                        </form>
                    </div>
                </Card>
            </div>















            <Modal
                open={openAddProductModal} onClose={addproductModalClose}
                aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" >
                <Card
                    className='w-11/12' sx={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper', border: '1px outset #f5f5f5', boxShadow: 24, p: 3,
                    }}>
                    <header className='grid grid-flow-col justify-between items-center'>
                        <span></span>
                        <span className='font-bold h4 text-gray-950'>Products</span>
                        <CloseIcon sx={{ color: "red", fontSize: "25px", cursor: "pointer" }} onClick={addproductModalClose} />
                    </header>
                    <hr style={{ marginTop: 0, marginBottom: "10px" }} />

                    <div className='grid grid-flow-col justify-between items-center'>
                        <Stack direction="row" spacing={1.5} >
                            <Chip key="All" variant="outlined" label="&nbsp;&nbsp;All&nbsp;&nbsp;"
                                sx={{
                                    background: selectedCategoryChip === "All" ? "#004385" : "transparent",
                                    color: selectedCategoryChip === "All" ? "white" : "#004385",
                                    border: selectedCategoryChip === "All" ? "2.5px inset #004385" : "2.5px outset #004385",
                                    fontWeight: "500", letterSpacing: "0.5px", fontSize: "15px",
                                    cursor: "pointer", transition: "0.3s ease-in-out",
                                    "&:hover": {
                                        background: "#004385 !important",
                                        color: "white",
                                    },
                                }}
                                onClick={() => handleCategorySelection("All")}
                            />
                            {categories.map((name, index) => (
                                <Chip key={index} variant="outlined" label={name}
                                    sx={{
                                        background: selectedCategoryChip === name ? "#004385" : "transparent",
                                        color: selectedCategoryChip === name ? "white" : "#004385",
                                        border: selectedCategoryChip === name ? "2.5px inset #004385" : "2.5px outset #004385",
                                        fontWeight: "500", letterSpacing: "0.5px", fontSize: "15px",
                                        cursor: "pointer", transition: "0.3s ease-in-out",
                                        "&:hover": {
                                            background: "#004385 !important",
                                            color: "white",
                                        },
                                    }}
                                    onClick={() => handleCategorySelection(name)}
                                />
                            ))}
                        </Stack>

                    </div>

                    <div className=' mt-2 grid grid-cols-3 gap-3 p-0 overflow-y-auto custom-scroll max-h-[580px] pb-1'>

                        {items.map((item, index) => (
                            <Card key={index} className='flex gap-3 p-2.5 !bg-[#ffffff] border'>
                                <div className="w-44 h-100 flex-shrink-0 overflow-hidden rounded border">
                                    <img
                                        src={item.image}
                                        alt={item.categoryName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className='flex flex-col justify-between flex-grow'>
                                    <div className='flex m-0 p-0 justify-between'>
                                        <span className='text-sm font-normal text-gray-600'>{item.id} &nbsp;</span>
                                        <span className='text-sm text-gray-600'>Items in Stock : {item.itemQty}</span>
                                    </div>
                                    <span className='text-base font-bold w-full m-0 p-0'>{item.itemName}</span>
                                    <span className='text-sm font-bold w-full m-0 p-0 text-slate-800'>Category : <span className='text-sm font-normal'> {item.itemCategory}</span> </span>
                                    <span className='text-sm font-bold w-full m-0 p-0 text-slate-800'>Color : <span className='text-sm font-normal'> {item.itemColor}</span> </span>
                                    <span className='text-sm font-bold w-full m-0 p-0 text-slate-800'>Origin : <span className='text-sm font-normal'> {item.itemOrigin}</span> </span>
                                    <span className='text-sm font-bold w-full m-0 p-0 text-slate-800'>Appearance : <span className='text-sm font-normal'> {item.itemApperance}</span> </span>
                                    <span className='text-sm font-bold w-full m-0 p-0 text-slate-800'>Slab Thickness : <span className='text-sm font-normal'> {item.slabThickness}</span> </span>
                                    <span className='text-sm font-bold w-full m-0 p-0 text-slate-800'>Slab Size : <span className='text-sm font-normal'> {item.slabSize}</span> </span>
                                    <span className='text-sm font-bold w-full m-0 p-0 text-slate-800'>Applications : <span className='text-sm font-normal'> {item.comnApplication}</span> </span>
                                    <div className='mt-1 grid grid-flow-col items-center justify-between'>
                                        <span className='text-lg font-bold w-full m-0 p-0 text-blue-900'>₹ {Number(item.itemPrice).toFixed(2)}</span>
                                        <Button variant='contained' className='bg-[#004385] shadow-none' size='small'>
                                            Add product
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}

                    </div>

                </Card>
            </Modal>
























        </div>
    );
}

export default BillingsTab;
