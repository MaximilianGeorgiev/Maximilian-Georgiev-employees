import useEmployeeUploader from "../hooks/useEmployeeUploader"

const EmployeeUploader = () => {
    const { handleFileUpload } = useEmployeeUploader();

    return (
        <input type="file" onChange={handleFileUpload} />
    );
};


export default EmployeeUploader;