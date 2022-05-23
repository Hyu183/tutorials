import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
    return <div>
        <h1>JWT AUTHENTICATION FULLSTACK</h1>
        <nav style={{borderBottom:'1px solid', paddingBottom:'1rem'}}>
            <Link to='.'>Home</Link>|
            <Link to='profile'>Profile</Link>|
            <Link to='login'>Login</Link>|
            <Link to='register'>Register</Link>
        </nav>
        <Outlet/>
    </div>
};

