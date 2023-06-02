import './App.css';
import EmployeeUploader from './components/EmployeeUploader';
import useEmployeeUploader from './hooks/useEmployeeUploader';
import EmployeeResult from './components/EmployeeResult';
import Container from '@mui/material/Container';
import { DateFormats } from './utils/csv/dateFormats';

function App() {
  const { fetchedData, handleFileUpload } = useEmployeeUploader(DateFormats.SampleDataFormat);

  return (
    <Container>
      <EmployeeUploader handleFileUpload={handleFileUpload} />
      {!fetchedData?.initialLoad && <EmployeeResult fetchedData={fetchedData} />}
    </Container>
  );
}

export default App;
