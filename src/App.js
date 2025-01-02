import './App.css';
import AddName from './Components/AddName';
import Header from './Components/Header';
import Main from './Components/Main';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/add-name" element={<AddName />} />
      </Routes>
    </Router>
  );
}
export default App;
