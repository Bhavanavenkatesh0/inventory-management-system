import { get, ref, update } from "firebase/database";
import { database } from "../../firebase";

export async function updateAbsentInTimes() {
    const attendanceRef = ref(database, 'attendance');

    try {
        const snapshot = await get(attendanceRef);
        if (snapshot.exists()) {
            const data = snapshot.val();
            const updates = {};

            Object.entries(data).forEach(([key, entry]) => {
                if (entry.status === "Absent" || entry.status === "Leave") {
                    updates[`attendance/${key}/in_time`] = "--NIL--";
                }
            });

            await update(ref(database), updates);
            console.log("Successfully updated in_time to '--NIL--' for all 'Absent' entries.");
        } else {
            console.log("No attendance data found.");
        }
    } catch (error) {
        console.error("Error updating data:", error);
    }
}

updateAbsentInTimes();
