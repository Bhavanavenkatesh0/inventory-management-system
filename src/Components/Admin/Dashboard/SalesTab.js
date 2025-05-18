import { Card, IconButton, Modal } from '@mui/material';
import { TableContainer, Table, TableHead, TableRow, TableBody, TableCell } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { database } from '../../../firebase';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import logo from '../../../assets/images/logo.svg'

const SalesTab = () => {

    const [sales, setSales] = useState([]);

    useEffect(() => {
        const salesRef = ref(database, 'sales');

        const unsubscribe = onValue(salesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const formattedSales = Object.entries(data).map(([key, value]) => ({
                    id: key,
                    ...value
                }));
                setSales(formattedSales);
            } else {
                setSales([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' }); // "May"
        const year = date.getFullYear();
        // let hours = date.getHours();
        // const minutes = date.getMinutes().toString().padStart(2, '0');
        // const ampm = hours >= 12 ? 'PM' : 'AM';
        // hours = hours % 12 || 12;

        // return `${day} ${month} ${year} ${hours}:${minutes} ${ampm}`;
        return `${day} ${month} ${year}`;
    };

    // View Invoice MODAL
    const [openInvoiceViewCatModal, setopenInvoiceViewCatModal] = useState(true);
    const invoiceViewModalClose = () => setopenInvoiceViewCatModal(false);
    const invoiceViewModalOpen = () => setopenInvoiceViewCatModal(true);


    return (
        <div className='w-full max-w-full custom-scroll min-h-[585px] max-h-[585px] overflow-y-auto p-0 m-0'>
            <div className='grid gap-3 p-0 m-0 overflow-y-auto custom-scroll min-h-[585px] max-h-[585px] '>
                <Card className='flex gap-3 p-2 max-h-[580px]'>
                    <TableContainer sx={{ maxHeight: 560 }} >
                        <Table stickyHeader aria-label="simple table" className='whitespace-nowrap'>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }}>Order ID</TableCell>
                                    <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }}>Timestamp</TableCell>
                                    <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }} align="start">Customer Name</TableCell>
                                    <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }} align="start">Product Name</TableCell>
                                    <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }} align="start">Quantity</TableCell>
                                    <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }} align="start">Final Amount</TableCell>
                                    <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }} align="start">Invoice Number</TableCell>
                                    <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }} align="start">Payment Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sales.map((sale) => (
                                    <TableRow key={sale.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="start">{sale.orderID}</TableCell>
                                        <TableCell component="th" scope="row">{formatDate(sale.purchaseDate)}</TableCell>
                                        <TableCell align="start">{sale.customerName}</TableCell>
                                        <TableCell align="start">
                                            {sale.products?.map((p, index) => (
                                                <div key={index} className='border'>{p.productName}</div>
                                            ))}
                                        </TableCell>
                                        <TableCell align="start">
                                            {sale.products?.map((p, index) => (
                                                <div key={index} className='border'>{p.productQty}</div>
                                            ))}
                                        </TableCell>
                                        <TableCell align="start">{Number(sale.finalTotalPrice).toFixed(2)}</TableCell>
                                        <TableCell align="start">{sale.invoiceNumber}</TableCell>
                                        <TableCell align="start">
                                            <div className='flex items-center justify-between'>
                                                <span className=''>{sale.paymentStatus}</span>
                                                <IconButton className='!h-8 !w-8 rounded-md' onClick={invoiceViewModalOpen}
                                                    sx={{
                                                        color: '#004385', border: "2px inset #004385", backgroundColor: 'transparent',
                                                        '&:hover': { backgroundColor: '#004385', color: "#f5f5f5", border: "2px outset #fff" }
                                                    }} >
                                                    <ReceiptLongIcon />
                                                </IconButton>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </div>












            {/* View Invoice MODAL */}
            <Modal
                open={openInvoiceViewCatModal}
                onClose={invoiceViewModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Card
                    className='w-3/6'
                    sx={{
                        position: 'absolute', top: '50%',
                        left: '50%', transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper', border: '1px outset #f5f5f5',
                        boxShadow: 24, p: 2,
                    }}>
                    <div className='border-4 border-blue-950 p-3 m-0'>
                        <header className='bg-red-500 p-0 m-0 grid grid-flow-col grid-cols-2 items-center'>
                            <img src={logo} alt="appLogo" className='bg-yellow-400' width="35%" height="auto" />
                            <span className='lh-base bg-green-500' style={{ fontSize: "2.5rem", color: "#031A6B", fontFamily: 'Roboto', fontWeight: 800 }}>Marble <span style={{ color: "#004385" }}>&</span> Might</span>
                        </header>
                    </div>
                </Card>
            </Modal>











        </div>
    );
}

export default SalesTab;
