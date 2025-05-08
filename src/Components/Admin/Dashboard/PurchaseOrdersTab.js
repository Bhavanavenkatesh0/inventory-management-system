import React, { useEffect, useState } from 'react';
import { database } from '../../../firebase';
import { onValue, ref } from 'firebase/database';
import { Card } from '@mui/material';

const PurchaseOrdersTab = () => {



    const [purchaseOrders, setpurchaseOrders] = useState([]);

    useEffect(() => {
        const purchaseOrdersRef = ref(database, 'purchase_orders');
        onValue(purchaseOrdersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const purchaseOrdersArray = Object.values(data);
                setpurchaseOrders(purchaseOrdersArray);
            }
        });
    }, []);


    return (
        <div className='w-full max-w-full custom-scroll max-h-[585px] overflow-y-auto'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 p-0 overflow-y-auto custom-scroll max-h-[580px] pb-1'>
                {purchaseOrders.map((item, index) => (
                    <Card key={index} className='flex gap-3 p-2.5'>
                        <div className='flex flex-col justify-between flex-grow'>
                            <span className='text-lg font-bold w-full mt-1'>{item.itemName}</span>
                            <span className='text-base font-bold w-full text-slate-800'>Product Ordered : <span className='text-sm font-normal'> {item.productOrdered}</span> </span>
                            <span className='text-base font-bold w-full text-slate-800'>Quantity : <span className='text-sm font-normal'> {item.quantity}</span> </span>
                            <span className='text-base font-bold w-full text-slate-800'>Unit Price : <span className='text-sm font-normal'>₹ {item.unitPrice}</span> </span>
                            <span className='text-base font-bold w-full text-slate-800'>Total Cost	 : <span className='text-sm font-normal'>₹ {item.totalCost}</span> </span>
                            <span className='text-base font-bold w-full text-slate-800 mt-1.5'>Purchase Date : <span className='text-sm font-normal'>
                                {new Date(item.purchaseDate).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </span> </span>
                            <span className='text-base font-bold w-full text-slate-800'>Expected Delivery : <span className='text-sm font-normal'>
                                {new Date(item.expectedDeliveryDate).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </span> </span>
                            <span className='text-base font-bold w-full text-slate-800'>Delivery Date : <span className='text-sm font-normal'> {item.deliveryDate ? item.deliveryDate : "Not Delivered"}</span> </span>
                            <span className='text-base font-bold w-full text-slate-800 mt-1.5'>Status : <span className='text-sm font-normal'> {item.status}</span> </span>
                            <span className='text-base font-bold w-full text-slate-800'>Payment Status : <span className='text-sm font-normal'> {item.paymentStatus}</span> </span>
                            <span className='text-base font-bold w-full text-slate-800 mt-1.5'>Notes : <span className='text-sm font-normal'> {item.notes ? item.notes : "---NIL---"}</span> </span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default PurchaseOrdersTab;
