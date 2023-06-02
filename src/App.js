import './App.css';
import EmployeeUploader from './components/EmployeeUploader';
import useEmployeeUploader from './hooks/useEmployeeUploader';
import EmployeeResult from './components/EmployeeResult';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';

function App() {
  const { fetchedData, handleFileUpload } = useEmployeeUploader();

  return (
    <Container>
      <EmployeeUploader handleFileUpload={handleFileUpload} />
      <EmployeeResult fetchedData={fetchedData} />
    </Container>
  );
}

export default App;
