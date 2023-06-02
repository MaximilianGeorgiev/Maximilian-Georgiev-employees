import { useEffect, useState } from "react";
import DynamicNotification from "./DynamicNotification";
import ProjectsInfo from "./ProjectsInfo";

const EmployeeResult = ({ fetchedData }) => {
    const [notificationMessage, setNotificationMessage] = useState("");

    useEffect(() => {
        if (fetchedData?.pairFound) {
            const { longestPair } = fetchedData;

            setNotificationMessage(`The pair that has worked together the longest is ${longestPair.employeeOne} and ${longestPair.employeeTwo}.
             They have worked together for ${longestPair.totalTime} days. They worked on the following projects: `);
        } else if (fetchedData?.errorOccured) setNotificationMessage("An error has occured during file upload and parsing.");
        else setNotificationMessage(`No pair of employees was found for the provided dataset.`);

    }, [fetchedData]);

    return (
        <>
            <DynamicNotification variant="h6" message={notificationMessage} />
            <ProjectsInfo fetchedData={fetchedData} />
        </>
    );
};

export default EmployeeResult;