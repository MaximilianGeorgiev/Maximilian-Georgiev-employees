import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const ProjectsInfo = ({ fetchedData }) => {
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Employee ID #1</TableCell>
                        <TableCell>Employee ID #2</TableCell>
                        <TableCell>Project ID</TableCell>
                        <TableCell>Days worked together</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {typeof fetchedData !== "undefined" && fetchedData.projectsInfo.map((row) => (
                        <TableRow>
                            <TableCell>{row.employeeOne}</TableCell>
                            <TableCell>{row.employeeTwo}</TableCell>
                            <TableCell>{row.projectId}</TableCell>
                            <TableCell>{row.period}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ProjectsInfo;