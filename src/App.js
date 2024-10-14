import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from "./pages/LoginFiles/Login_Page";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='*' element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}

export default App;
