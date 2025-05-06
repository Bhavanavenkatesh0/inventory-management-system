import React, { useEffect, useRef, useState } from 'react';
import GroupIcon from '@mui/icons-material/Group';
import CheckIcon from '@mui/icons-material/Check';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import ApprovalIcon from '@mui/icons-material/Approval';
import SchemaIcon from '@mui/icons-material/Schema'
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import MenuItem from '@mui/material/MenuItem';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import { Button, Card, Chip, Stack, TextField, InputAdornment, Select, Avatar, IconButton } from '@mui/material';
import { BarChart, PieChart } from '@mui/x-charts';
import { TableContainer, Table, TableHead, TableRow, TableBody, TableCell } from '@mui/material';
import dayjs from 'dayjs'; // For date formatting
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { get, onValue, ref, remove, set, update } from "firebase/database";
import { database } from '../../../firebase';
// import { updateAbsentInTimes } from '../../scripts/updateAbsentInTime';

dayjs.extend(utc);
dayjs.extend(timezone);

const WorkForceManagement = () => {



    // TO UPDATE IN-TIME to --NIL-- IN ATTENDANCE NODE
    // const handleUpdate = async () => {
    //     await updateAbsentInTimes();
    // };





    // Select Workforce Tab
    const [selectedWorkforceScreen, setselectedWorkforceScreen] = useState("Overview");

    // ADD EMPLOYEE MODAL
    const [openAddEmpModal, setopenAddEmpModal] = useState(false);
    const addEmpModalOpen = () => setopenAddEmpModal(true);
    const addEmpModalClose = () => setopenAddEmpModal(false);

    // EDIT EMPLOYEE MODAL
    const [openEditEmpModal, setopenEditEmpModal] = useState(false);
    const editEmpModalClose = () => setopenEditEmpModal(false);

    // Selected employee for edit
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const editEmpModalOpen = (employee) => {
        setSelectedEmployee(employee);
        setName(employee.username);
        setEmail(employee.email);
        setPhone(employee.phone);
        setShift(employee.shift);
        setDept(employee.dept);
        setRole(employee.role);
        setSelectedImage(employee.profile_pic);
        setopenEditEmpModal(true);
    };


    // EDIT Employee Data
    const handleEditEmployee = async () => {
        if (!selectedEmployee?.id) {
            alert("No employee selected.");
            return;
        }

        const userRef = ref(database, `users/${selectedEmployee.id}`);

        const updatedData = {
            username: name,
            email: email,
            phone: phone,
            shift: shift,
            dept: dept,
            role: role,
            profile_pic: selectedImage || "", // keep empty if not updated
        };

        try {
            await update(userRef, updatedData);
            alert("Employee updated successfully!");
            editEmpModalClose(); // close the modal
        } catch (error) {
            console.error("Error updating employee:", error);
            alert("Failed to update employee.");
        }
    };





    // Attendance Rate
    const [attendanceDataset, setAttendanceDataset] = useState([]);
    useEffect(() => {
        const attendanceRateRef = ref(database, 'attendance');

        get(attendanceRateRef).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();

                const monthData = {};

                Object.values(data).forEach(entry => {
                    const dateStr = entry.date; // e.g. "12 March 2025"
                    const status = entry.status;

                    const dateObj = new Date(dateStr);
                    const month = dateObj.toLocaleString('default', { month: 'short' }); // "Mar"
                    const year = dateObj.getFullYear();

                    const key = `${month}-${year}`; // e.g., "Mar-2025"

                    if (!monthData[key]) {
                        monthData[key] = { present: 0, total: 0 };
                    }

                    monthData[key].total += 1;
                    if (status === "Present" || status === "Active") {
                        monthData[key].present += 1;
                    }
                });

                // Get last 6 months sorted
                const sortedKeys = Object.keys(monthData)
                    .sort((a, b) => new Date(`01 ${a}`) - new Date(`01 ${b}`))
                    .slice(-6);

                const dataset = sortedKeys.map(key => ({
                    month: key.split('-')[0], // only "Mar"
                    rate: Math.round((monthData[key].present / monthData[key].total) * 100)
                }));

                setAttendanceDataset(dataset);
            }
        }).catch(console.error);
    }, []);




    // EMPLOYEE DIRECTORY TABLE
    const [employeeDirectory, setEmployeeDirectory] = useState([]);
    const [totalEmployees, setTotalEmployees] = useState(0); // Store total count

    useEffect(() => {
        const userRef = ref(database, "users/");

        const unsubscribe = onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const formattedData = Object.values(data);
                setEmployeeDirectory(formattedData);
                setTotalEmployees(formattedData.length);
            } else {
                setEmployeeDirectory([]);
            }
        });

        return () => unsubscribe(); // clean up the listener
    }, []);




    // Search for employee directory
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState(employeeDirectory);

    useEffect(() => {
        const lowerQuery = searchQuery.toLowerCase();
        const filtered = employeeDirectory.filter((emp) =>
            (emp.username || "").toLowerCase().includes(lowerQuery) ||
            (emp.role || "").toLowerCase().includes(lowerQuery) ||
            (emp.phone ? emp.phone.toString().toLowerCase() : "").includes(lowerQuery) ||
            (emp.id || "").toLowerCase().includes(lowerQuery) ||
            (emp.shift || "").toLowerCase().includes(lowerQuery)
        );
        setFilteredData(filtered);
    }, [searchQuery, employeeDirectory]);

    const sortedData = filteredData.sort((a, b) => a.username.localeCompare(b.username));




    const handleDelete = (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            const userRef = ref(database, `users/${userId}`);
            remove(userRef)
                .then(() => {
                    console.log("User deleted successfully!");
                })
                .catch((error) => {
                    console.error("Error deleting user: ", error);
                });
        }
    };




    // ATTENDANCE TABLE
    const [attendanceData, setAttendanceData] = useState([]); // full sorted data
    const [attendanceTable, setAttendanceTable] = useState([]); // visible paginated data
    const [visibleCount, setVisibleCount] = useState(100); // show 100 at a time
    const [activeToday, setActiveToday] = useState(0);
    const [leaveToday, setLeaveToday] = useState(0);

    useEffect(() => {
        const attendanceRef = ref(database, "attendance/");
        onValue(attendanceRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const attendanceArray = Object.values(data);

                // Sort by date and in_time (both descending)
                const sortedArray = attendanceArray.sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);

                    if (dateA.getTime() === dateB.getTime()) {
                        const timeA = convertTo24Hour(a.in_time);
                        const timeB = convertTo24Hour(b.in_time);
                        return timeB.localeCompare(timeA);
                    }

                    return dateB - dateA;
                });

                calculateTodayCounts(attendanceArray);

                setAttendanceData(sortedArray); // store full sorted data
                setAttendanceTable(sortedArray.slice(0, 100)); // show first 100
            }
        });
    }, []);

    const handleLoadMore = () => {
        const newCount = visibleCount + 100;
        setVisibleCount(newCount);
        setAttendanceTable(attendanceData.slice(0, newCount));
    };

    // Convert "08:06 AM" to 24-hour "08:06"
    function convertTo24Hour(timeStr) {
        const [time, modifier] = timeStr.split(" ");
        let [hours, minutes] = time.split(":");

        if (modifier === "PM" && hours !== "12") {
            hours = String(parseInt(hours, 10) + 12);
        }
        if (modifier === "AM" && hours === "12") {
            hours = "00";
        }

        return `${hours.padStart(2, "0")}:${minutes}`;
    }




    const calculateTodayCounts = (data) => {
        const today = new Date();
        const formattedToday = today.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });

        const activeTodayCount = data.filter(
            (row) => row.date === formattedToday && row.status === "Active"
        ).length;

        const onLeaveTodayCount = data.filter(
            (row) => row.date === formattedToday && row.status === "Leave"
        ).length;

        setActiveToday(activeTodayCount);
        setLeaveToday(onLeaveTodayCount);
    };




    // DEPT COUNT TABLE
    const [deptDistribution, setDeptDistribution] = useState();
    const [totalDept, setTotalDept] = useState(0); // Store total count

    useEffect(() => {
        const deptRef = ref(database, "departments");
        const empRef = ref(database, "users");

        const unsubscribeDept = onValue(deptRef, (deptSnap) => {
            const deptData = deptSnap.val();

            if (deptData) {
                const deptList = Object.keys(deptData);
                setTotalDept(deptList.length);
            } else {
                setTotalDept(0);
                setDeptDistribution([]);
            }
        });

        const unsubscribeEmp = onValue(empRef, (empSnap) => {
            const empData = empSnap.val();

            if (empData) {
                // Count number of employees in each department
                const deptMap = {};

                Object.values(empData).forEach((emp, index) => {
                    // if (index < 5) console.log('EMP SAMPLE:', emp); // log first few employees

                    const rawDept = emp.department || emp.dept || emp.deptName || 'Unknown';
                    const dept = rawDept.trim();

                    // Count employees per department
                    deptMap[dept] = (deptMap[dept] || 0) + 1;
                });

                const deptDistArray = Object.entries(deptMap).map(([dept, count]) => ({
                    department: dept,
                    employees: count,
                }));


                setDeptDistribution(deptDistArray);
            } else {
                setDeptDistribution([]);
            }
        });

        return () => {
            unsubscribeDept();
            unsubscribeEmp();
        };
    }, []);




    // Dept and Role Selection
    const [departments, setDepartments] = useState([]);
    const [dept, setDept] = useState("");
    const [role, setRole] = useState("");
    const [rolesByDept, setRolesByDept] = useState({});
    const [availableRoles, setAvailableRoles] = useState([]);

    useEffect(() => {
        const deptRef = ref(database, 'departments');
        const roleMapRef = ref(database, 'roles_by_department');

        onValue(deptRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setDepartments(Object.keys(data));
            }
        });

        onValue(roleMapRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setRolesByDept(data);
            }
        });
    }, []);


    const handleDeptChange = (event) => {
        const selectedDept = event.target.value;
        setDept(selectedDept);

        // Automatically set role if mapping exists
        if (rolesByDept[selectedDept]) {
            setAvailableRoles([rolesByDept[selectedDept]]);
            setRole(rolesByDept[selectedDept]); // Optional: auto-select role
        } else {
            setAvailableRoles([]);
            setRole("");
        }
    };




    // Shift Selection Code
    const [shift, setShift] = useState("");
    const handleShiftChange = (event) => {
        setShift(event.target.value);
    };




    // Image Selection and Upload
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };




    // Enter Name, Email and Phone
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    // ADD EMPLOYEE TO DATABASE
    const handleAddEmployee = () => {

        if (!name || !email || !phone || !role || !shift || !dept || !selectedImage) {
            alert("Please fill all the fields and upload a profile picture.");
            return;
        }

        // Generate Unique User ID for every user
        const idNumber = Math.floor(Math.random() * 9999 + 1).toString().padStart(4, '0');
        const generatedId = `GIS${idNumber}`;

        // TimeStamp of Data Entry
        const timeStamp = dayjs().tz("Asia/Kolkata").format("DD MMMM YYYY [at] HH:mm:ss [UTC+5:30]");

        const employeeData = {
            created_time: timeStamp,
            email,
            id: generatedId,
            password: "thej123",
            phone: Number(phone),
            role,
            username: name,
            shift,
            dept,
            profile_pic: selectedImage || ""
        };

        const employeeRef = ref(database, `users/${generatedId}`);

        set(employeeRef, employeeData)
            .then(() => {
                alert("Employee added successfully");
                setName("");
                setEmail("");
                setPhone("");
                setRole("");
                setShift("");
                setDept("");
                setSelectedImage(null);
            })
            .catch((error) => {
                console.error("Error adding employee:", error);
                alert("Error adding employee");
            });
    };




    // SHIFT DISTRIBUTION
    const [shiftData, setShiftData] = useState([
        { id: 0, value: 0, label: 'Day Shift', color: "#087CA7" },
        { id: 1, value: 0, label: 'Evening Shift', color: "#004385" },
        { id: 2, value: 0, label: 'Night Shift', color: "#033860" },
    ]);

    useEffect(() => {
        const usersRef = ref(database, "users/");
        onValue(usersRef, (snapshot) => {
            const users = snapshot.val();
            if (users) {
                let day = 0, evening = 0, night = 0;

                Object.values(users).forEach(user => {
                    const shift = user.shift?.toLowerCase();
                    if (shift === "day") day++;
                    else if (shift === "evening") evening++;
                    else if (shift === "night") night++;
                });

                setShiftData([
                    { id: 0, value: day, label: 'Day Shift', color: "#087CA7" },
                    { id: 1, value: evening, label: 'Evening Shift', color: "#004385" },
                    { id: 2, value: night, label: 'Night Shift', color: "#033860" },
                ]);
            }
        });
    }, []);




    return (
        <div style={{ fontFamily: "Roboto" }} className='grid gap-y-4'>

            <span className='font-semibold text-2xl m-0 p-0' style={{ color: "#252627" }}>Workforce Management</span>

            <div className='grid grid-flow-col justify-between items-center'>
                <Stack direction="row" spacing={1.5} >
                    <Chip variant='outlined'
                        label='Overview'
                        sx={{
                            background: selectedWorkforceScreen === "Overview" ? "#004385" : "transparent",
                            color: selectedWorkforceScreen === "Overview" ? "white" : "#004385",
                            border: selectedWorkforceScreen === "Overview" ? "2.5px inset #004385" : "2.5px outset #004385",
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
                            border: selectedWorkforceScreen === "Attendance Tracker" ? "2.5px inset #004385" : "2.5px outset #004385",
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
                            border: selectedWorkforceScreen === "Employee Directory" ? "2.5px inset #004385" : "2.5px outset #004385",
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
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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
                        boxShadow: 24, p: 5,
                    }}>
                    <header className='grid grid-flow-col justify-between items-center'>
                        <span></span>
                        <span className='font-bold h2 text-gray-950'>Add Employee</span>
                        <CloseIcon sx={{ color: "red", fontSize: "30px", cursor: "pointer" }} onClick={addEmpModalClose} />
                    </header>
                    <hr />

                    <form onSubmit={(e) => e.preventDefault()}
                        className='grid grid-cols-2 gap-x-5 gap-y-5 items-center'>

                        <div className='col-span-2 flex items-center justify-center'>
                            <Avatar
                                onClick={handleAvatarClick}
                                src={selectedImage}
                                className=''
                                sx={{ width: 100, height: 100 }} />
                            <input type='file' accept='image/*'
                                ref={fileInputRef} onChange={handleImageChange}
                                style={{ display: "none" }} required />
                        </div>

                        <div className='flex flex-col'>
                            <label className="h6">Name</label>
                            <TextField id="outlined-basic"
                                variant="outlined"
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className="h6">Email</label>
                            <TextField id="outlined-basic"
                                variant="outlined"
                                type="email"
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className="h6">Phone Number</label>
                            <TextField id="outlined-basic"
                                variant="outlined"
                                type="tel"
                                placeholder="Enter phone number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className="h6">Shift</label>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                variant='outlined' required
                                value={shift}
                                onChange={handleShiftChange}
                                renderValue={(selected) => selected || "Select Shift"}
                                displayEmpty
                            >
                                {/* <MenuItem value="">Select role</MenuItem> */}
                                <MenuItem value={"Day"}>Day</MenuItem>
                                <MenuItem value={"Evening"}>Evening</MenuItem>
                                <MenuItem value={"Night"}>Night</MenuItem>
                            </Select>
                        </div>

                        <div className='flex flex-col'>
                            <label className="h6">Department</label>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                variant='outlined' required
                                value={dept}
                                onChange={handleDeptChange}
                                renderValue={(selected) => selected || "Select Department"}
                                displayEmpty
                            >
                                {/* <MenuItem value="">Select role</MenuItem> */}
                                {departments.map((department) => (
                                    <MenuItem key={department} value={department}>
                                        {department}
                                    </MenuItem>
                                ))};
                            </Select>
                        </div>

                        <div className='flex flex-col'>
                            <label className="h6">Role</label>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select" required
                                variant='outlined'
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                renderValue={(selected) => selected || "Select Role"}
                                displayEmpty
                            >
                                {/* <MenuItem value="">Select role</MenuItem> */}
                                {availableRoles.length > 0 ? (
                                    availableRoles.map((roleName) => (
                                        <MenuItem key={roleName} value={roleName}>
                                            {roleName}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>No roles available</MenuItem>
                                )}
                            </Select>
                        </div>

                        <Button
                            onClick={handleAddEmployee}
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



            <Modal
                open={openEditEmpModal}
                onClose={editEmpModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Card
                    className='w-3/6'
                    sx={{
                        position: 'absolute', top: '50%',
                        left: '50%', transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper', border: '1px outset #f5f5f5',
                        boxShadow: 24, p: 5,
                    }}>
                    <header className='grid grid-flow-col justify-between items-center'>
                        <span></span>
                        <span className='font-bold h2 text-gray-950'>Edit Employee</span>
                        <CloseIcon sx={{ color: "red", fontSize: "30px", cursor: "pointer" }} onClick={editEmpModalClose} />
                    </header>
                    <hr />

                    <form onSubmit={(e) => e.preventDefault()}
                        className='grid grid-cols-2 gap-x-5 gap-y-5 items-center'>

                        <div className='col-span-2 flex items-center justify-center'>
                            <Avatar
                                onClick={handleAvatarClick}
                                src={selectedImage}
                                className=''
                                sx={{ width: 100, height: 100 }} />
                            <input type='file' accept='image/*'
                                ref={fileInputRef} onChange={handleImageChange}
                                style={{ display: "none" }} required />
                        </div>

                        <div className='flex flex-col'>
                            <label className="h6">Name</label>
                            <TextField id="outlined-basic"
                                variant="outlined"
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className="h6">Email</label>
                            <TextField id="outlined-basic"
                                variant="outlined"
                                type="email"
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className="h6">Phone Number</label>
                            <TextField id="outlined-basic"
                                variant="outlined"
                                type="tel"
                                placeholder="Enter phone number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className="h6">Shift</label>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                variant='outlined' required
                                value={shift}
                                onChange={handleShiftChange}
                                renderValue={(selected) => selected || "Select Shift"}
                                displayEmpty
                            >
                                {/* <MenuItem value="">Select role</MenuItem> */}
                                <MenuItem value={"Day"}>Day</MenuItem>
                                <MenuItem value={"Evening"}>Evening</MenuItem>
                                <MenuItem value={"Night"}>Night</MenuItem>
                            </Select>
                        </div>

                        <div className='flex flex-col'>
                            <label className="h6">Department</label>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                variant='outlined' required
                                value={dept}
                                onChange={handleDeptChange}
                                renderValue={(selected) => selected || "Select Department"}
                                displayEmpty
                            >
                                {/* <MenuItem value="">Select role</MenuItem> */}
                                {departments.map((department) => (
                                    <MenuItem key={department} value={department}>
                                        {department}
                                    </MenuItem>
                                ))};
                            </Select>
                        </div>

                        <div className='flex flex-col'>
                            <label className="h6">Role</label>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select" required
                                variant='outlined'
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                renderValue={(selected) => selected || "Select Role"}
                                displayEmpty
                            >
                                {/* <MenuItem value="">Select role</MenuItem> */}
                                {availableRoles.length > 0 ? (
                                    availableRoles.map((roleName) => (
                                        <MenuItem key={roleName} value={roleName}>
                                            {roleName}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>No roles available</MenuItem>
                                )}
                            </Select>
                        </div>

                        <Button
                            onClick={handleEditEmployee}
                            variant='contained'
                            className='col-span-2 py-2'
                            size='medium'
                            style={{
                                background: "#004385", borderRadius: "5px", fontSize: "1rem",
                            }}>
                            Edit Employee
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
                                    <span className='text-2xl font-black text-gray-900'>{totalEmployees}</span>
                                </div>
                            </Card>
                            <Card className='flex items-center gap-x-3 p-3 shadow-sm'>
                                <SchemaIcon
                                    className='rounded-md transform -scale-x-100'
                                    style={{ fontSize: "3.3rem", color: "#031A6B", padding: "0.5rem", background: "rgba(5, 178, 220, 0.25)" }} />
                                <div className='flex flex-col'>
                                    <span className='text-lg'>Total Departments</span>
                                    <span className='text-2xl font-black text-gray-900'>{totalDept}</span>
                                </div>
                            </Card>
                            <Card className='flex items-center gap-x-3 p-3 shadow-sm'>
                                <CheckIcon
                                    className='rounded-md'
                                    style={{ fontSize: "3.3rem", color: "#031A6B", padding: "0.5rem", background: "rgba(5, 178, 220, 0.25)" }} />
                                <div className='flex flex-col'>
                                    <span className='text-lg'>Active Today</span>
                                    <span className='text-2xl font-black text-gray-900'>{activeToday}</span>
                                </div>
                            </Card>
                            <Card className='flex items-center gap-x-3 p-3 shadow-sm'>
                                <ApprovalIcon
                                    className='rounded-md'
                                    style={{ fontSize: "3.3rem", color: "#031A6B", padding: "0.5rem", background: "rgba(5, 178, 220, 0.25)" }} />
                                <div className='flex flex-col'>
                                    <span className='text-lg'>On Leave</span>
                                    <span className='text-2xl font-black text-gray-900'>{leaveToday}</span>
                                </div>
                            </Card>
                        </div>

                        <div className='grid grid-cols-5 gap-x-4'>

                            <Card className='px-3 py-2.5 shadow-sm col-span-3 flex flex-col'>
                                <span className='text-lg'>Department Distribution</span>
                                {deptDistribution && deptDistribution.length > 0 ? (
                                    <BarChart className='!p-0 !m-0'
                                        dataset={deptDistribution} // Add the dataset here
                                        xAxis={[{ scaleType: 'band', dataKey: 'department', tickLabelStyle: { fontSize: 10 } }]}
                                        series={[{ dataKey: 'employees', label: 'Number of Employees' }]}
                                        height={150} width={680}
                                        margin={{ top: 20, right: 10, bottom: 10, left: 0 }}
                                    />
                                ) : (
                                    <div className='text-sm text-gray-500 py-4'>No data available</div>
                                )}
                            </Card>

                            <Card className='px-3 py-2.5 shadow-sm col-span-2'>
                                <span className='text-lg'>Attendance Rate</span>
                                <BarChart
                                    dataset={attendanceDataset}
                                    xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                                    series={[{ dataKey: 'rate', label: 'Attendance Rate (%)' }]}
                                    height={150} margin={{ top: 20, right: 10, bottom: 10, left: 0 }}
                                />
                            </Card>
                        </div>

                        <div className='grid grid-cols-3 gap-x-4 '>
                            <Card className='px-3 py-2.5 col-span-1 shadow-sm'>
                                <span className='text-lg'>Shift Distribution</span>
                                <PieChart
                                    series={[
                                        {
                                            data: shiftData,
                                        },
                                    ]}
                                    width={180}
                                    height={180}
                                    margin={{ top: 5, right: 10, bottom: 0, left: 0 }}
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
                                            {attendanceTable
                                                .sort((a, b) => new Date(`${b.date} ${b.in_time}`) - new Date(`${a.date} ${a.in_time}`))
                                                .slice(0, 2)
                                                .map((row) => (
                                                    <TableRow
                                                        key={row.id}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            {row.date}
                                                        </TableCell>
                                                        <TableCell align="start">{row.name}</TableCell>
                                                        <TableCell align="start">{row.shift}</TableCell>
                                                        <TableCell align="start">{row.in_time}</TableCell>
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
                            {/* <Button variant='outlined' onClick={handleUpdate} >Update In-Time</Button> */}
                            <TableContainer sx={{ maxHeight: 560 }}>
                                <Table stickyHeader aria-label="simple table">
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
                                        {attendanceTable.map((row, index) => (
                                            <TableRow key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.date}
                                                </TableCell>
                                                <TableCell align="start">{row.name}</TableCell>
                                                <TableCell align="start">{row.shift}</TableCell>
                                                <TableCell align="start">{row.in_time}</TableCell>
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
                                        {visibleCount < attendanceData.length && (
                                            <TableRow className=''>
                                                <TableCell colSpan={5} align='center' className=''>
                                                    <Button variant='outlined'
                                                        onClick={handleLoadMore}
                                                        className='w-7/12 font-bold border-2'>
                                                        Load More
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )}
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
                                <Table stickyHeader aria-label="simple table" className='whitespace-nowrap'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }}>Profile</TableCell>
                                            <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }}>UID</TableCell>
                                            <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }}>Name</TableCell>
                                            <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }} align="start">Department</TableCell>
                                            <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }} align="start">Role</TableCell>
                                            <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }} align="start">Shift</TableCell>
                                            <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }} align="start">Contact</TableCell>
                                            <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }} align="start">Joining Date</TableCell>
                                            <TableCell style={{ fontSize: "0.9rem", fontWeight: "600" }} align="center">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {sortedData.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    <Avatar src={row.profile_pic} />
                                                </TableCell>
                                                <TableCell align="start">{row.id}</TableCell>
                                                <TableCell component="th" scope="row">
                                                    {row.username}
                                                </TableCell>
                                                <TableCell align="start">{row.dept}</TableCell>
                                                <TableCell align="start">{row.role}</TableCell>
                                                <TableCell align="start">{row.shift}</TableCell>
                                                <TableCell align="start">{row.phone}</TableCell>
                                                <TableCell align="start">{row.created_time.split(" at")[0]}</TableCell>
                                                <TableCell align='center'>
                                                    <div className='flex justify-center gap-3 w-full'>

                                                        <IconButton className='!h-9 rounded-md'
                                                            sx={{ color: '#fff', backgroundColor: '#004385', '&:hover': { backgroundColor: '#003366' } }}
                                                            onClick={() => editEmpModalOpen(row)}>
                                                            <EditSquareIcon />
                                                        </IconButton>

                                                        <IconButton className='!h-9 rounded-md'
                                                            sx={{ color: '#fff', backgroundColor: '#262524', '&:hover': { backgroundColor: '#353637' } }}
                                                            onClick={() => handleDelete(row.id)}>
                                                            <DeleteForeverIcon />
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
                }


            </div>


        </div>
    );
}

export default WorkForceManagement;
