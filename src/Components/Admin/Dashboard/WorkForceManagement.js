import React, { useState } from 'react';
import GroupIcon from '@mui/icons-material/Group';
import CheckIcon from '@mui/icons-material/Check';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import ApprovalIcon from '@mui/icons-material/Approval';
import SchemaIcon from '@mui/icons-material/Schema'
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import MenuItem from '@mui/material/MenuItem';
import { Button, Card, Chip, Stack, TextField, InputAdornment, Select, Avatar } from '@mui/material';
import { BarChart, PieChart } from '@mui/x-charts';
import { TableContainer, Table, TableHead, TableRow, TableBody, TableCell } from '@mui/material';

const WorkForceManagement = () => {

    // Select Workforce Tab
    const [selectedWorkforceScreen, setselectedWorkforceScreen] = useState("Overview");

    // ADD EMPLOYEE MODAL
    const [openAddEmpModal, setopenAddEmpModal] = useState(false);
    const addEmpModalOpen = () => setopenAddEmpModal(true);
    const addEmpModalClose = () => setopenAddEmpModal(false);

    // Department Distribution
    const dataset = [
        { department: 'Cutting', employees: 30 },
        { department: 'Polishing', employees: 20 },
        { department: 'Delivery', employees: 15 },
        { department: 'Admin', employees: 10 },
    ];

    // Attendance Rate
    const attendanceDataset = [
        { month: 'Jan', rate: 75 },
        { month: 'Feb', rate: 80 },
        { month: 'Mar', rate: 85 },
        { month: 'Apr', rate: 90 },
        { month: 'May', rate: 95 },
        { month: 'Jun', rate: 100 },
    ];

    // Attendance Data
    function attendenceData(date, name, shift, inTime, status) {
        return { date, name, shift, inTime, status };
    }

    const attendanceData = [
        attendenceData('Apr. 24, 2024', 'Ravi Sharma', 'Morning', '8:01 AM', 'Present'),
        attendenceData('Apr. 24, 2024', 'Sneha Kapoor', 'Morning', '4:33 PM', 'Active'),
    ];

    // Employee Directory
    function empDirectoryData(name, role, contact, joiningDate, shift) {
        return { name, role, contact, joiningDate, shift };
    }

    const employeeDirectory = [
        empDirectoryData('Ravi Sharma', 'Foreman', '+91 9876543210', '12/04/2020', 'Morning'),
        empDirectoryData('Priya Verma', 'Cutter', '+91 9123456789', '28/11/2019', 'Evening'),
        empDirectoryData('Amit Joshi', 'Driver', '+91 9988776655', '17/07/2018', 'Night'),
        empDirectoryData('Sneha Kapoor', 'Polisher', '+91 9090980808', '09/08/2017', 'Morning'),
        empDirectoryData('Ravi Sharma', 'Foreman', '+91 9876543210', '12/04/2020', 'Morning'),
        empDirectoryData('Priya Verma', 'Cutter', '+91 9123456789', '28/11/2019', 'Evening'),
        empDirectoryData('Amit Joshi', 'Driver', '+91 9988776655', '17/07/2018', 'Night'),
        empDirectoryData('Sneha Kapoor', 'Polisher', '+91 9090980808', '09/08/2017', 'Morning'),
        empDirectoryData('Ravi Sharma', 'Foreman', '+91 9876543210', '12/04/2020', 'Morning'),
        empDirectoryData('Priya Verma', 'Cutter', '+91 9123456789', '28/11/2019', 'Evening'),
        empDirectoryData('Ravi Sharma', 'Foreman', '+91 9876543210', '12/04/2020', 'Morning'),
        empDirectoryData('Ravi Sharma', 'Foreman', '+91 9876543210', '12/04/2020', 'Morning'),
        empDirectoryData('Ravi Sharma', 'Foreman', '+91 9876543210', '12/04/2020', 'Morning'),
        empDirectoryData('Ravi Sharma', 'Foreman', '+91 9876543210', '12/04/2020', 'Morning'),
        empDirectoryData('Ravi Sharma', 'Foreman', '+91 9876543210', '12/04/2020', 'Morning'),
        empDirectoryData('Amit Joshi', 'Driver', '+91 9988776655', '17/07/2018', 'Night'),
        empDirectoryData('Sneha Kapoor', 'Polisher', '+91 9090980808', '09/08/2017', 'Morning'),
    ];

    return (
        <div style={{ fontFamily: "Roboto" }} className='grid gap-y-4'>

            <span className='font-semibold text-2xl m-0 p-0' style={{ color: "#252627" }}>Workforce Management</span>

            <div className='grid grid-flow-col justify-between items-center'>
                <Stack direction="row" spacing={1.5}
                    sx={{
                        paddingY: selectedWorkforceScreen === "Overview" || "Attendance Tracker" ? "4px" : "none",
                    }}
                >
                    <Chip variant='outlined'
                        label='Overview'
                        sx={{
                            background: selectedWorkforceScreen === "Overview" ? "#004385" : "transparent",
                            color: selectedWorkforceScreen === "Overview" ? "white" : "#004385",
                            border: selectedWorkforceScreen === "Overview" ? "none" : "2.5px solid #004385",
                            fontWeight: "500", letterSpacing: "0.5px",
                            cursor: "pointer", transition: "0.3s ease-in-out",
                            "&:hover": {
                                background: "#004385 !important",
                                color: "white",
                            },
                        }}
                        onClick={() => setselectedWorkforceScreen("Overview")}
                    />
                    <Chip variant='outlined'
                        label='Attendance Tracker'
                        sx={{
                            background: selectedWorkforceScreen === "Attendance Tracker" ? "#004385" : "transparent",
                            color: selectedWorkforceScreen === "Attendance Tracker" ? "white" : "#004385",
                            border: selectedWorkforceScreen === "Attendance Tracker" ? "none" : "2.5px solid #004385",
                            fontWeight: "500", letterSpacing: "0.5px",
                            cursor: "pointer", transition: "0.3s ease-in-out",
                            "&:hover": {
                                background: "#004385 !important",
                                color: "white",
                            },
                        }}
                        onClick={() => setselectedWorkforceScreen("Attendance Tracker")}
                    />
                    <Chip variant='outlined'
                        label='Employee Directory'
                        sx={{
                            background: selectedWorkforceScreen === "Employee Directory" ? "#004385" : "transparent",
                            color: selectedWorkforceScreen === "Employee Directory" ? "white" : "#004385",
                            border: selectedWorkforceScreen === "Employee Directory" ? "none" : "2.5px solid #004385",
                            fontWeight: "500", letterSpacing: "0.5px",
                            cursor: "pointer", transition: "0.3s ease-in-out",
                            "&:hover": {
                                background: "#004385 !important",
                                color: "white",
                            },
                        }}
                        onClick={() => setselectedWorkforceScreen("Employee Directory")}
                    />
                </Stack>
                {selectedWorkforceScreen === "Employee Directory" &&
                    <div className='gap-x-5 grid grid-flow-col'>
                        <TextField
                            variant="outlined"
                            type="text"
                            placeholder="Search here..."
                            size='small'
                            className='w-72'
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <SearchIcon />
                                    </InputAdornment>
                                )
                            }} />

                        <Button variant='contained' size='medium'
                            onClick={addEmpModalOpen}
                            style={{
                                background: "#004385", borderRadius: "5px", padding: "0 2rem"
                            }}>Add Employee</Button>
                    </div>
                }
            </div>

            <Modal
                open={openAddEmpModal}
                onClose={addEmpModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Card
                    className='w-3/6'
                    sx={{
                        position: 'absolute', top: '50%',
                        left: '50%', transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper', border: '1px outset #f5f5f5',
                        boxShadow: 24, p: 3,
                    }}>
                    <header className='grid grid-flow-col justify-between items-center'>
                        <span></span>
                        <span className='font-bold h2 text-gray-950'>Add Employee</span>
                        <CloseIcon sx={{ color: "red", fontSize: "30px", cursor: "pointer" }} onClick={addEmpModalClose} />
                    </header>
                    <hr />

                    <form className='grid grid-cols-2 gap-x-5 gap-y-5 items-center '>

                        <div className='col-span-2 flex items-center justify-center'>
                            <Avatar className='' sx={{ width: 100, height: 100 }} />
                        </div>

                        <div className='flex flex-col'>
                            <label className="h6">Name</label>
                            <TextField id="outlined-basic"
                                variant="outlined"
                                type="text"
                                placeholder="Enter your name"
                                value={""} required
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className="h6">Email</label>
                            <TextField id="outlined-basic"
                                variant="outlined"
                                type="email"
                                placeholder="Enter email address"
                                value={""} required
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className="h6">Phone Number</label>
                            <TextField id="outlined-basic"
                                variant="outlined"
                                type="phone"
                                placeholder="Enter phone number"
                                value={""} required
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className="h6">Role</label>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                variant='outlined'
                                displayEmpty
                            >
                                <MenuItem value="">Select role</MenuItem>
                                <MenuItem value={"Admin"}>Admin</MenuItem>
                                <MenuItem value={"Manager"}>Manager</MenuItem>
                                <MenuItem value={"Employee"}>Employee</MenuItem>
                            </Select>
                        </div>

                        <Button
                            variant='contained'
                            className='col-span-2 py-2'
                            size='medium'
                            style={{
                                background: "#004385", borderRadius: "5px", fontSize: "1rem",
                            }}>
                            Add Employee
                        </Button>

                    </form>
                </Card>
            </Modal>

            <div className="workForce">

                {selectedWorkforceScreen === "Overview" &&
                    <div className='grid gap-y-4'>
                        <div className='grid grid-flow-col gap-x-4 grid-cols-4'>
                            <Card className='flex items-center gap-x-3 p-3 shadow-sm'>
                                <GroupIcon
                                    className='rounded-md'
                                    style={{ fontSize: "3.3rem", color: "#031A6B", padding: "0.5rem", background: "rgba(5, 178, 220, 0.25)" }} />
                                <div className='flex flex-col'>
                                    <span className='text-lg'>Total Employees</span>
                                    <span className='text-2xl font-black text-gray-900'>35</span>
                                </div>
                            </Card>
                            <Card className='flex items-center gap-x-3 p-3 shadow-sm'>
                                <SchemaIcon
                                    className='rounded-md transform -scale-x-100'
                                    style={{ fontSize: "3.3rem", color: "#031A6B", padding: "0.5rem", background: "rgba(5, 178, 220, 0.25)" }} />
                                <div className='flex flex-col'>
                                    <span className='text-lg'>Total Departments</span>
                                    <span className='text-2xl font-black text-gray-900'>2</span>
                                </div>
                            </Card>
                            <Card className='flex items-center gap-x-3 p-3 shadow-sm'>
                                <CheckIcon
                                    className='rounded-md'
                                    style={{ fontSize: "3.3rem", color: "#031A6B", padding: "0.5rem", background: "rgba(5, 178, 220, 0.25)" }} />
                                <div className='flex flex-col'>
                                    <span className='text-lg'>Active Today</span>
                                    <span className='text-2xl font-black text-gray-900'>27</span>
                                </div>
                            </Card>
                            <Card className='flex items-center gap-x-3 p-3 shadow-sm'>
                                <ApprovalIcon
                                    className='rounded-md'
                                    style={{ fontSize: "3.3rem", color: "#031A6B", padding: "0.5rem", background: "rgba(5, 178, 220, 0.25)" }} />
                                <div className='flex flex-col'>
                                    <span className='text-lg'>On Leave</span>
                                    <span className='text-2xl font-black text-gray-900'>3</span>
                                </div>
                            </Card>
                        </div>

                        <div className='grid grid-cols-2 gap-x-4'>


                            <Card className='px-3 py-2.5 shadow-sm'>
                                <span className='text-lg'>Department Distribution</span>
                                <BarChart
                                    dataset={dataset} // Add the dataset here
                                    xAxis={[{ scaleType: 'band', dataKey: 'department' }]}
                                    series={[{ dataKey: 'employees', label: 'Number of Employees' }]}
                                    height={150}
                                />
                            </Card>

                            <Card className='px-3 py-2.5 shadow-sm'>
                                <span className='text-lg'>Attendance Rate</span>
                                <BarChart
                                    dataset={attendanceDataset}
                                    xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                                    series={[{ dataKey: 'rate', label: 'Attendance Rate (%)' }]}
                                    height={150}
                                />
                            </Card>
                        </div>

                        <div className='grid grid-cols-3 gap-x-4 '>
                            <Card className='px-3 py-2.5 col-span-1 shadow-sm'>
                                <span className='text-lg'>Shift Distribution</span>
                                <PieChart
                                    series={[
                                        {
                                            data: [
                                                { id: 0, value: 40, label: 'Morning Shift', color: "#087CA7", },
                                                { id: 1, value: 34, label: 'Evening Shift', color: "#004385" },
                                                { id: 2, value: 26, label: 'Night Shift', color: "#033860" },
                                            ],
                                        },
                                    ]}
                                    width={180}
                                    height={180}
                                />
                            </Card>

                            <Card className='w-100 px-3 py-2.5 shadow-sm col-span-2'>
                                <div className='grid grid-flow-col justify-between items-center'>
                                    <span className='text-lg'>Attendance Tracker</span>
                                    <span
                                        className='text-base font-semibold flex items-center cursor-pointer'
                                        style={{ color: "#4254FB" }}
                                        onClick={() => setselectedWorkforceScreen("Attendance Tracker")}>
                                        View All
                                        <KeyboardDoubleArrowRightIcon />
                                    </span>
                                </div>
                                <TableContainer>
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }}>Date</TableCell>
                                                <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }} align="start">Name</TableCell>
                                                <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }} align="start">Shift</TableCell>
                                                <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }} align="start">In-Time</TableCell>
                                                <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }} align="start">Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {attendanceData.map((row) => (
                                                <TableRow
                                                    key={row.name}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {row.date}
                                                    </TableCell>
                                                    <TableCell align="start">{row.name}</TableCell>
                                                    <TableCell align="start">{row.shift}</TableCell>
                                                    <TableCell align="start">{row.inTime}</TableCell>
                                                    <TableCell align="start">
                                                        <span
                                                            className={row.status === 'Present'
                                                                ? 'text-green-700 font-semibold'
                                                                : row.status === 'Absent'
                                                                    ? 'text-gray-600 font-semibold'
                                                                    : row.status === 'Leave'
                                                                        ? 'text-orange-600 font-semibold'
                                                                        : row.status === 'Active'
                                                                            ? 'text-blue-700 font-semibold'
                                                                            : ''}>
                                                            {row.status}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Card>
                        </div>
                    </div>
                }

                {selectedWorkforceScreen === "Attendance Tracker" &&
                    <div>
                        <Card className='w-100 px-3 py-2.5 shadow-sm'>
                            <TableContainer>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }}>Date</TableCell>
                                            <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }} align="start">Name</TableCell>
                                            <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }} align="start">Shift</TableCell>
                                            <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }} align="start">In-Time</TableCell>
                                            <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }} align="start">Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {attendanceData.map((row) => (
                                            <TableRow
                                                key={row.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.date}
                                                </TableCell>
                                                <TableCell align="start">{row.name}</TableCell>
                                                <TableCell align="start">{row.shift}</TableCell>
                                                <TableCell align="start">{row.inTime}</TableCell>
                                                <TableCell align="start">
                                                    <span
                                                        className={row.status === 'Present'
                                                            ? 'text-green-700 font-semibold'
                                                            : row.status === 'Absent'
                                                                ? 'text-gray-600 font-semibold'
                                                                : row.status === 'Leave'
                                                                    ? 'text-orange-600 font-semibold'
                                                                    : row.status === 'Active'
                                                                        ? 'text-blue-700 font-semibold'
                                                                        : ''}>
                                                        {row.status}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Card>
                    </div>
                }

                {selectedWorkforceScreen === "Employee Directory" &&
                    <div>
                        <Card className='w-100 px-3 py-2.5 shadow-sm'>
                            <TableContainer sx={{ maxHeight: 560 }} >
                                <Table stickyHeader aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }}>Name</TableCell>
                                            <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }} align="start">Role</TableCell>
                                            <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }} align="start">Contact</TableCell>
                                            <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }} align="start">Joining Date</TableCell>
                                            <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }} align="start">Shift</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {employeeDirectory.map((row) => (
                                            <TableRow
                                                key={row.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.name}
                                                </TableCell>
                                                <TableCell align="start">{row.role}</TableCell>
                                                <TableCell align="start">{row.contact}</TableCell>
                                                <TableCell align="start">{row.joiningDate}</TableCell>
                                                <TableCell align="start">{row.shift}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Card>
                    </div>
                }


            </div>


        </div>
    );
}

export default WorkForceManagement;
