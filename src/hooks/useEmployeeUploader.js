import { useEffect, useState } from "react";
import Papa from 'papaparse';

const useEmployeeUploader = () => {
    const [fetchedData, setFetchedData] = useState();

    useEffect(() => {
    }, [fetchedData]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        readCSVFile(file);
    };

    const readCSVFile = (file) => {
        Papa.parse(file, {
            header: false,
            encoding: "utf8",
            complete: handleParsedFileSuccess,
            error: handleParsedFileFailure,
        });
    };

    const handleParsedFileSuccess = ({ data }) => {
        let projectPairs = [];

        const currentTimestamp = Date.now();

        // Iterate through projects from data set and determine possible pairs for each one
        data.forEach(record => {
            // file format is enforced and the indexes correspond
            const employeeInfo = {
                employeeId: record[0],
                projectId: record[1],
                startDate: record[2] === "NULL" ? currentTimestamp : new Date(record[2]).getTime(),
                endDate: record[3] === "NULL" ? currentTimestamp : new Date(record[3]).getTime(),
            };


            data.forEach((innerRecord) => {
                const innerEmployeeInfo = {
                    employeeId: innerRecord[0],
                    projectId: innerRecord[1],
                    startDate: innerRecord[2] === "NULL" ? currentTimestamp : new Date(innerRecord[2]).getTime(),
                    endDate: innerRecord[3] === "NULL" ? currentTimestamp : new Date(innerRecord[3]).getTime(),
                };

                if (innerEmployeeInfo.employeeId === employeeInfo.employeeId) return;

                if (employeeInfo.projectId === innerEmployeeInfo.projectId) {
                    let overlapPeriodStart;
                    let overlapPeriodEnd;

                    // Consider only the pairs that have overlapping periods of time
                    if (employeeInfo.startDate < innerEmployeeInfo.endDate && innerEmployeeInfo.startDate < employeeInfo.endDate) {
                        overlapPeriodStart = employeeInfo.startDate >= innerEmployeeInfo.startDate ? employeeInfo.startDate : innerEmployeeInfo.startDate;
                        overlapPeriodEnd = employeeInfo.endDate <= innerEmployeeInfo.endDate ? employeeInfo.endDate : innerEmployeeInfo.endDate;
                    } else if (employeeInfo.endDate === currentTimestamp || innerEmployeeInfo.endDate === currentTimestamp) {
                        overlapPeriodStart = employeeInfo.startDate >= innerEmployeeInfo.startDate ? employeeInfo.startDate : innerEmployeeInfo.startDate;
                        overlapPeriodEnd = currentTimestamp - (employeeInfo.endDate === currentTimestamp ? innerEmployeeInfo.endDate : employeeInfo.endDate);
                    }

                    if (typeof overlapPeriodStart !== "undefined" && typeof overlapPeriodEnd !== "undefined") {
                        /* Avoid dublicate records
                        If [143, 218] is added for projectID 10 then we shouldn't add [218,143] for projectID 10 */

                        // TO DO: Fix clause
                        if (typeof projectPairs.find(pair => (pair.employeeOne === employeeInfo.employeeId || pair.employeeOne === innerEmployeeInfo.employeeId)
                            && pair.projectId === employeeInfo.projectId) === "undefined")
                            projectPairs.push({
                                employeeOne: employeeInfo.employeeId,
                                employeeTwo: innerEmployeeInfo.employeeId,
                                period: overlapPeriodStart - overlapPeriodEnd,
                                projectId: employeeInfo.projectId,
                            });
                    }
                }
            });
        });

        // Every project now has all pairs that have formed for it
        // Compare every pair for every project with other projects and if the pair exists in another project as well sum up their time together to find out the most time
        const pairsTotalTime = projectPairs.map(({ employeeOne, employeeTwo }) => ({ employeeOne, employeeTwo, totalTime: 0 }));

        projectPairs.forEach((projectPair) => {
            let pairTotalTime = pairsTotalTime.find((innerPair) => projectPair.employeeOne === innerPair.employeeOne && projectPair.employeeTwo === innerPair.employeeTwo);

            if (typeof pairTotalTime !== "undefined") {
                pairTotalTime.totalTime += projectPair.period;
                pairsTotalTime[pairsTotalTime.indexOf(pairTotalTime)] = pairTotalTime;
            }
        });

        pairsTotalTime.sort((pairOne, pairTwo) => pairTwo.totalTime - pairOne.totalTime);

       
        const longestPair = pairsTotalTime[0];
        setFetchedData({
            longestPair: longestPair,
            projectsInfo: projectPairs.filter((pair) => pair.employeeOne === longestPair.employeeOne && pair.employeeTwo === longestPair.employeeTwo)
        });
    };

    const handleParsedFileFailure = (err) => {
    };

    return { fetchedData, setFetchedData, readCSVFile, handleParsedFileSuccess, handleFileUpload };
};

export default useEmployeeUploader;