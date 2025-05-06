import { Avatar, Card, IconButton, Modal, Select, TextField, MenuItem, Button } from '@mui/material';
import { onValue, ref, remove, update } from 'firebase/database';
import React, { useEffect, useRef, useState } from 'react';
import { database } from '../../../firebase';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import CloseIcon from '@mui/icons-material/Close';


const InventoryTab = () => {

    const [items, setItems] = useState([]);

    useEffect(() => {
        const itemsRef = ref(database, 'items');
        onValue(itemsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const categoryArray = Object.values(data);
                setItems(categoryArray);
            }
        });
    }, []);








    const [itemName, setitemName] = useState("");
    const [itemColor, setitemColor] = useState("");
    const [itemCategory, setitemCategory] = useState("");
    const [itemOrigin, setitemOrigin] = useState("");
    const [itemApperance, setitemApperance] = useState("");
    const [slabThickness, setslabThickness] = useState("");
    const [slabSize, setslabSize] = useState("");
    const [itemQty, setitemQty] = useState("");
    const [comnApplication, setcomnApplication] = useState("");

    // EDIT CATEGORY MODAL
    const [openeditItemModal, setopeneditItemModal] = useState(false);
    const editItemModalClose = () => setopeneditItemModal(false);

    // Selected Item for edit
    const [selectedItem, setSelectedItem] = useState(null);

    const editItemModalOpen = (item) => {
        setSelectedItem(item);
        setSelectedImage(item.image);
        setitemName(item.itemName);
        setitemCategory(item.itemCategory);
        setitemColor(item.itemColor);
        setitemOrigin(item.itemOrigin);
        setitemApperance(item.itemApperance);
        setslabThickness(item.slabThickness);
        setslabSize(item.slabSize);
        setitemQty(item.itemQty)
        setcomnApplication(item.comnApplication);
        setopeneditItemModal(true);
    };

    // EDIT Employee Data
    const handleEditItem = async () => {
        if (!selectedItem?.id) {
            alert("No Item selected.");
            return;
        }

        const userRef = ref(database, `items/${selectedItem.id}`);

        const updatedData = {
            itemName: itemName,
            itemCategory: itemCategory,
            itemColor: itemColor,
            itemOrigin: itemOrigin,
            itemApperance: itemApperance,
            slabThickness: slabThickness,
            slabSize: slabSize,
            itemQty: itemQty,
            comnApplication: comnApplication,
            image: selectedImage || "", // keep empty if not updated
        };

        try {
            await update(userRef, updatedData);
            alert("Item updated successfully!");
            editItemModalClose(); // close the modal
        } catch (error) {
            console.error("Error updating item:", error);
            alert("Failed to update item.");
        }
    };


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


    // Detele item 
    const handleDeleteItem = (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            const userRef = ref(database, `items/${id}`);
            remove(userRef)
                .then(() => {
                    console.log("Item deleted successfully!");
                })
                .catch((error) => {
                    console.error("Error deleting item: ", error);
                });
        }
    };



    return (
        <div className='w-full max-w-full custom-scroll max-h-[585px] overflow-y-auto'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-3 p-0 overflow-y-auto custom-scroll max-h-[580px] pb-1'>
                {items.map((item, index) => (
                    <Card key={index} className='flex gap-3 p-2.5'>
                        <div className="w-50 h-100 flex-shrink-0 overflow-hidden rounded border">
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
                            <span className='text-lg font-bold w-full mt-1'>{item.itemName}</span>
                            <span className='text-base font-bold w-full text-slate-800'>Category : <span className='text-sm font-normal'> {item.itemCategory}</span> </span>
                            <span className='text-base font-bold w-full text-slate-800'>Color : <span className='text-sm font-normal'> {item.itemColor}</span> </span>
                            <span className='text-base font-bold w-full text-slate-800'>Origin : <span className='text-sm font-normal'> {item.itemOrigin}</span> </span>
                            <span className='text-base font-bold w-full text-slate-800'>Appearance : <span className='text-sm font-normal'> {item.itemApperance}</span> </span>
                            <span className='text-base font-bold w-full text-slate-800'>Slab Thickness : <span className='text-sm font-normal'> {item.slabThickness}</span> </span>
                            <span className='text-base font-bold w-full text-slate-800'>Slab Size : <span className='text-sm font-normal'> {item.slabSize}</span> </span>
                            <span className='text-base font-bold w-full text-slate-800'>Applications : <span className='text-sm font-normal'> {item.comnApplication}</span> </span>
                            <div className='flex justify-between items-center mt-0'>
                                <div className='grid grid-flow-col grid-cols-2 w-full gap-x-3 mt-1'>

                                    <Button className='!h-9 rounded-md'
                                        sx={{ color: '#fff', backgroundColor: '#004385', '&:hover': { backgroundColor: '#003366' } }}
                                        onClick={() => editItemModalOpen(item)}>
                                        <EditSquareIcon />
                                        &nbsp;&nbsp;Edit
                                    </Button>

                                    <Button className='!h-9 rounded-md'
                                        sx={{ color: '#fff', backgroundColor: '#262524', '&:hover': { backgroundColor: '#353637' } }}
                                        onClick={() => handleDeleteItem(item.id)}>
                                        <DeleteForeverIcon />
                                        &nbsp;&nbsp;Delete
                                    </Button>

                                    {/* <IconButton className='!h-9 rounded-md'
                                        sx={{ color: '#fff', backgroundColor: '#004385', '&:hover': { backgroundColor: '#003366' } }}
                                        onClick={() => editItemModalOpen(item)}>
                                        <EditSquareIcon />
                                    </IconButton>

                                    <IconButton className='!h-9 rounded-md'
                                        sx={{ color: '#fff', backgroundColor: '#262524', '&:hover': { backgroundColor: '#353637' } }}
                                        onClick={() => handleDeleteItem(item.id)}>
                                        <DeleteForeverIcon />
                                    </IconButton> */}

                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Edit Item MODAL */}
            <Modal
                open={openeditItemModal}
                onClose={editItemModalClose}
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
                        <span className='font-bold h2 text-gray-950'>Edit Item</span>
                        <CloseIcon sx={{ color: "red", fontSize: "30px", cursor: "pointer" }} onClick={editItemModalClose} />
                    </header>
                    <hr />

                    <form onSubmit={(e) => e.preventDefault()}
                        className='grid grid-cols-2 gap-x-5 gap-y-3 items-center'>

                        <div className='col-span-2 flex items-center justify-center'>
                            <Avatar
                                onClick={handleAvatarClick}
                                src={selectedImage}
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
                            onClick={handleEditItem}
                            variant='contained'
                            className='col-span-2 py-2.5 mt-2'
                            size='medium'
                            style={{
                                background: "#004385", borderRadius: "5px", fontSize: "1rem",
                            }}>
                            Edit Item
                        </Button>

                    </form>
                </Card>
            </Modal>

        </div>
    );
}

export default InventoryTab;
