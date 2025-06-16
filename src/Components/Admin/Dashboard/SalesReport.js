import { Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { BarChart, PieChart } from '@mui/x-charts';
import InventoryIcon from '@mui/icons-material/Inventory';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import React, { useEffect, useState } from 'react';
import { get, onValue, ref } from 'firebase/database';
import { database } from '../../../firebase';

const SalesReport = () => {

    // product category distribution
    const [categoryDistribution, setCategoryDistribution] = useState([]);

    useEffect(() => {
        const salesRef = ref(database, "sales");
        const itemsRef = ref(database, "items");

        const unsubscribeSales = onValue(salesRef, (salesSnap) => {
            const salesData = salesSnap.val();

            if (!salesData) {
                setCategoryDistribution([]);
                return;
            }

            // Load item details once
            get(itemsRef).then((itemsSnap) => {
                const itemsData = itemsSnap.val();
                const categoryMap = {};

                Object.values(salesData).forEach((sale) => {
                    const products = sale.products || [];

                    products.forEach((product) => {
                        const id = product.productID;
                        const qty = parseInt(product.productQty) || 0;

                        const item = itemsData && itemsData[id];
                        const category = item?.itemCategory?.trim() || 'Unknown';

                        categoryMap[category] = (categoryMap[category] || 0) + qty;
                    });
                });

                const distributionArray = Object.entries(categoryMap).map(([cat, qty]) => ({
                    category: cat,
                    totalQty: qty,
                }));

                setCategoryDistribution(distributionArray);
            });
        });

        return () => unsubscribeSales();
    }, []);

    // monthly revenue distribution

    const [monthlyRevenue, setMonthlyRevenue] = useState([]);

    useEffect(() => {
        const salesRef = ref(database, 'sales');

        get(salesRef).then(snapshot => {
            if (snapshot.exists()) {
                const salesData = snapshot.val();
                const monthlyTotals = {};

                Object.values(salesData).forEach(sale => {
                    const dateStr = sale.purchaseDate;
                    const total = parseFloat(sale.finalTotalPrice) || 0;

                    const dateObj = new Date(dateStr);
                    const month = dateObj.toLocaleString('default', { month: 'short' }); // e.g., "May"
                    const year = dateObj.getFullYear();
                    const key = `${month}-${year}`; // e.g., "May-2025"

                    monthlyTotals[key] = (monthlyTotals[key] || 0) + total;
                });

                // Sort and limit to last 6 months
                const sortedKeys = Object.keys(monthlyTotals)
                    .sort((a, b) => new Date(`01 ${a}`) - new Date(`01 ${b}`))
                    .slice(-6);

                const dataset = sortedKeys.map(key => ({
                    month: key, // keep full label like "May-2025"
                    revenue: monthlyTotals[key]
                }));

                setMonthlyRevenue(dataset);
            }
        }).catch(console.error);
    }, []);

    const formatIndianCurrency = (value) => {
        if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
        if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
        if (value >= 1000) return `₹${(value / 1000).toFixed(1)}k`;
        return `₹${value}`;
    };

    // total orders

    const [totalOrders, setTotalOrders] = useState(0);

    useEffect(() => {
        const salesRef = ref(database, 'sales');

        get(salesRef).then(snapshot => {
            if (snapshot.exists()) {
                const salesData = snapshot.val();
                const total = Object.keys(salesData).length;
                setTotalOrders(total);
            } else {
                setTotalOrders(0);
            }
        }).catch(console.error);
    }, []);

    // total revenue

    const [totalRevenue, setTotalRevenue] = useState(0);

    useEffect(() => {
        const salesRef = ref(database, 'sales');

        get(salesRef).then(snapshot => {
            if (snapshot.exists()) {
                const salesData = snapshot.val();
                let total = 0;

                Object.values(salesData).forEach(sale => {
                    const amount = parseFloat(sale.finalTotalPrice);
                    if (!isNaN(amount)) {
                        total += amount;
                    }
                });

                setTotalRevenue(total);
            } else {
                setTotalRevenue(0);
            }
        }).catch(console.error);
    }, []);

    // total pending order payments

    const [pendingAmount, setPendingAmount] = useState(0);

    useEffect(() => {
        const salesRef = ref(database, 'sales');

        get(salesRef).then(snapshot => {
            if (snapshot.exists()) {
                const salesData = snapshot.val();
                let total = 0;

                Object.values(salesData).forEach(sale => {
                    if (sale.paymentStatus === "Pending") {
                        const amount = parseFloat(sale.finalTotalPrice);
                        if (!isNaN(amount)) {
                            total += amount;
                        }
                    }
                });

                setPendingAmount(total);
            } else {
                setPendingAmount(0);
            }
        }).catch(console.error);
    }, []);

    // paid invoices

    const [paidCount, setPaidCount] = useState(0);

    useEffect(() => {
        const salesRef = ref(database, 'sales');

        get(salesRef).then(snapshot => {
            if (snapshot.exists()) {
                const salesData = snapshot.val();
                let count = 0;

                Object.values(salesData).forEach(sale => {
                    if (sale.paymentStatus === "Paid") {
                        count += 1;
                    }
                });

                setPaidCount(count);
            } else {
                setPaidCount(0);
            }
        }).catch(console.error);
    }, []);

    // payment status breakdown

    const [paymentStatusData, setPaymentStatusData] = useState([
        { id: 0, value: 0, label: 'Paid', color: "#004385" },      // Green
        { id: 1, value: 0, label: 'Pending', color: "#087CA7" },   // Amber
        { id: 2, value: 0, label: 'Partial', color: "#033860" },    // Red
    ]);

    useEffect(() => {
        const salesRef = ref(database, "sales/");
        onValue(salesRef, (snapshot) => {
            const sales = snapshot.val();
            if (sales) {
                let paid = 0, pending = 0, failed = 0;

                Object.values(sales).forEach(entry => {
                    const status = entry.paymentStatus?.toLowerCase();
                    if (status === "paid") paid++;
                    else if (status === "pending") pending++;
                    else if (status === "partial") failed++;
                });

                setPaymentStatusData([
                    { id: 0, value: paid, label: 'Paid', color: "#004385" },
                    { id: 1, value: pending, label: 'Pending', color: "#087CA7" },
                    { id: 2, value: failed, label: 'Partial', color: "#033860" },
                ]);
            }
        });
    }, []);

    // Latest Sales 

    const [sales, setSales] = useState([]);

    useEffect(() => {
        const salesRef = ref(database, 'sales');

        const unsubscribe = onValue(salesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const formattedSales = Object.entries(data)
                    .map(([key, value]) => ({
                        id: key,
                        ...value
                    }))
                    .sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate))
                    .slice(0, 2); // 👈 Only take latest 2 entries

                setSales(formattedSales);
            } else {
                setSales([]);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className='salesReport'>
            <div className='grid gap-y-4'>
                <div className='grid grid-flow-col gap-x-4 grid-cols-4'>
                    <Card className='flex items-center gap-x-3 p-3 shadow-sm'>
                        <InventoryIcon
                            className='rounded-md'
                            style={{ fontSize: "3.3rem", color: "#031A6B", padding: "0.5rem", background: "rgba(5, 178, 220, 0.25)" }} />
                        <div className='flex flex-col'>
                            <span className='text-lg'>Total Orders</span>
                            <span className='text-2xl font-black text-gray-900'>{totalOrders > 0 ? totalOrders : 0}</span>
                        </div>
                    </Card>
                    <Card className='flex items-center gap-x-3 p-3 shadow-sm'>
                        <CurrencyRupeeIcon
                            className='rounded-md'
                            style={{ fontSize: "3.3rem", color: "#031A6B", padding: "0.5rem", background: "rgba(5, 178, 220, 0.25)" }} />
                        <div className='flex flex-col'>
                            <span className='text-lg'>Total Revenue</span>
                            <span className='text-2xl font-black text-gray-900'>{totalRevenue > 0 ? "₹ " + Number(totalRevenue).toFixed(2) : "₹ 0.00"}</span>
                        </div>
                    </Card>
                    <Card className='flex items-center gap-x-3 p-3 shadow-sm'>
                        <HourglassTopIcon
                            className='rounded-md transform -scale-x-100'
                            style={{ fontSize: "3.3rem", color: "#031A6B", padding: "0.5rem", background: "rgba(5, 178, 220, 0.25)" }} />
                        <div className='flex flex-col'>
                            <span className='text-lg'>Pending Payments</span>
                            <span className='text-2xl font-black text-gray-900'>{pendingAmount > 0 ? "₹ " + Number(pendingAmount).toFixed(2) : "₹ 0.00"}</span>
                        </div>
                    </Card>
                    <Card className='flex items-center gap-x-3 p-3 shadow-sm'>
                        <PriceCheckIcon
                            className='rounded-md'
                            style={{ fontSize: "3.3rem", color: "#031A6B", padding: "0.5rem", background: "rgba(5, 178, 220, 0.25)" }} />
                        <div className='flex flex-col'>
                            <span className='text-lg'>Paid Invoices</span>
                            <span className='text-2xl font-black text-gray-900'>{paidCount > 0 ? paidCount : 0}</span>
                        </div>
                    </Card>
                </div>

                <div className='grid grid-cols-5 gap-x-4'>
                    <Card className='px-3 py-2.5 shadow-sm col-span-2 flex flex-col'>
                        <span className='text-lg'>Sales Distribution</span>
                        {categoryDistribution && categoryDistribution.length > 0 ? (
                            <BarChart
                                className='!p-0 !m-0'
                                dataset={categoryDistribution}
                                xAxis={[{ scaleType: 'band', dataKey: 'category', tickLabelStyle: { fontSize: 10 } }]}
                                series={[{ dataKey: 'totalQty', label: 'Quantity Sold' }]}
                                height={150} width={450}
                                margin={{ top: 20, right: 10, bottom: 10, left: 0 }}
                            />
                        ) : (
                            <div className='text-sm text-gray-500 py-4'>No data available</div>
                        )}
                    </Card>

                    <Card className='px-3 py-2.5 shadow-sm col-span-3'>
                        <span className='text-lg'>Monthly Revenue</span>
                        <BarChart
                            dataset={monthlyRevenue}
                            xAxis={[{
                                scaleType: 'band',
                                dataKey: 'month',
                                tickLabelStyle: { fontSize: 10 },
                            }]}
                            yAxis={[{
                                valueFormatter: (value) => formatIndianCurrency(value), // ✅ Format Y-axis labels
                            }]}
                            series={[{
                                dataKey: 'revenue',
                                label: 'Monthly Revenue',
                                valueFormatter: formatIndianCurrency, // ✅ Tooltip + bar values
                            }]}
                            height={150}
                            margin={{ top: 20, right: 10, bottom: 10, left: 0 }}
                        />

                    </Card>
                </div>

                <div className='grid grid-cols-3 gap-x-4 '>
                    <Card className='px-3 py-2.5 col-span-1 shadow-sm'>
                        <span className='text-lg'>Payment Status Breakdown</span>
                        <PieChart
                            series={[
                                {
                                    data: paymentStatusData,
                                },
                            ]}
                            width={180}
                            height={180}
                            margin={{ top: 5, right: 10, bottom: 0, left: 0 }}
                        />

                    </Card>
                    <Card className='w-100 px-3 py-2.5 shadow-sm col-span-2'>
                        <div className='grid grid-flow-col justify-between items-center'>
                            <span className='text-lg'>Latest Sales</span>
                            <span
                                className='text-base font-semibold flex items-center cursor-pointer'
                                style={{ color: "#4254FB" }}
                                onClick={() => {
                                    localStorage.setItem("selectedMenu", "Sales & Billing");
                                    window.location.reload(); // force Dashboard.js to re-evaluate selectedMenu
                                }}>
                                View All
                                <KeyboardDoubleArrowRightIcon />
                            </span>
                        </div>
                        <TableContainer>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }}>Order ID</TableCell>
                                        <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }} align="start">Customer Name</TableCell>
                                        <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }} align="start">Invoice Number</TableCell>
                                        <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }} align="start">Final Amount</TableCell>
                                        <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }} align="start">Payment Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sales.map((sale) => (
                                        <TableRow key={sale.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="start">{sale.orderID}</TableCell>
                                            <TableCell align="start">{sale.customerName}</TableCell>
                                            <TableCell align="start">{sale.invoiceNumber}</TableCell>
                                            <TableCell align="start">₹ {Number(sale.finalTotalPrice).toFixed(2)}</TableCell>
                                            <TableCell align="start">
                                                <span className=''>{sale.paymentStatus}</span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </div>


            </div>
        </div>
    );
}

export default SalesReport;
