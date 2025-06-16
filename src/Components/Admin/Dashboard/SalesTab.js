import { Card, IconButton, Modal } from '@mui/material';
import { TableContainer, Table, TableHead, TableRow, TableBody, TableCell } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { database } from '../../../firebase';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import logo from '../../../assets/images/logo.svg'
import signature from '../../../assets/images/signature.png'
import { useRef } from 'react';
import html2pdf from 'html2pdf.js';

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
                })).sort((a,b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
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

    const formatFullDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' }); // "May"
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;

        return `${day} ${month} ${year} ${hours}:${minutes} ${ampm}`;
    };

    // View Invoice MODAL
    const [openInvoiceViewCatModal, setopenInvoiceViewCatModal] = useState(false);

    const [selectedSale, setSelectedSale] = React.useState(null);

    const invoiceViewModalOpen = (sale) => {
        setSelectedSale(sale);               // Set clicked sale details
        setopenInvoiceViewCatModal(true);    // Open modal
    };

    const invoiceViewModalClose = () => {
        setopenInvoiceViewCatModal(false);
        setSelectedSale(null);               // Clear selection
    };


    const printRef = useRef();

    const handleDownloadPDF = () => {
        const element = printRef.current;
        const opt = {
            margin: 0,
            filename: `${selectedSale?.invoiceNumber || 'invoice'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };



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
                                        <TableCell align="start">₹ {Number(sale.finalTotalPrice).toFixed(2)}</TableCell>
                                        <TableCell align="start">{sale.invoiceNumber}</TableCell>
                                        <TableCell align="start">
                                            <div className='flex items-center justify-between'>
                                                <span className=''>{sale.paymentStatus}</span>
                                                <IconButton className='!h-8 !w-8 rounded-md' onClick={() => invoiceViewModalOpen(sale)}
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
            <div id="invoiceModal"> {/* Ensure this ID matches in JavaScript */}
                <Modal
                    open={openInvoiceViewCatModal}
                    onClose={invoiceViewModalClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    className='cursor-pointer'
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'auto', // Allows the modal itself to scroll
                        maxHeight: '100vh', // Restricts modal height to viewport
                    }}
                >
                    <Card
                        className='w-2/3'
                        sx={{
                            position: 'absolute', top: '55%',
                            left: '50%', transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper', border: '1px outset #f5f5f5',
                            boxShadow: 24, p: 2,
                        }}>
                        <div ref={printRef} onClick={handleDownloadPDF} className='border-4 border-blue-950 p-3 m-2'>
                            <header className='p-0 m-0 grid grid-flow-col'>
                                <header className='p-0 m-0 grid grid-flow-row'>
                                    <img src={logo} alt="appLogo" className='' width="15%" height="auto" />
                                    <span className='lh-base p-0 m-0 text-start' style={{ fontSize: "2rem", lineHeight: "2rem", alignItems: "baseline", color: "#031A6B", fontFamily: 'Roboto', fontWeight: 800 }}>Marble <span style={{ color: "#004385" }}>&</span> Might</span>
                                </header>
                                <span className='text-5xl uppercase font-bold p-0 m-0 text-[#031A6B] text-end'>Invoice</span>
                            </header>
                            {selectedSale && (
                                <div>
                                    <section className='flex justify-between items-center mt-5'>
                                        <section className='w-fit grid grid-flow-row grid-rows-2 '>
                                            <span className='font-semibold leading-tight text-lg p-0 m-0 uppercase'>Invoice To <br /> <span className='font-bold text-3xl m-0 p-0'>{selectedSale.customerName}</span> </span>
                                            <span className='mt-3 font-semibold leading-tight text-lg p-0 m-0'>Contact Person <br />
                                                <span className='text-lg font-semibold'>Phone : <span className='font-normal'>(+91) {selectedSale.customerContact}</span></span>
                                            </span>
                                        </section>
                                        <section className='w-fit grid grid-flow-row grid-rows-2 '>
                                            <section className='w-fit grid grid-flow-row grid-rows-2 '>
                                                <span className='text-lg font-semibold'>Invoice No : <span className='font-normal'>{selectedSale.invoiceNumber}</span></span>
                                                <span className='text-lg font-semibold'>Invoice Date : <span className='font-normal'>{formatFullDate(selectedSale.purchaseDate)}</span></span>
                                            </section>
                                            <section className='w-fit grid grid-flow-row grid-rows-2 mt-3'>
                                                <span className='text-lg font-semibold'>Payment Mode : <span className='font-normal'>{selectedSale.paymentMode}</span></span>
                                                <span className='text-lg font-semibold'>Payment Status : <span className='font-normal'>{selectedSale.paymentStatus}</span></span>
                                            </section>
                                        </section>
                                    </section>

                                    <TableContainer sx={{ maxHeight: 560 }} className='mt-4 ' >
                                        <Table stickyHeader aria-label="simple table" className='whitespace-nowrap'>
                                            <TableHead>
                                                <TableRow sx={{ '& td, & th': { border: 0 } }}>
                                                    <TableCell style={{ backgroundColor: "#031A6B", color: "#fff", fontSize: "0.9rem", fontWeight: "600", width: "40%" }} align="start">Product Name</TableCell>
                                                    <TableCell style={{ backgroundColor: "#031A6B", color: "#fff", fontSize: "0.9rem", fontWeight: "600" }} align="start">Unit Price</TableCell>
                                                    <TableCell style={{ backgroundColor: "#031A6B", color: "#fff", fontSize: "0.9rem", fontWeight: "600", width: "40%" }} align="center">Quantity</TableCell>
                                                    <TableCell style={{ backgroundColor: "#031A6B", color: "#fff", fontSize: "0.9rem", fontWeight: "600" }} align="start">Total</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {selectedSale.products?.map((p, index) => (
                                                    <TableRow key={index} className=''>
                                                        <TableCell align="start">{p.productName}</TableCell>
                                                        <TableCell align="start">₹ {Number(p.productUnitPrice).toFixed(2)}</TableCell>
                                                        <TableCell align="center">{p.productQty}</TableCell>
                                                        <TableCell align="start">₹ {Number(p.productTotalPrice).toFixed(2)}</TableCell>
                                                    </TableRow>
                                                ))}
                                                <TableRow className='' sx={{ '& td, & th': { border: 0 } }}>
                                                    <TableCell className='text-[#031A6B] pt-2 pb-0 m-0 font-bold text-base uppercase' colSpan={3} align="right">Sub Total : </TableCell>
                                                    <TableCell className='text-[#031A6B] pt-2 pb-0 m-0 font-bold text-base uppercase' align="start">₹ {Number(selectedSale.allProductTotalPrice).toFixed(2)}</TableCell>
                                                </TableRow>
                                                <TableRow className='' sx={{ '& td, & th': { border: 0 } }}>
                                                    <TableCell className='text-base pt-2 pb-0 m-0 font-bold text-[#262626]' colSpan={3} align="right">Discount {selectedSale.discountPercentage}% : </TableCell>
                                                    <TableCell className='text-base pt-2 pb-0 m-0 font-bold text-[#262626]' align="start">₹ {Number(selectedSale.discountAmount).toFixed(2)}</TableCell>
                                                </TableRow>
                                                <TableRow className='' sx={{ '& td, & th': { border: 0 } }}>
                                                    <TableCell className='text-xl font-bold m-0 py-2 text-[#031A6B]' colSpan={3} align="right">Total :</TableCell>
                                                    <TableCell className='text-xl font-bold m-0 py-2 text-[#031A6B]' align="start">₹ {Number(selectedSale.finalTotalPrice).toFixed(2)}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    <section className='flex mt-5 items-baseline justify-between'>
                                        <span className='w-full !h-full leading-none font-semibold text-xl text-[#031A6B]'><br />Thank you for your business...</span>
                                        <section className='flex flex-col items-end !w-fit justify-center'>
                                            <img src={signature} alt="Bhavana V" className='' width="60%" height="auto" />
                                            <span className='text-base font-semibold'>Bhavana V &nbsp;&nbsp;&nbsp;&nbsp;</span>
                                        </section>
                                    </section>

                                </div>
                            )}
                        </div>
                    </Card>
                </Modal>
            </div>

        </div>
    );
}

export default SalesTab;