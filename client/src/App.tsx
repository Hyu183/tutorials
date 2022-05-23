import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Layout from './components/Layout';
import Login from './components/Login';
import Profile from './components/Profile';
import Register from './components/Register';

function App() {
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
