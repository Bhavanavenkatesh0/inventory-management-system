import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/images/LogoSquare.svg'
import { ChevronLeft, LogOutIcon } from 'lucide-react';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
// import InsightsIcon from '@mui/icons-material/Insights';
// import SettingsIcon from '@mui/icons-material/Settings';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { styled, Tooltip, tooltipClasses } from '@mui/material';
import WorkForceManagement from './WorkForceManagement';
import { ref, onValue } from "firebase/database";
import InventoryManagement from './InventoryManagement';
import DashboardContent from './DashboardContent';
import SalesBilling from './Sales&Billing';
// import ReportingAnalytics from './Reporting&Analytics';
// import Settings from './Settings';
import { database } from '../../../firebase';


const Dashboard = () => {

    const role = localStorage.getItem("userRole");
    const username = localStorage.getItem("userName");
    const userid = localStorage.getItem("userID");
    const navigate = useNavigate();

    const [profilePic, setProfilePic] = useState("");
    const [open, setOpen] = useState(true);
    const [fullyExpanded, setFullyExpanded] = useState(false);
    const [listItemFullyExpanded, setListItemFullyExpanded] = useState(false);

    const [selectedMenu, setSelectedMenu] = useState(() => localStorage.getItem("selectedMenu") || "Dashboard");

    useEffect(() => {
        const userRef = ref(database, `users/${userid}`); // Adjust path if needed

        const unsubscribe = onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                // If profile_pic is base64 encoded string (without prefix)
                if (data.profile_pic) {
                    const base64Image = `${data.profile_pic}`;
                    setProfilePic(base64Image);
                } else {
                    setProfilePic("/default-avatar.png"); // fallback image
                }
            }
        });
        return () => unsubscribe();
    }, [userid]);

    // Check login status
    useEffect(() => {
        const loggedIn = localStorage.getItem("isLoggedIn");
        if (loggedIn !== "true") {
            navigate("/signin");
        }
    }, [navigate]);

    useEffect(() => {
        setTimeout(() => setListItemFullyExpanded(open), 50);
        setTimeout(() => setFullyExpanded(open), 200);
    }, [open]);

    useEffect(() => {
        localStorage.setItem("selectedMenu", selectedMenu);
    }, [selectedMenu]);

    const LightTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: "#004385",
            color: '#ffffff',
            boxShadow: theme.shadows[1],
            fontSize: 12,
        },
    }));

    // Logout handler
    const handleLogout = () => {
        localStorage.clear();
        navigate("/signin");
    };

    const Menus = [
        { title: "Dashboard", Icon: DashboardIcon },
        { title: "Workforce Management", Icon: SupervisedUserCircleIcon },
        { title: "Inventory Management", Icon: WarehouseIcon },
        { title: "Sales & Billing", Icon: RequestQuoteIcon },
        // { title: "Reporting & Analytics", Icon: InsightsIcon },
        // { title: "Settings", Icon: SettingsIcon }
    ];

    const renderContent = () => {
        switch (selectedMenu) {
            case "Dashboard": return <DashboardContent />;
            case "Workforce Management": return <WorkForceManagement />;
            case "Inventory Management": return <InventoryManagement />;
            case "Sales & Billing": return <SalesBilling />;
            // case "Reporting & Analytics": return <ReportingAnalytics />;
            // case "Settings": return <Settings />;
            default: return <h1>Welcome!</h1>;
        }
    };

    return (
        <div className='flex'>
            <div className={`${open ? "w-72 pl-4 pt-8" : "w-20 pl-4 pt-8"}  duration-300 h-screen relative`} style={{ backgroundColor: "#031A6B" }}>
                <ChevronLeft
                    className={`absolute cursor-pointer bg-white rounded-full -right-3 top-9 w-7 h-7 border-2
                        ${!open && "rotate-180"}`}
                    style={{ border: "1px outset #05B2DC", color: "031A6B" }}
                    onClick={() => setOpen(!open)} />
                <div className='flex items-baseline gap-x-2'>
                    <img src={logo} alt='' width="36px" height="36px"
                        className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"} `} />
                    <h1 className={`text-white origin-left whitespace-nowrap font-light text-3xl duration-300 ${!open && "scale-0"}`}>Marble & Might</h1>
                </div>

                <ul className="pt-5 pr-4 pl-0 flex flex-col gap-y-2 justify-start">
                    {Menus.map((menu, index) => (
                        <React.Fragment key={index}>
                            {!open ? (
                                <LightTooltip title={menu.title} placement='right' className='ml-1' disableInteractive>
                                    <li
                                        onClick={() => setSelectedMenu(menu.title)}
                                        className={`text-gray-300 text-sm flex items-center justify-start whitespace-nowrap duration-200 origin-left cursor-pointer py-2 px-2 hover:bg-light-white rounded-md mt-2 ${selectedMenu === menu.title ? "bg-light-white" : ""}`}
                                    >
                                        <menu.Icon className={`${!open ? "ml-1" : ""}`} />
                                        {listItemFullyExpanded && (
                                            <span className={`${!open && "hidden"} origin-left duration-200 ${!open && "scale-0"}`}>
                                                {menu.title}
                                            </span>
                                        )}
                                    </li>
                                </LightTooltip>
                            ) : (
                                <li
                                    onClick={() => setSelectedMenu(menu.title)}
                                    className={`text-gray-300 text-sm flex items-center justify-start whitespace-nowrap duration-200 origin-left gap-x-3 cursor-pointer py-2 px-2 hover:bg-light-white rounded-md mt-2 ${selectedMenu === menu.title ? "bg-light-white" : ""}`}
                                >
                                    <menu.Icon />
                                    {listItemFullyExpanded && (
                                        <span className={`${!open && "hidden"} origin-left duration-200 ${!open && "scale-0"}`}>
                                            {menu.title}
                                        </span>
                                    )}
                                </li>
                            )}
                        </React.Fragment>
                    ))}
                </ul>

                <div className='absolute bottom-4 left-4 text-white flex items-center justify-start w-64 gap-x-3'>
                    <img src={profilePic}
                        className={`rounded-md w-12 border-2 cursor-pointer`} alt={username} onClick={() => setOpen(!open)} />
                    <div className={`${!open && "hidden"} flex items-center justify-between w-full origin-left duration-200 `}>
                        <div>
                            <p className='text-lg font-normal p-0 m-0'>{username}</p>
                            <p className='text-sm font-light p-0 m-0'>{role}</p>
                        </div>
                        {fullyExpanded && (
                            <LogOutIcon onClick={handleLogout} className='border-2 rounded-md h-10 w-10 p-2 cursor-pointer origin-left duration-200' style={{ background: "#004385" }} />
                        )}
                    </div>
                </div>
            </div>
            <div className='contentContainer p-7 text-2xl fw-semibold flex-1 h-screen'>
                {renderContent()}
            </div>
        </div>
    );
}

export default Dashboard;
