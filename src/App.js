import './App.css';
import EmployeeUploader from './components/EmployeeUploader';
import useEmployeeUploader from './hooks/useEmployeeUploader';
import EmployeeResult from './components/EmployeeResult';
import Container from '@mui/material/Container';
import { DateFormats } from './utils/dateFormats';

function App() {
  // File uploading is configured to work with multiple date formats. The hook expects a date format corresponding to the formats in the .csv dataset which will be provided
  const { fetchedData, handleFileUpload } = useEmployeeUploader(DateFormats.BulgarianFormat);

  return (
    <Container>
      <EmployeeUploader handleFileUpload={handleFileUpload} />
      {!fetchedData?.initialLoad && <EmployeeResult fetchedData={fetchedData} />}
    </Container>
  );
}

export default App;
