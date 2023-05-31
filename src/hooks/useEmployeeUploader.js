import { useEffect, useState } from "react";
import Papa from 'papaparse';

const useEmployeeUploader = () => {
    const [fetchedData, setFetchedData] = useState();

    useEffect(() => {
        console.log("test " + JSON.stringify(fetchedData))
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
        let projectPairs;

        // Iterate through projects from data set and determine possible pairs for each one
        data.forEach(record => {
            // file format is enforced and the indexes correspond
            const employeeInfo = {
                employeeId: record[0],
                projectId: record[1],
                startDate: record[2],
                endDate: record[3],
            };


            data.forEach((innerRecord) => {
                const innerEmployeeInfo = {
                    employeeId: innerRecord[0],
                    projectId: innerRecord[1],
                    startDate: innerRecord[2],
                    endDate: innerRecord[3],
                };

                if (employeeInfo.projectId === innerEmployeeInfo.projectId) {
                    // Consider only the pairs that have overlapping periods of time
                    if (employeeInfo.startDate < innerEmployeeInfo.endDate && innerEmployeeInfo.startDate < employeeInfo.endDate) {
                            const periodStart = employeeInfo.startDate >= innerEmployeeInfo.startDate ? employeeInfo.startDate : innerEmployeeInfo.startDate;
                            const periodEnd = employeeInfo.endDate <= innerEmployeeInfo.endDate ? employeeInfo.endDate : innerEmployeeInfo.endDate;

                            projectPairs.push({
                                employeeOne: employeeInfo.employeeId,
                                employeeTwo: innerEmployeeInfo.employeeId,
                                period: periodEnd - periodStart,
                            });
                    } else if (employeeInfo.endDate === "NULL" || employeeInfo.endDate === null) {
                        const periodStart = employeeInfo.startDate >= innerEmployeeInfo.startDate ? employeeInfo.startDate : innerEmployeeInfo.startDate;
                        const periodEnd = Date.now() - (employeeInfo.endDate === "NULL" ? innerEmployeeInfo.endDate : employeeInfo.endDate);
                        
                        projectPairs.push({
                            employeeOne: employeeInfo.employeeId,
                            employeeTwo: innerEmployeeInfo.employeeId,
                            period: periodEnd - periodStart,
                        })
                    }
                }

                
            });

        });
        

        // Every project now has all pairs that have formed

        // Compare every pair for every project with other projects and if the pair exists in another project as well sum up their time together
        setFetchedData(data);
    };

    const handleParsedFileFailure = (err) => {
    };

    return { fetchedData, setFetchedData, readCSVFile, handleParsedFileSuccess, handleFileUpload };
};

export default useEmployeeUploader;