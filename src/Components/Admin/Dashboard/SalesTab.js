import { Avatar, Card } from '@mui/material';
import { TableContainer, Table, TableHead, TableRow, TableBody, TableCell } from '@mui/material';
import React from 'react';

const SalesTab = () => {
    return (
        <div className='w-full max-w-full custom-scroll min-h-[585px] max-h-[585px] overflow-y-auto p-0 m-0'>
            <div className='grid gap-3 p-0 m-0 overflow-y-auto custom-scroll min-h-[585px] max-h-[585px] '>
                <Card className='flex gap-3 p-2.5 max-h-[580px]'>
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
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        <Avatar src="" />
                                    </TableCell>
                                    <TableCell align="start">ID</TableCell>
                                    <TableCell component="th" scope="row">Name</TableCell>
                                    <TableCell align="start">Dept</TableCell>
                                    <TableCell align="start">Role</TableCell>
                                    <TableCell align="start">Shift</TableCell>
                                    <TableCell align="start">phone</TableCell>
                                    <TableCell align="start">Time</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </div>
        </div>
    );
}

export default SalesTab;
