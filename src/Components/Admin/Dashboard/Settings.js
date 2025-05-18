// import { ref, set } from 'firebase/database';
import React from 'react';
// import { database } from '../../../firebase';
// import { Button } from '@mui/material';

const Settings = () => {

    // const saveSettings = () => {
    //     set(ref(database, "settings"), { discount: 15 })
    //         .then(() => console.log("Settings saved successfully"))
    //         .catch((error) => console.error("Error saving settings:", error));
    // };

    return (
        <div style={{ fontFamily: "Roboto" }} className='grid gap-y-4'>

            <span className='font-semibold text-2xl m-0 p-0' style={{ color: "#252627" }}>Settings</span>

            <div className="dashboard">

                <h1>Welcome to Settings</h1>
                {/* <Button onClick={saveSettings}>Create Node</Button> */}

            </div>

        </div>
    );
}

export default Settings;
