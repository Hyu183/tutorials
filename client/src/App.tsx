import {  useEffect, useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Layout from './components/Layout';
import Login from './components/Login';
import Profile from './components/Profile';
import Register from './components/Register';
import {  useAuthContext } from './contexts/AuthContext';

function App() {
    const {checkAuth} =useAuthContext();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
    
      const authenticate = async ()=>{
          await checkAuth();
          setLoading(false);
      }
      authenticate();
    }, [])
    
    if(loading) return <h1>Loading</h1>
    return <div className='App'>
        <BrowserRouter>
        <Routes>
            <Route path='/' element={<Layout/>}>
                <Route index element={<Home/>} />
                <Route path='profile' element={<Profile/>} />
                <Route path='login' element={<Login/>} />
                <Route path='register' element={<Register/>} />
            </Route>
        </Routes>
        </BrowserRouter>
    </div>;
}

export default App;
