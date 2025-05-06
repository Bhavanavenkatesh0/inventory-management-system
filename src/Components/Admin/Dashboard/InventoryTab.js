import { Card, IconButton } from '@mui/material';
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { database } from '../../../firebase';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditSquareIcon from '@mui/icons-material/EditSquare';


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

    return (
        <div className='w-full max-w-full custom-scroll max-h-[585px] overflow-y-auto'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-0 overflow-y-auto custom-scroll max-h-[580px] pb-1'>
                {items.map((item, index) => (
                    <Card key={index} className='p-2.5 grid grid-flow-row gap-y-1'>
                        <div className="relative w-full pb-[100%] overflow-hidden rounded mb-2">
                            <img
                                src={item.image}
                                alt={item.categoryName}
                                className="absolute top-0 left-0 w-full h-full object-cover"
                            />
                        </div>
                        <div className='flex flex-col gap-y-'>
                            {/* <div className='flex flex-row align-middle justify-between'> */}
                            <span className='text-sm font-normal text-gray-600'>{item.id}</span>
                            {/* <span className='text-sm text-gray-600'>Items in Stock : 2000</span> */}
                            {/* </div> */}
                            <span className='text-lg font-bold w-full'>{item.itemName}</span>
                            <span className='text-lg font-bold w-full'>Category : {item.itemCategory}</span>
                            <span className='text-lg font-bold w-full'>Color : {item.itemColor}</span>
                            <span className='text-lg font-bold w-full'>Origin : {item.itemOrigin}</span>
                            <span className='text-lg font-bold w-full'>Apperance : {item.itemApperance}</span>
                            <span className='text-lg font-bold w-full'>Slab Thickness : {item.slabThickness}</span>
                            <span className='text-lg font-bold w-full'>Slab Size : {item.slabSize}</span>
                            <span className='text-lg font-bold w-full'>Common Application : {item.comnApplication}</span>
                            <div className='flex justify-between items-center'>
                                <span className='text-sm text-gray-600'>Items in Stock : 2000</span>
                                <div className='flex justify-end gap-3 w-fit'>

                                    <IconButton className='!h-9 rounded-md'
                                        sx={{ color: '#fff', backgroundColor: '#004385', '&:hover': { backgroundColor: '#003366' } }}
                                    >
                                        <EditSquareIcon />
                                    </IconButton>

                                    <IconButton className='!h-9 rounded-md'
                                        sx={{ color: '#fff', backgroundColor: '#262524', '&:hover': { backgroundColor: '#353637' } }}
                                    >
                                        <DeleteForeverIcon />
                                    </IconButton>

                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default InventoryTab;
