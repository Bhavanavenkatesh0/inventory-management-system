import { Avatar, Card, IconButton, Modal, Button, TextField } from '@mui/material';
import { onValue, ref, remove, update } from 'firebase/database';
import React, { useEffect, useRef, useState } from 'react';
import { database } from '../../../firebase';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import CloseIcon from '@mui/icons-material/Close';

const CategoriesTab = () => {

    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState("");


    // EDIT CATEGORY MODAL
    const [openeditCatModal, setopeneditCatModal] = useState(false);
    const editCatModalClose = () => setopeneditCatModal(false);

    // Selected category for edit
    const [selectedCat, setSelectedCat] = useState(null);

    const editCatModalOpen = (category) => {
        setSelectedCat(category);
        setCategoryName(category.categoryName);
        setSelectedImage(category.image);
        setopeneditCatModal(true);
    };

    // EDIT Employee Data
    const handleEditCat = async () => {
        if (!selectedCat?.id) {
            alert("No Category selected.");
            return;
        }

        const userRef = ref(database, `categories/${selectedCat.id}`);

        const updatedData = {
            categoryName: categoryName,
            image: selectedImage || "", // keep empty if not updated
        };

        try {
            await update(userRef, updatedData);
            alert("Category updated successfully!");
            editCatModalClose(); // close the modal
        } catch (error) {
            console.error("Error updating category:", error);
            alert("Failed to update category.");
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

    useEffect(() => {
        const categoriesRef = ref(database, 'categories');
        onValue(categoriesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const categoryArray = Object.values(data);
                setCategories(categoryArray);
            }
        });
    }, []);


    // Detele Category 
    const handleDeleteCat = (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            const userRef = ref(database, `categories/${id}`);
            remove(userRef)
                .then(() => {
                    console.log("Category deleted successfully!");
                })
                .catch((error) => {
                    console.error("Error deleting category: ", error);
                });
        }
    };


    // SUM OF ITEMS IN EACH CATEGORY

    const [categoryStock, setCategoryStock] = useState();

    useEffect(() => {
        const categoriesRef = ref(database, 'categories');
        const itemsRef = ref(database, 'items');

        // Fetch categories
        onValue(categoriesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const categoryArray = Object.values(data);
                setCategories(categoryArray);
            }
        });

        // Fetch items and calculate total stock for each category
        onValue(itemsRef, (snapshot) => {
            const data = snapshot.val();
            const stockMap = {};

            if (data) {
                Object.values(data).forEach(item => {
                    const category = item.itemCategory;
                    const qty = parseInt(item.itemQty) || 0;

                    if (!stockMap[category]) {
                        stockMap[category] = 0;
                    }
                    stockMap[category] += qty;
                });
            }

            setCategoryStock(stockMap);
        });
    }, []);



    return (
        <div className='w-full max-w-full custom-scroll max-h-[585px] overflow-y-auto'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-0 overflow-y-auto custom-scroll max-h-[580px] pb-1'>
                {categories.map((category, index) => (
                    <Card key={index} className='p-2.5 grid grid-flow-row gap-y-1'>
                        <div className="relative w-full pb-[100%] overflow-hidden rounded mb-2">
                            <img
                                src={category.image}
                                alt={category.categoryName}
                                className="absolute top-0 left-0 w-full h-full object-cover"
                            />
                        </div>
                        <div className='flex flex-col gap-y-'>
                            <span className='text-sm font-normal text-gray-600'>{category.id}</span>
                            <span className='text-lg font-bold w-full'>{category.categoryName}</span>
                            <div className='flex justify-between items-center'>
                                <span className='text-sm text-gray-600'>
                                    Items in Stock : {categoryStock[category.categoryName] || 0}
                                </span>
                                <div className='flex justify-end gap-3 w-fit'>

                                    <IconButton className='!h-9 rounded-md'
                                        sx={{ color: '#fff', backgroundColor: '#004385', '&:hover': { backgroundColor: '#003366' } }}
                                        onClick={() => editCatModalOpen(category)} >
                                        <EditSquareIcon />
                                    </IconButton>

                                    <IconButton className='!h-9 rounded-md'
                                        sx={{ color: '#fff', backgroundColor: '#262524', '&:hover': { backgroundColor: '#353637' } }}
                                        onClick={() => handleDeleteCat(category.id)}>
                                        <DeleteForeverIcon />
                                    </IconButton>

                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* EDIT CATEGORY MODAL */}
            <Modal
                open={openeditCatModal}
                onClose={editCatModalClose}
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
                        <span className='font-bold h2 text-gray-950'>Edit Category</span>
                        <CloseIcon sx={{ color: "red", fontSize: "30px", cursor: "pointer" }} onClick={editCatModalClose} />
                    </header>
                    <hr />

                    <form onSubmit={(e) => e.preventDefault()}
                        className='grid grid-cols-2 gap-x-5 gap-y-5 items-center'>

                        <div className='col-span-2 flex items-center justify-center'>
                            <Avatar
                                onClick={handleAvatarClick}
                                src={selectedImage}
                                className='rounded-md'
                                sx={{ width: 150, height: 150 }} />
                            <input type='file' accept='image/*'
                                ref={fileInputRef} onChange={handleImageChange}
                                style={{ display: "none" }} required />
                        </div>

                        <div className='flex flex-col col-span-2'>
                            <label className="h6">Category Name</label>
                            <TextField id="outlined-basic"
                                variant="outlined"
                                type="text"
                                placeholder="Enter your name"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                required
                            />
                        </div>


                        <Button
                            onClick={handleEditCat}
                            variant='contained'
                            className='col-span-2 py-2'
                            size='medium'
                            style={{
                                background: "#004385", borderRadius: "5px", fontSize: "1rem",
                            }}>
                            Edit Category
                        </Button>

                    </form>
                </Card>
            </Modal>

        </div>


    );
}

export default CategoriesTab;
