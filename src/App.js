import './App.css';
import EmployeeUploader from './components/EmployeeUploader';
import useEmployeeUploader from './hooks/useEmployeeUploader';
import EmployeeResult from './components/EmployeeResult';
import Container from '@mui/material/Container';

function App() {
  const { fetchedData, handleFileUpload } = useEmployeeUploader("en-US");

  return (
    <Container>
      <EmployeeUploader handleFileUpload={handleFileUpload} />
      {!fetchedData?.initialLoad && <EmployeeResult fetchedData={fetchedData} />}
    </Container>
  );
}

export default App;
