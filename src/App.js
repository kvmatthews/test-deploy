import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const Login = lazy(() => import("./pages/Login_Page"));
const Register = lazy(() => import('./pages/Register_Page'));
const HomePage = lazy(() => import('./pages/Home_Page'));
const Navigasi = lazy(() => import("./components/NavigationComp"));
const TopUpPage = lazy(() => import('./pages/TopUp_Page'));
const DataProfile = lazy(() => import('./components/DataProfileComp'));
const ServicePage = lazy(() => import('./pages/Service_Page'));
const TransactionPage = lazy(() => import('./pages/Transaction_Page'));
const AccountPage = lazy(() => import('./pages/AccountPage'));


function App() {
  return (
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/home' element={<><Navigasi/><DataProfile/><HomePage /></>} />
          <Route path='/topup' element={<><Navigasi/><DataProfile/><TopUpPage /></>} />
          <Route path='/service/:id' element={<><Navigasi/><DataProfile/><ServicePage/></>} />
          <Route path='/transaction' element={<><Navigasi/><DataProfile/><TransactionPage/></>} />
          <Route path='/akun' element={<><Navigasi/><AccountPage/></>} />
          <Route path='*' element={<h1>404 Not Found</h1>} />
        </Routes>
      </Suspense>
  );
}

export default App;
