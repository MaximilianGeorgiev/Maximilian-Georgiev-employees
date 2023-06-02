import Button from '@mui/material/Button';
import UploadIcon from '@mui/icons-material/Upload';

const EmployeeUploader = ({ handleFileUpload }) => {
    return (
        <>
            <Button
                variant="contained"
                component="label"
                fullWidth
                endIcon={<UploadIcon />}
            >
                Upload CSV File
                <input hidden type="file" onChange={handleFileUpload} />
            </Button>
        </>
    );
};

export default EmployeeUploader;