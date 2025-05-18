import { Button, Card, Chip, IconButton, MenuItem, Modal, Select, Stack, TextField } from '@mui/material';
import { TableContainer, Table, TableHead, TableRow, TableBody, TableCell } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react';
import { get, onValue, push, ref, set, update } from 'firebase/database';
import { database } from '../../../firebase';
import dayjs from 'dayjs';   // handy for formatting dates

const BillingsTab = () => {

    // VALUES TO ADD
    const [customerName, setCustomerName] = useState();
    const [customerContact, setCustomerContact] = useState();
    // const [productQty, setproductQty] = useState(1);

    const handleIncrement = (id) => {
        setSelectedProducts((prev) =>
            prev.map((product) =>
                product.id === id ? { ...product, quantity: product.quantity + 1 } : product
            )
        );
    };

    const handleDecrement = (id) => {
        setSelectedProducts((prev) =>
            prev.map((product) =>
                product.id === id ? { ...product, quantity: Math.max(1, product.quantity - 1) } : product
            )
        );
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

    // Selected Product State
    const [selectedProducts, setSelectedProducts] = useState([]);

    // Add Product button -->> Modal
    const handleAddProduct = (product) => {
        setSelectedProducts((prev) => [...prev, { ...product, quantity: 1 }]); // Default quantity
    };


    const handleQuantityChange = (id, value) => {
        setSelectedProducts((prev) =>
            prev.map((product) =>
                product.id === id ? { ...product, quantity: Math.min(product.itemQty, Math.max(1, value)) } : product
            )
        );
    };

    // Get Discount
    const [discount, setDiscount] = useState(0);

    const fetchDiscount = async () => {
        try {
            const snapshot = await get(ref(database, "settings/discount"));
            if (snapshot.exists()) {
                setDiscount(snapshot.val()); // Save discount in state
            } else {
                console.log("No discount data found");
                setDiscount(0); // Default value
            }
        } catch (error) {
            console.error("Error fetching discount:", error);
            setDiscount(0);
        }
    };

    // Calculate Total Amount
    const totalAmount = selectedProducts.reduce((sum, product) => sum + (product.quantity * product.itemPrice), 0);
    fetchDiscount();
    const discountAmount = (totalAmount * discount) / 100;
    const finalAmount = totalAmount - discountAmount;

    // Mode Of Payment Selection Code
    const [modeOfPay, setModeOfPay] = useState("");
    const handleModeOfPayChange = (event) => {
        setModeOfPay(event.target.value);
    };

    // Payment Status Code
    const [paymentStatus, setPaymentStatus] = useState("");
    const handlePayStatus = (event) => {
        setPaymentStatus(event.target.value);
    };


    // Add sales to DB

    const generateOrderID = () => {
        const prefix = "ORD";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let randomPart = "";
        for (let i = 0; i < 10; i++) {
            randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return prefix + randomPart;
    };


    const handleGenerateBill = async () => {
        try {
            /* ---------- build the record ---------- */
            const saleRef = push(ref(database, 'sales'));     //  /sales/<autoKey>
            const orderID = generateOrderID();  // Use custom generator
            const invoiceNumber = `INV${dayjs().format('YYMMDD')}-${orderID.slice(-6)}`;

            const saleData = {
                /* customer */
                customerName,
                customerContact,

                /* meta */
                orderID,
                invoiceNumber,
                purchaseDate: dayjs().toISOString(),        // or  Date.now()

                /* line items */
                products: selectedProducts.map(p => ({
                    productID: p.id,
                    productName: p.itemName,
                    productQty: p.quantity,
                    productUnitPrice: p.itemPrice,
                    productTotalPrice: +(p.quantity * p.itemPrice).toFixed(2)
                })),

                /* totals */
                allProductTotalPrice: +totalAmount.toFixed(2),
                discountPercentage: discount,
                discountAmount: +discountAmount.toFixed(2),
                finalTotalPrice: +finalAmount.toFixed(2),

                /* payment */
                paymentMode: modeOfPay,
                paymentStatus
            };

            /* ---------- write to RTDB ---------- */
            await set(saleRef, saleData);   // you can also do push(ref(...), saleData)

            await updateProductQuantities();  // update quantities

            /* ---------- post-save UX ---------- */
            alert('Invoice saved ✔');
            resetForm();                    // clear local state, close modal, etc.
        } catch (e) {
            console.error(e);
            alert('Failed to save invoice ❌');
        }
    };

    const resetForm = () => {
        setCustomerName('');
        setCustomerContact('');
        setSelectedProducts([]); // or initialProducts if applicable
        setDiscount(0);
        setModeOfPay('');
        setPaymentStatus('');
    };

    const updateProductQuantities = async () => {
        for (const product of selectedProducts) {
            const productRef = ref(database, `items/${product.id}`);
            const snapshot = await get(productRef);
            if (snapshot.exists()) {
                const currentQty = snapshot.val().itemQty || 0;
                const newQty = currentQty - product.quantity;
                if (newQty >= 0) {
                    await update(productRef, { itemQty: newQty });
                } else {
                    console.warn(`Product ${product.id} has insufficient stock.`);
                }
            } else {
                console.warn(`Product ${product.id} not found in database.`);
            }
        }
    };


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
                                            {selectedProducts.map((product, index) => (
                                                <TableRow key={index} >
                                                    <TableCell align="start">{product.id}</TableCell>
                                                    <TableCell component="th" scope="row">{product.itemName}</TableCell>
                                                    <TableCell align="start" className='p-0'>
                                                        <div className='w-fit m-0 p-1 !h-100 flex justify-items-start items-center gap-2'>
                                                            <IconButton className='!h-10 !w-10 rounded-md' sx={{ color: '#fff', backgroundColor: '#262524', '&:hover': { backgroundColor: '#353637' } }}
                                                                onClick={() => handleDecrement(product.id)}>
                                                                <RemoveIcon />
                                                            </IconButton>
                                                            <TextField id="outlined-basic" size='small' fullWidth='false'
                                                                className='h-10 !w-16 !p-0 !m-0 items-center text-center'
                                                                variant="outlined"
                                                                type="number"
                                                                placeholder="Quantity"
                                                                value={product.quantity} // Use product's specific quantity
                                                                onChange={(e) => handleQuantityChange(product.id, Math.min(product.itemQty, Math.max(1, Number(e.target.value))))}
                                                                required
                                                                InputProps={{
                                                                    inputProps: { min: 1, max: product.itemQty },
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
                                                                onClick={() => handleIncrement(product.id)}>
                                                                <AddIcon />
                                                            </IconButton>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align="start">₹ {product.itemPrice}</TableCell>
                                                    <TableCell align="start">₹ {(product.quantity * product.itemPrice).toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow sx={{ height: "30px", minHeight: "30px", padding: 0 }}>
                                                <TableCell className='py-0 w-full px-0' colSpan={4} align="right">
                                                    <div className='grid'>
                                                        <span className='py-0 text-base font-bold'>Total Amount : </span>
                                                        <span className='py-0 text-base font-bold'>Discount &#91;{discount}%&#93; : </span>
                                                        <span className='py-0 text-base font-bold'>Final Amount : </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className='py-0' align="start">
                                                    <div className='grid'>
                                                        <span className='py-0 text-base font-normal'>₹ {totalAmount.toFixed(2)} </span>
                                                        <span className='py-0 text-base font-normal'>₹ {discountAmount.toFixed(2)} </span>
                                                        <span className='py-0 text-base font-normal'>₹ {finalAmount.toFixed(2)} </span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>

                            <div className='flex flex-col'>
                                <label className="h6">Mode of Payment</label>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    variant='outlined' required
                                    value={modeOfPay}
                                    onChange={handleModeOfPayChange}
                                    renderValue={(selected) => selected || "Select Mode Of Payment"}
                                    displayEmpty
                                >
                                    {/* <MenuItem value="">Select role</MenuItem> */}
                                    <MenuItem value={"Cash"}>Cash</MenuItem>
                                    <MenuItem value={"UPI"}>UPI</MenuItem>
                                    <MenuItem value={"Credit/Debit Card"}>Credit/Debit Card</MenuItem>
                                </Select>
                            </div>

                            <div className='flex flex-col'>
                                <label className="h6">Payment Status</label>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    variant='outlined' required
                                    value={paymentStatus}
                                    onChange={handlePayStatus}
                                    renderValue={(selected) => selected || "Payment Status"}
                                    displayEmpty
                                >
                                    {/* <MenuItem value="">Select role</MenuItem> */}
                                    <MenuItem value={"Paid"}>Paid</MenuItem>
                                    <MenuItem value={"Partial"}>Partial</MenuItem>
                                    <MenuItem value={"Pending"}>Pending</MenuItem>
                                </Select>
                            </div>

                            <Button
                                variant='contained'
                                className='col-span-2 py-2.5 mt-2'
                                size='medium'
                                style={{ background: "#004385", borderRadius: "5px", fontSize: "1rem", }} onClick={handleGenerateBill}  >
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
                                        <Button variant='contained' className='bg-[#004385] shadow-none' size='small' onClick={() => handleAddProduct(item)}>
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
