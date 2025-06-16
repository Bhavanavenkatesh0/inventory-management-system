import { Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { BarChart, PieChart } from '@mui/x-charts';
import ShelvesIcon from '@mui/icons-material/Shelves';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import React, { useEffect, useState } from 'react';
import { get, onValue, ref } from 'firebase/database';
import { database } from '../../../firebase';

const InventoryStats = () => {

    // total stock quantity

    const [totalStock, settotalStock] = useState(0);

    useEffect(() => {
        const itemsRef = ref(database, 'items');

        onValue(itemsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const total = Object.values(data).reduce((sum, item) => {
                    const qty = parseInt(item.itemQty, 10); // ensure it's a number
                    return sum + (isNaN(qty) ? 0 : qty);
                }, 0);
                settotalStock(total);
            }
        });
    }, []);

    // inventory value

    const [inventoryValue, setInventoryValue] = useState(0);

    useEffect(() => {
        const itemsRef = ref(database, 'items');

        onValue(itemsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const totalValue = Object.values(data).reduce((sum, item) => {
                    const qty = parseInt(item.itemQty, 10);
                    const price = parseFloat(item.itemPrice);
                    const value = (!isNaN(qty) && !isNaN(price)) ? qty * price : 0;
                    return sum + value;
                }, 0);
                setInventoryValue(totalValue);
            }
        });
    }, []);

    // total category

    const [totalCategory, setTotalCategory] = useState(0);

    useEffect(() => {
        const categoryRef = ref(database, 'categories');

        onValue(categoryRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const count = Object.keys(data).length;
                setTotalCategory(count);
            }
        });
    }, []);

    // total items

    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        const itemsRef = ref(database, 'items');

        onValue(itemsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const count = Object.keys(data).length;
                setTotalItems(count);
            }
        });
    }, []);

    // item distribution by quantity
    const [itemDistribution, setItemDistribution] = useState([]);

    useEffect(() => {
        const itemsRef = ref(database, "items");

        const unsubscribeItems = onValue(itemsRef, (snapshot) => {
            const itemsData = snapshot.val();
            if (!itemsData) {
                setItemDistribution([]);
                return;
            }

            const categoryMap = {};

            Object.values(itemsData).forEach((item) => {
                const category = item.itemCategory?.trim() || 'Unknown';
                const qty = parseInt(item.itemQty) || 0;

                categoryMap[category] = (categoryMap[category] || 0) + qty;
            });

            const distributionArray = Object.entries(categoryMap).map(([cat, qty]) => ({
                category: cat,
                totalQty: qty,
            }));

            setItemDistribution(distributionArray);
        });

        return () => unsubscribeItems();
    }, []);

    // inventory value by category

    const [inventoryValueDistribution, setInventoryValueDistribution] = useState([]);

    useEffect(() => {
        const itemsRef = ref(database, "items");

        onValue(itemsRef, (snapshot) => {
            const itemsData = snapshot.val();

            if (!itemsData) {
                setInventoryValueDistribution([]);
                return;
            }

            const valueMap = {};

            Object.values(itemsData).forEach((item) => {
                const category = item.itemCategory?.trim() || "Unknown";
                const qty = parseFloat(item.itemQty) || 0;
                const price = parseFloat(item.itemPrice) || 0;
                const totalValue = price * qty;

                valueMap[category] = (valueMap[category] || 0) + totalValue;
            });

            const valueArray = Object.entries(valueMap).map(([category, value]) => ({
                category, totalValue: value
            }));

            setInventoryValueDistribution(valueArray);
        });
    }, []);

    const formatYAxisValue = (value) => {
        if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`; // Crores
        if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;      // Lakhs
        if (value >= 1000) return `₹${(value / 1000).toFixed(1)}k`;          // Thousands
        return `₹${value}`;
    };

    // Top Performance category

    const [topCategories, setTopCategories] = useState([]);

    useEffect(() => {
        const salesRef = ref(database, "sales");
        const itemsRef = ref(database, "items");

        onValue(salesRef, (salesSnap) => {
            const salesData = salesSnap.val();
            if (!salesData) {
                setTopCategories([]);
                return;
            }

            get(itemsRef).then((itemsSnap) => {
                const itemsData = itemsSnap.val();
                const categoryMap = {};

                Object.values(salesData).forEach((sale) => {
                    const products = sale.products || [];

                    products.forEach((product) => {
                        const id = product.productID;
                        const qty = parseInt(product.productQty) || 0;
                        const item = itemsData?.[id];
                        const category = item?.itemCategory?.trim() || "Unknown";

                        categoryMap[category] = (categoryMap[category] || 0) + qty;
                    });
                });

                const top5 = Object.entries(categoryMap)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3)
                    .map(([category, qty]) => ({ category, qty }));

                setTopCategories(top5);
            });
        });
    }, []);

    // least performing category

    const [leastCategories, setLeastCategories] = useState([]);

    useEffect(() => {
        const salesRef = ref(database, "sales");
        const itemsRef = ref(database, "items");

        onValue(salesRef, (salesSnap) => {
            const salesData = salesSnap.val();
            if (!salesData) {
                setLeastCategories([]);
                return;
            }

            get(itemsRef).then((itemsSnap) => {
                const itemsData = itemsSnap.val();
                const categoryMap = {};

                Object.values(salesData).forEach((sale) => {
                    const products = sale.products || [];

                    products.forEach((product) => {
                        const id = product.productID;
                        const qty = parseInt(product.productQty) || 0;
                        const item = itemsData?.[id];
                        const category = item?.itemCategory?.trim() || "Unknown";

                        categoryMap[category] = (categoryMap[category] || 0) + qty;
                    });
                });

                const least3 = Object.entries(categoryMap)
                    .sort((a, b) => a[1] - b[1]) // sort ascending
                    .slice(0, 3)
                    .map(([category, qty]) => ({ category, qty }));

                setLeastCategories(least3);
            });
        });
    }, []);

    // top selling items

    const [topItems, setTopItems] = useState([]);

    useEffect(() => {
        const salesRef = ref(database, "sales");
        const itemsRef = ref(database, "items");

        onValue(salesRef, (salesSnap) => {
            const salesData = salesSnap.val();
            if (!salesData) {
                setTopItems([]);
                return;
            }

            get(itemsRef).then((itemsSnap) => {
                const itemsData = itemsSnap.val();
                const itemSalesMap = {};

                Object.values(salesData).forEach((sale) => {
                    const products = sale.products || [];

                    products.forEach((product) => {
                        const id = product.productID;
                        const qty = parseInt(product.productQty) || 0;

                        const item = itemsData?.[id];
                        const name = item?.itemName?.trim() || "Unknown";

                        itemSalesMap[name] = (itemSalesMap[name] || 0) + qty;
                    });
                });

                const top3Items = Object.entries(itemSalesMap)
                    .sort((a, b) => b[1] - a[1]) // sort descending
                    .slice(0, 3)
                    .map(([name, qty]) => ({ name, qty }));

                setTopItems(top3Items);
            });
        });
    }, []);

    // least selling items

    const [leastItemsNonZero, setLeastItemsNonZero] = useState([]);

    useEffect(() => {
        const salesRef = ref(database, "sales");
        const itemsRef = ref(database, "items");

        onValue(salesRef, (salesSnap) => {
            const salesData = salesSnap.val();
            if (!salesData) {
                setLeastItemsNonZero([]);
                return;
            }

            get(itemsRef).then((itemsSnap) => {
                const itemsData = itemsSnap.val();
                const itemSalesMap = {};

                Object.values(salesData).forEach((sale) => {
                    const products = sale.products || [];

                    products.forEach((product) => {
                        const id = product.productID;
                        const qty = parseInt(product.productQty) || 0;

                        const item = itemsData?.[id];
                        const name = item?.itemName?.trim() || "Unknown";

                        itemSalesMap[name] = (itemSalesMap[name] || 0) + qty;
                    });
                });

                const nonZeroSalesItems = Object.entries(itemSalesMap)
                    .filter(([_, qty]) => qty > 0)
                    .sort((a, b) => a[1] - b[1]) // ascending for least sold
                    .slice(0, 3)
                    .map(([name, qty]) => ({ name, qty }));

                setLeastItemsNonZero(nonZeroSalesItems);
            });
        });
    }, []);

    return (
        <div className='salesReport'>
            <div className='grid gap-y-4'>
                <div className='grid grid-flow-col gap-x-4 grid-cols-4'>
                    <Card className='flex items-center gap-x-3 p-3 shadow-sm'>
                        <ShelvesIcon
                            className='rounded-md'
                            style={{ fontSize: "3.3rem", color: "#031A6B", padding: "0.5rem", background: "rgba(5, 178, 220, 0.25)" }} />
                        <div className='flex flex-col'>
                            <span className='text-lg'>Total Stock</span>
                            <span className='text-2xl font-black text-gray-900'>{totalStock > 0 ? totalStock : 0}</span>
                        </div>
                    </Card>
                    <Card className='flex items-center gap-x-3 p-3 shadow-sm'>
                        <CurrencyRupeeIcon
                            className='rounded-md'
                            style={{ fontSize: "3.3rem", color: "#031A6B", padding: "0.5rem", background: "rgba(5, 178, 220, 0.25)" }} />
                        <div className='flex flex-col'>
                            <span className='text-lg'>Inventory Value</span>
                            <span className='text-2xl font-black text-gray-900'>{inventoryValue > 0 ? "₹ " + Number(inventoryValue).toFixed(2) : "₹ 0.00"}</span>
                        </div>
                    </Card>
                    <Card className='flex items-center gap-x-3 p-3 shadow-sm'>
                        <AccountTreeIcon
                            className='rounded-md transform -scale-x-180'
                            style={{ fontSize: "3.3rem", color: "#031A6B", padding: "0.5rem", background: "rgba(5, 178, 220, 0.25)" }} />
                        <div className='flex flex-col'>
                            <span className='text-lg'>Categories</span>
                            <span className='text-2xl font-black text-gray-900'>{totalCategory > 0 ? totalCategory : 0}</span>
                        </div>
                    </Card>
                    <Card className='flex items-center gap-x-3 p-3 shadow-sm'>
                        <AllInboxIcon
                            className='rounded-md'
                            style={{ fontSize: "3.3rem", color: "#031A6B", padding: "0.5rem", background: "rgba(5, 178, 220, 0.25)" }} />
                        <div className='flex flex-col'>
                            <span className='text-lg'>Items</span>
                            <span className='text-2xl font-black text-gray-900'>{totalItems > 0 ? totalItems : 0}</span>
                        </div>
                    </Card>
                </div>

                <div className='grid grid-cols-4 gap-x-4'>
                    <Card className='px-3 py-2.5 shadow-sm col-span-2 flex flex-col'>
                        <span className='text-lg'>Item Distribution in Stock</span>
                        {itemDistribution && itemDistribution.length > 0 ? (
                            <BarChart
                                className='!p-0 !m-0'
                                dataset={itemDistribution}
                                xAxis={[
                                    {
                                        scaleType: 'band',
                                        dataKey: 'category',
                                        tickLabelStyle: { fontSize: 10 }
                                    }
                                ]}
                                yAxis={[
                                    {
                                        valueFormatter: (value) =>
                                            value >= 1000 ? `${(value / 1000).toFixed(0)}k` : `${value}`
                                    }
                                ]}
                                series={[
                                    {
                                        dataKey: 'totalQty',
                                        label: 'Total Quantity'
                                    }
                                ]}
                                height={190}
                                width={550}
                                margin={{ top: 20, right: 10, bottom: 10, left: 0 }}
                            />


                        ) : (
                            <div className='text-sm text-gray-500 py-4'>No data available</div>
                        )}
                    </Card>
                    <Card className='px-3 py-2.5 shadow-sm col-span-2'>
                        <span className='text-lg'>Inventory Value by Category</span>
                        <BarChart
                            className='!p-0 !m-0'
                            dataset={inventoryValueDistribution}
                            xAxis={[
                                {
                                    scaleType: 'band',
                                    dataKey: 'category',
                                    tickLabelStyle: { fontSize: 10 }
                                }
                            ]}
                            yAxis={[
                                {
                                    valueFormatter: (value) => formatYAxisValue(value),
                                    tickLabelStyle: { fontSize: 10 }
                                }
                            ]}
                            series={[
                                {
                                    dataKey: 'totalValue',
                                    label: 'Inventory Value (₹)',
                                    valueFormatter: (value) => formatYAxisValue(value),  // ✅ Add this line
                                }
                            ]}
                            height={190}
                            width={550}
                            margin={{ top: 20, right: 10, bottom: 10, left: 0 }}
                        />
                    </Card>
                </div>

                <div className='grid grid-cols-4 gap-x-4 '>
                    <Card className='px-3 py-2.5 col-span-1 shadow-sm'>
                        <span className='text-lg w-full'>Top Performing Categories</span>
                        <section className='grid'>
                            {topCategories.map((cat, index) => (
                                <span key={index} className='text-base font-extrabold text-[#031A6B] w-full'>
                                    #{index + 1}  <span className='font-medium'>{cat.category} <br />
                                        <span className='text-base m-0 p-0 italic'> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {cat.qty} units sold </span> </span>
                                </span>
                            ))}
                        </section>
                    </Card>
                    <Card className='w-100 px-3 py-2.5 shadow-sm col-span-1'>
                        <span className='text-lg'>Lowest Performing Categories</span>
                        <section className='grid'>
                            {leastCategories.map((cat, index) => (
                                <span key={index} className='text-base font-extrabold text-[#454648] w-full'>
                                    #{index + 1}  <span className='font-medium'>{cat.category} <br />
                                        <span className='text-base m-0 p-0 italic'> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {cat.qty} units sold </span> </span>
                                </span>
                            ))}
                        </section>
                    </Card>
                    <Card className='px-3 py-2.5 col-span-1 shadow-sm'>
                        <span className='text-lg'>Best-Selling Items</span>
                        <section className='grid'>
                            {topItems.map((item, index) => (
                                <span key={index} className='text-base font-extrabold text-[#031A6B] w-full'>
                                    #{index + 1}  <span className='font-medium'>{item.name} <br />
                                        <span className='text-base m-0 p-0 italic'> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {item.qty} units sold </span> </span>
                                </span>
                            ))}
                        </section>
                    </Card>
                    <Card className='w-100 px-3 py-2.5 shadow-sm col-span-1'>
                        <span className='text-lg'>Least-Selling Items</span>
                        <section className='grid'>
                            {leastItemsNonZero.map((item, index) => (
                                <span key={index} className='text-base font-extrabold text-[#454648] w-full'>
                                    #{index + 1}  <span className='font-medium'>{item.name} <br />
                                        <span className='text-base m-0 p-0 italic'> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {item.qty} units sold </span> </span>
                                </span>
                            ))}
                        </section>
                    </Card>
                </div>

            </div>
        </div>
    );
}

export default InventoryStats;
