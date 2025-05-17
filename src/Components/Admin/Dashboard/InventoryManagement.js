import { Button, Chip, Stack, TextField, Modal, Card, Avatar, InputAdornment, Select, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import React, { useEffect, useRef, useState } from 'react';
import InventoryTab from './InventoryTab';
import SuppliersTab from './SuppliersTab';
import PurchaseOrdersTab from './PurchaseOrdersTab';
import CategoriesTab from './CategoriesTab';
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { onValue, ref, set } from 'firebase/database';
import { database } from '../../../firebase';
import defaultItemImage from '../../../assets/images/addItemPlaceholder.png';
import defaultCategoryImage from '../../../assets/images/addCategoryPlaceholder.png';
dayjs.extend(utc);
dayjs.extend(timezone);

const InventoryManagement = () => {

    // Select inventory Tab
    const [selectedInventoryScreen, setselectedInventoryScreen] = useState("Inventory");

    // ADD Category MODAL
    const [openAddCatModal, setOpenAddCatModal] = useState(false);
    const addCatModalOpen = () => setOpenAddCatModal(true);
    const addCatModalClose = () => setOpenAddCatModal(false);

    // ADD Category MODAL
    const [openAddItemModal, setOpenAddItemModal] = useState(false);
    const addItemModalOpen = () => setOpenAddItemModal(true);
    const addItemModalClose = () => setOpenAddItemModal(false);

    // Image Selection and Upload
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Values to store
    const [itemName, setitemName] = useState("");
    const [itemColor, setitemColor] = useState("");
    const [itemCategory, setitemCategory] = useState("");
    const [itemOrigin, setitemOrigin] = useState("");
    const [itemApperance, setitemApperance] = useState("");
    const [slabThickness, setslabThickness] = useState("");
    const [slabSize, setslabSize] = useState("");
    const [itemQty, setitemQty] = useState("");
    const [comnApplication, setcomnApplication] = useState("");

    // Generate Category ID
    const generateCategoryId = () => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const randomLetters = letters.charAt(Math.floor(Math.random() * 26)) + letters.charAt(Math.floor(Math.random() * 26));
        const randomDigits = Math.floor(Math.random() * 9999 + 1).toString().padStart(4, '0');
        return randomLetters + randomDigits;
    };


    const handleAddItem = () => {
        if (!itemName || !selectedImage || !itemColor || !itemOrigin || !itemApperance || !slabThickness || !slabSize || !comnApplication || !itemQty) {
            alert("Please provide a proper item details.");
            return;
        }

        const generatedId = generateCategoryId();
        const timeStamp = dayjs().tz("Asia/Kolkata").format("DD MMMM YYYY [at] HH:mm:ss [UTC+5:30]");

        const itemData = {
            id: generatedId,
            itemName: itemName,
            itemColor: itemColor,
            itemCategory: itemCategory,
            itemOrigin: itemOrigin,
            itemApperance: itemApperance,
            slabThickness: slabThickness,
            slabSize: slabSize,
            itemQty: itemQty,
            comnApplication: comnApplication,
            image: selectedImage,
            created_time: timeStamp
        };

        const itemRef = ref(database, `items/${generatedId}`);

        set(itemRef, itemData)
            .then(() => {
                alert("Item added successfully.");
                setitemName("");
                setitemCategory("");
                setitemColor("");
                setitemOrigin("");
                setitemApperance("");
                setslabThickness("");
                setslabSize("");
                setitemQty("");
                setcomnApplication("");
                setSelectedImage(null);
            })
            .catch((error) => {
                console.error("Error adding item:", error);
                alert("Failed to add item.");
            });
    };


    const [categoryName, setCategoryName] = useState("");

    const handleAddCategory = () => {
        if (!categoryName || !selectedImage) {
            alert("Please provide a proper category details.");
            return;
        }

        const generatedId = generateCategoryId();
        const timeStamp = dayjs().tz("Asia/Kolkata").format("DD MMMM YYYY [at] HH:mm:ss [UTC+5:30]");

        const categoryData = {
            id: generatedId,
            categoryName: categoryName,
            image: selectedImage,
            created_time: timeStamp
        };

        const categoryRef = ref(database, `categories/${generatedId}`);

        set(categoryRef, categoryData)
            .then(() => {
                alert("Category added successfully.");
                setCategoryName("");
                setSelectedImage(null);
            })
            .catch((error) => {
                console.error("Error adding category:", error);
                alert("Failed to add category.");
            });
    };

    const [availableRoles, setAvailableRoles] = useState([]);
    // const [role, setRole] = useState("");

    useEffect(() => {
        const categoriesRef = ref(database, 'categories/');
        onValue(categoriesRef, (snapshot) => {
            const data = snapshot.val();
            const roles = [];

            if (data) {
                Object.keys(data).forEach((key) => {
                    if (data[key].categoryName) {
                        roles.push(data[key].categoryName);
                    }
                });
            }

            setAvailableRoles(roles);
        });
    }, []);




    // ADD Category MODAL
    const [openAddSupplierModal, setOpenAddSupplierModal] = useState(false);
    const addSupplierModalOpen = () => setOpenAddSupplierModal(true);
    const addSupplierModalClose = () => setOpenAddSupplierModal(false);

    const [supplier, setSupplier] = useState({
        businessName: "",
        ownerName: "",
        address: "",
        phoneNumber: "",
        dealsIn: [],
        gstin: "",
        previousTransactions: "",
        lastSuppliedItem: ""
    });

    const handleAddSupplier = async () => {
        try {
            await set(ref(database, `suppliers/${supplier.businessName}`), supplier);
            setOpenAddSupplierModal(false);
            alert("Supplier added successfully.");
            setSupplier({ /* reset form */ });
        } catch (error) {
            alert.error("Error adding supplier");
        }
    };



    // SEARCH QUERY STATE
    const [searchQuery, setSearchQuery] = useState('');



    return (
        <div style={{ fontFamily: "Roboto" }} className='grid gap-y-4'>

            <span className='font-semibold text-2xl m-0 p-0' style={{ color: "#252627" }}>Inventory Management</span>

            <div className='grid grid-flow-col justify-between items-center'>
                <Stack direction="row" spacing={1.5} >
                    <Chip variant='outlined'
                        label='Categories'
                        sx={{
                            background: selectedInventoryScreen === "Categories" ? "#004385" : "transparent",
                            color: selectedInventoryScreen === "Categories" ? "white" : "#004385",
                            border: selectedInventoryScreen === "Categories" ? "2.5px inset #004385" : "2.5px outset #004385",
                            fontWeight: "500", letterSpacing: "0.5px",
                            cursor: "pointer", transition: "0.3s ease-in-out",
                            "&:hover": {
                                background: "#004385 !important",
                                color: "white",
                            },
                        }}
                        onClick={() => setselectedInventoryScreen("Categories")}
                    />
                    <Chip variant='outlined'
                        label='Inventory'
                        sx={{
                            background: selectedInventoryScreen === "Inventory" ? "#004385" : "transparent",
                            color: selectedInventoryScreen === "Inventory" ? "white" : "#004385",
                            border: selectedInventoryScreen === "Inventory" ? "2.5px inset #004385" : "2.5px outset #004385",
                            fontWeight: "500", letterSpacing: "0.5px",
                            cursor: "pointer", transition: "0.3s ease-in-out",
                            "&:hover": {
                                background: "#004385 !important",
                                color: "white",
                            },
                        }}
                        onClick={() => setselectedInventoryScreen("Inventory")}
                    />
                    <Chip variant='outlined'
                        label='Suppliers'
                        sx={{
                            background: selectedInventoryScreen === "Suppliers" ? "#004385" : "transparent",
                            color: selectedInventoryScreen === "Suppliers" ? "white" : "#004385",
                            border: selectedInventoryScreen === "Suppliers" ? "2.5px inset #004385" : "2.5px outset #004385",
                            fontWeight: "500", letterSpacing: "0.5px",
                            cursor: "pointer", transition: "0.3s ease-in-out",
                            "&:hover": {
                                background: "#004385 !important",
                                color: "white",
                            },
                        }}
                        onClick={() => setselectedInventoryScreen("Suppliers")}
                    />
                    <Chip variant='outlined'
                        label='Purchase Orders'
                        sx={{
                            background: selectedInventoryScreen === "Purchase Orders" ? "#004385" : "transparent",
                            color: selectedInventoryScreen === "Purchase Orders" ? "white" : "#004385",
                            border: selectedInventoryScreen === "Purchase Orders" ? "2.5px inset #004385" : "2.5px outset #004385",
                            fontWeight: "500", letterSpacing: "0.5px",
                            cursor: "pointer", transition: "0.3s ease-in-out",
                            "&:hover": {
                                background: "#004385 !important",
                                color: "white",
                            },
                        }}
                        onClick={() => setselectedInventoryScreen("Purchase Orders")}
                    />

                </Stack>
                {selectedInventoryScreen === "Categories" &&
                    <div className='gap-x-5 grid grid-flow-col'>

                        <Button variant='contained' size='medium' className='!py-2'
                            style={{
                                background: "#004385", borderRadius: "5px", padding: "0 2rem"
                            }}
                            onClick={addCatModalOpen}>Add Category</Button>
                    </div>
                }
                {selectedInventoryScreen === "Inventory" &&
                    <div className='gap-x-5 grid grid-flow-col'>

                        <TextField
                            variant="outlined"
                            type="text"
                            placeholder="Search here..."
                            size='small'
                            className='w-72'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <SearchIcon />
                                    </InputAdornment>
                                )
                            }} />

                        <Button variant='contained' size='medium' className='!py-2'
                            style={{
                                background: "#004385", borderRadius: "5px", padding: "0 2rem"
                            }}
                            onClick={addItemModalOpen}>Add Item</Button>
                    </div>
                }
                {selectedInventoryScreen === "Suppliers" &&
                    <div className='gap-x-5 grid grid-flow-col'>

                        <Button variant='contained' size='medium' className='!py-2'
                            style={{
                                background: "#004385", borderRadius: "5px", padding: "0 2rem"
                            }}
                            onClick={addSupplierModalOpen}>Add Suppliers</Button>
                    </div>
                }
            </div>

            <div className="inventory">

                {selectedInventoryScreen === "Inventory" &&
                    <InventoryTab searchQuery={searchQuery} />
                }

                {selectedInventoryScreen === "Suppliers" &&
                    <SuppliersTab />
                }

                {selectedInventoryScreen === "Purchase Orders" &&
                    <PurchaseOrdersTab />
                }
                {/* 
                {selectedInventoryScreen === "Stock Alerts" &&
                    <StockAlertsTab />
                } */}

                {selectedInventoryScreen === "Categories" &&
                    <CategoriesTab />
                }

            </div>

            {/* ADD CATEGORY MODAL */}
            <Modal
                open={openAddCatModal}
                onClose={addCatModalClose}
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
                        <span className='font-bold h2 text-gray-950'>Add Category</span>
                        <CloseIcon sx={{ color: "red", fontSize: "30px", cursor: "pointer" }} onClick={addCatModalClose} />
                    </header>
                    <hr />

                    <form onSubmit={(e) => e.preventDefault()}
                        className='grid grid-cols-2 gap-x-5 gap-y-5 items-center'>

                        <div className='col-span-2 flex items-center justify-center'>
                            <Avatar
                                onClick={handleAvatarClick}
                                src={selectedImage || defaultCategoryImage}
                                className='rounded-md'
                                sx={{ width: 100, height: 100 }} />
                            <input type='file' accept='image/*'
                                ref={fileInputRef} onChange={handleImageChange}
                                style={{ display: "none" }} required />
                        </div>

                        <div className='flex col-span-2 flex-col'>
                            <label className="h6">Category Name</label>
                            <TextField id="outlined-basic"
                                variant="outlined"
                                type="text"
                                placeholder="Enter Category name"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                required
                            />
                        </div>

                        <Button
                            onClick={handleAddCategory}
                            variant='contained'
                            className='col-span-2 py-2.5 mt-2'
                            size='medium'
                            style={{
                                background: "#004385", borderRadius: "5px", fontSize: "1rem",
                            }}>
                            Add Category
                        </Button>

                    </form>
                </Card>
            </Modal>


            {/* ADD Item MODAL */}
            <Modal
                open={openAddItemModal}
                onClose={addItemModalClose}
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
                        <span className='font-bold h2 text-gray-950'>Add Item</span>
                        <CloseIcon sx={{ color: "red", fontSize: "30px", cursor: "pointer" }} onClick={addItemModalClose} />
                    </header>
                    <hr />

                    <form onSubmit={(e) => e.preventDefault()}
                        className='grid grid-cols-2 gap-x-5 gap-y-3 items-center'>

                        <div className='col-span-2 flex items-center justify-center'>
                            <Avatar
                                onClick={handleAvatarClick}
                                src={selectedImage || defaultItemImage}
                                className='!rounded-md'
                                sx={{ width: 100, height: 100 }} />
                            <input type='file' accept='image/*'
                                ref={fileInputRef} onChange={handleImageChange}
                                style={{ display: "none" }} required />
                        </div>

                        <div className='flex flex-col'>
                            <label className="h6">Item Name</label>
                            <TextField id="outlined-basic"
                                variant="outlined"
                                type="text"
                                placeholder="Enter Item name"
                                value={itemName}
                                onChange={(e) => setitemName(e.target.value)}
                                required
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className="h6">Item Category</label>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select" required
                                variant='outlined'
                                value={itemCategory}
                                onChange={(e) => setitemCategory(e.target.value)}
                                renderValue={(selected) => selected || "Select Category"}
                                displayEmpty
                            >
                                {availableRoles.length > 0 ? (
                                    availableRoles.map((roleName) => (
                                        <MenuItem key={roleName} value={roleName}>
                                            {roleName}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>No Category available</MenuItem>
                                )}
                            </Select>
                        </div>

                        <div className='flex flex-col'>
                            <label className="h6">Item Color</label>
                            <TextField id="outlined-basic"
                                variant="outlined"
                                type="text"
                                placeholder="Enter Item color"
                                value={itemColor}
                                onChange={(e) => setitemColor(e.target.value)}
                                required
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className="h6">Item Origin</label>
                            <TextField id="outlined-basic"
                                variant="outlined"
                                type="text"
                                placeholder="Enter Item origin"
                                value={itemOrigin}
                                onChange={(e) => setitemOrigin(e.target.value)}
                                required
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className="h6">Item Apperance</label>
                            <TextField id="outlined-basic"
                                variant="outlined"
                                type="text"
                                placeholder="Enter Item Apperance"
                                value={itemApperance}
                                onChange={(e) => setitemApperance(e.target.value)}
                                required
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className="h6">Common Applications</label>
                            <TextField id="outlined-basic"
                                variant="outlined"
                                type="text"
                                placeholder="Enter common applications"
                                value={comnApplication}
                                onChange={(e) => setcomnApplication(e.target.value)}
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
                                    value={slabThickness}
                                    onChange={(e) => setslabThickness(e.target.value)}
                                    required
                                />
                            </div>

                            <div className='flex flex-col'>
                                <label className="h6">Slab Size</label>
                                <TextField id="outlined-basic"
                                    variant="outlined"
                                    type="text"
                                    placeholder="Enter Slab size"
                                    value={slabSize}
                                    onChange={(e) => setslabSize(e.target.value)}
                                    required
                                />
                            </div>

                            <div className='flex flex-col'>
                                <label className="h6">Item Quantity</label>
                                <TextField id="outlined-basic"
                                    variant="outlined"
                                    type="text"
                                    placeholder="Enter Item Quantity"
                                    value={itemQty}
                                    onChange={(e) => setitemQty(e.target.value)}
                                    required
                                />
                            </div>

                        </div>




                        <Button
                            onClick={handleAddItem}
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



            {/* ADD SUPPLIER */}

            <Modal open={openAddSupplierModal} onClose={addSupplierModalClose}>
                <Card
                    className='w-2/5'
                    sx={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper', boxShadow: 24, p: 4,
                    }}>
                    <header className='grid grid-flow-col justify-between items-center mb-4'>
                        <span></span>
                        <span className='font-bold text-3xl text-gray-900'>Add Supplier</span>
                        <CloseIcon sx={{ color: "red", fontSize: "28px", cursor: "pointer" }} onClick={addSupplierModalClose} />
                    </header>
                    <form onSubmit={(e) => e.preventDefault()} className='grid gap-4 grid-cols-2'>
                        <TextField
                            label="Business Name"
                            variant="outlined"
                            fullWidth
                            value={supplier.businessName}
                            onChange={(e) => setSupplier({ ...supplier, businessName: e.target.value })}
                            required
                        />
                        <TextField
                            label="Owner Name"
                            type="email"
                            variant="outlined"
                            fullWidth
                            value={supplier.ownerName}
                            onChange={(e) => setSupplier({ ...supplier, ownerName: e.target.value })}
                        />
                        <TextField
                            label="Address"
                            variant="outlined"
                            fullWidth
                            value={supplier.address} onChange={(e) => setSupplier({ ...supplier, address: e.target.value })}
                        />
                        <TextField
                            label="Phone Number"
                            variant="outlined"
                            fullWidth
                            value={supplier.phoneNumber} onChange={(e) => setSupplier({ ...supplier, phoneNumber: e.target.value })}
                        />

                        <TextField
                            label="Deals In (comma separated)"
                            variant="outlined"
                            fullWidth
                            value={supplier.dealsIn.join(", ")} onChange={(e) => setSupplier({ ...supplier, dealsIn: e.target.value.split(",").map(i => i.trim()) })}
                        />

                        <TextField
                            label="GSTIN"
                            variant="outlined"
                            fullWidth
                            value={supplier.gstin} onChange={(e) => setSupplier({ ...supplier, gstin: e.target.value })}
                        />

                        <TextField
                            label="Previous Transactions"
                            variant="outlined"
                            fullWidth
                            value={supplier.previousTransactions} onChange={(e) => setSupplier({ ...supplier, previousTransactions: e.target.value })}
                        />

                        <TextField
                            label="Last Supplied Item"
                            variant="outlined"
                            fullWidth
                            value={supplier.lastSuppliedItem} onChange={(e) => setSupplier({ ...supplier, lastSuppliedItem: e.target.value })}
                        />

                        <Button
                            onClick={handleAddSupplier}
                            variant="contained"
                            className='col-span-2 py-2'
                            style={{ backgroundColor: "#004385", color: "#fff", fontWeight: 600 }}
                        >
                            Add Supplier
                        </Button>
                    </form>
                </Card>
            </Modal>


        </div>

    );
}

export default InventoryManagement;
