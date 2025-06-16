import { Chip, Stack } from '@mui/material';
import React, { useState } from 'react';
import SalesReport from './SalesReport';
import InventoryStats from './InventoryStats';

const DashboardContent = () => {

    const username = localStorage.getItem("userName");

    // Select Reporting&Analytics Tab
    const [selectedReportingNAnalyticsTab, setselectedReportingNAnalyticsTab] = useState("Sales Report");

    return (
        <div style={{ fontFamily: "Roboto" }} className='grid gap-y-4'>

            <span className='font-semibold text-2xl m-0 p-0' style={{ color: "#252627" }}>Welcome, {username}</span>

            <div className='grid grid-flow-col justify-between items-center'>
                <Stack direction="row" spacing={1.5} >
                    <Chip variant='outlined'
                        label='Sales Report'
                        sx={{
                            background: selectedReportingNAnalyticsTab === "Sales Report" ? "#004385" : "transparent",
                            color: selectedReportingNAnalyticsTab === "Sales Report" ? "white" : "#004385",
                            border: selectedReportingNAnalyticsTab === "Sales Report" ? "2.5px inset #004385" : "2.5px outset #004385",
                            fontWeight: "500", letterSpacing: "0.5px",
                            cursor: "pointer", transition: "0.3s ease-in-out",
                            "&:hover": {
                                background: "#004385 !important",
                                color: "white",
                            },
                        }}
                        onClick={() => setselectedReportingNAnalyticsTab("Sales Report")}
                    />
                    <Chip variant='outlined'
                        label='Inventory Stats'
                        sx={{
                            background: selectedReportingNAnalyticsTab === "Inventory Stats" ? "#004385" : "transparent",
                            color: selectedReportingNAnalyticsTab === "Inventory Stats" ? "white" : "#004385",
                            border: selectedReportingNAnalyticsTab === "Inventory Stats" ? "2.5px inset #004385" : "2.5px outset #004385",
                            fontWeight: "500", letterSpacing: "0.5px",
                            cursor: "pointer", transition: "0.3s ease-in-out",
                            "&:hover": {
                                background: "#004385 !important",
                                color: "white",
                            },
                        }}
                        onClick={() => setselectedReportingNAnalyticsTab("Inventory Stats")}
                    />
                </Stack>
            </div>

            <div className="Sales Report">

                {selectedReportingNAnalyticsTab === "Sales Report" &&
                    <SalesReport />
                }

                {selectedReportingNAnalyticsTab === "Inventory Stats" &&
                    <InventoryStats />
                }

            </div>

        </div>
    );
}

export default DashboardContent;
