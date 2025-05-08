import React, { useEffect, useState } from 'react';
import { database } from '../../../firebase';
import { onValue, ref } from 'firebase/database';

const SuppliersTab = () => {
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        const supplierRef = ref(database, 'suppliers/');

        onValue(supplierRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const supplierArray = Object.entries(data).map(([id, info]) => ({
                    id,
                    ...info
                }));
                setSuppliers(supplierArray);
            }
        });
    }, []);

    return (
        <div className='w-full max-w-full custom-scroll max-h-[585px] overflow-y-auto'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-3 p-0 overflow-y-auto custom-scroll max-h-[580px] pb-1'>
                {suppliers.map(supplier => (
                    <div key={supplier.id} className="p-4 bg-white shadow-md rounded-lg">
                        <h2 className="text-xl font-bold">Business Name : <span className='text-xl font-medium'>{supplier.businessName}</span></h2>
                        <p className='font-medium py-1 m-0 text-base'><strong>GSTIN:</strong> <span className='text-base font-normal'>{supplier.gstin}</span> </p>
                        <p className='font-medium py-1 m-0 text-base'><strong>Owner:</strong> <span className='text-base font-normal'> {supplier.ownerName}</span></p>
                        <p className='font-medium py-1 m-0 text-base'><strong>Phone:</strong> <span className='text-base font-normal'> {supplier.phoneNumber}</span></p>
                        <p className='font-medium py-1 m-0 text-base'><strong>Deals In:</strong> <span className='text-base font-normal'> {(supplier.dealsIn || []).join(', ')}</span></p>
                        <p className='font-medium py-1 m-0 text-base'><strong>Previous Transactions:</strong> <span className='text-base font-normal'> {supplier.previousTransactions}</span></p>
                        <p className='font-medium py-1 m-0 text-base'><strong>Last Supplied:</strong> <span className='text-base font-normal'> {supplier.lastSuppliedItem}</span></p>
                        <p className='font-medium py-1 m-0 text-base'><strong>Address:</strong> <span className='text-base font-normal'> {supplier.address}</span></p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SuppliersTab;
