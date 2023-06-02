import { useState } from "react";
import Papa from 'papaparse';
import { DateTime } from "luxon";

const useEmployeeUploader = (inputDataFormat) => {
    const [fetchedData, setFetchedData] = useState({
        initialLoad: true,
        pairFound: false,
        errorOccured: false, // error during file upload
        longestPair: null, // {employeeOne, employeeTwo, totalAmount}
        projectsInfo: null, // [{employeeOne, employeeTwo, period, projectId}, ...] store all pairs along with the project they worked for and the period
    });

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

        const currentTimestamp = DateTime.now();

        // Iterate through projects from data set and determine possible pairs for each one
        data.forEach(record => {
            // file format is enforced and the indexes correspond
            const employeeInfo = {
                employeeId: record[0],
                projectId: record[1],
                startDate: record[2] === "NULL" ? currentTimestamp : DateTime.fromFormat(record[2], inputDataFormat),
                endDate: record[3] === "NULL" ? currentTimestamp : DateTime.fromFormat(record[3], inputDataFormat),
            };

            data.forEach((comparableRecord) => {
                const comparableEmployeeInfo = {
                    employeeId: comparableRecord[0],
                    projectId: comparableRecord[1],
                    startDate: comparableRecord[2] === "NULL" ? currentTimestamp : DateTime.fromFormat(comparableRecord[2], inputDataFormat),
                    endDate: comparableRecord[3] === "NULL" ? currentTimestamp : DateTime.fromFormat(comparableRecord[3], inputDataFormat)
                };

                if (comparableEmployeeInfo.employeeId === employeeInfo.employeeId) return;

                if (employeeInfo.projectId === comparableEmployeeInfo.projectId) {
                    let overlapPeriodStart;
                    let overlapPeriodEnd;

                    // Consider only the pairs that have overlapping periods of time
                    if (employeeInfo.startDate <= comparableEmployeeInfo.endDate && employeeInfo.endDate >= comparableEmployeeInfo.endDate) {
                        overlapPeriodStart = Math.max(employeeInfo.startDate, comparableEmployeeInfo.startDate);
                        overlapPeriodEnd = Math.min(employeeInfo.endDate, comparableEmployeeInfo.endDate);
                    }

                    if (typeof overlapPeriodStart !== "undefined" && typeof overlapPeriodEnd !== "undefined") {
                        /* Avoid dublicate records
                        If [143, 218] is added for projectID 10 then we shouldn't add [218,143] for projectID 10 */
                        if (typeof projectPairs.find(pair => ((pair.employeeOne === employeeInfo.employeeId && pair.employeeTwo === employeeInfo.employeeId)
                            || (pair.employeeOne === comparableEmployeeInfo.employeeId && pair.employeeTwo === comparableEmployeeInfo.employeeId))
                            && pair.projectId === employeeInfo.projectId) === "undefined")
                            projectPairs.push({
                                employeeOne: employeeInfo.employeeId,
                                employeeTwo: comparableEmployeeInfo.employeeId,
                                period: overlapPeriodEnd - overlapPeriodStart,
                                projectId: employeeInfo.projectId,
                            });
                    }
                }
            });
        });

        if (projectPairs.length === 0) {
            setFetchedData({
                initialLoad: false,
                pairFound: false,
            });

            return;
        }

        // Every project now has all pairs that have formed for it
        // Compare every pair for every project with other projects and if the pair exists in another project as well sum up their time together to find out the most time
        const pairsTotalTime = projectPairs.map(({ employeeOne, employeeTwo }) => ({ employeeOne, employeeTwo, totalTime: 0 }));

        projectPairs.forEach((projectPair) => {
            let pairTotalTime = pairsTotalTime.find((comparablePair) => (projectPair.employeeOne === comparablePair.employeeOne && projectPair.employeeTwo === comparablePair.employeeTwo)
                || ((projectPair.employeeOne === comparablePair.employeeTwo && projectPair.employeeTwo === comparablePair.employeeOne)));

            if (typeof pairTotalTime !== "undefined") {
                pairTotalTime.totalTime += projectPair.period;
                pairsTotalTime[pairsTotalTime.indexOf(pairTotalTime)] = pairTotalTime;
            }
        });

        pairsTotalTime.sort((pairOne, pairTwo) => pairTwo.totalTime - pairOne.totalTime);

        const longestPair = pairsTotalTime[0];
        longestPair.totalTime = Math.floor(longestPair.totalTime / (24 * 60 * 60 * 1000)); // convert previously stored time in miliseconds to days

        const longestPairProjectsInfo = projectPairs.filter((pair) => (pair.employeeOne === longestPair.employeeOne && pair.employeeTwo === longestPair.employeeTwo)
            || (pair.employeeOne === longestPair.employeeTwo && pair.employeeTwo === longestPair.employeeOne));
        longestPairProjectsInfo.forEach((projectInfo) => projectInfo.period = Math.floor(projectInfo.period / (24 * 60 * 60 * 1000)));

        setFetchedData({
            initialLoad: false,
            pairFound: true,
            longestPair: longestPair,
            projectsInfo: longestPairProjectsInfo,
        });
    };

    const handleParsedFileFailure = (err) => {
        setFetchedData({
            errorOccured: true,
        })
    };

    return { fetchedData, setFetchedData, readCSVFile, handleParsedFileSuccess, handleFileUpload };
};

export default useEmployeeUploader;