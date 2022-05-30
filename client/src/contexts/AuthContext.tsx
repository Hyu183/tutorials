import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';
import '../utils/jwt';
import JWTManager from '../utils/jwt';

interface IAuthContext {
    isAuthenticated: boolean;
    setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
    checkAuth: () => Promise<void>;
    logoutClient: ()=> void;
}

const defaultAuthenticateState = false;

export const AuthContext = createContext<IAuthContext>({
    isAuthenticated: defaultAuthenticateState,
    setIsAuthenticated: () => {},
    checkAuth: () => Promise.resolve(),
    logoutClient: ()=>{}
    // logout: ()=>{}
});

export const useAuthContext = ()=>useContext(AuthContext)

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        defaultAuthenticateState
    );

    const checkAuth = async () => {
        const token = JWTManager.getToken();
        if (token) setIsAuthenticated(true);
        else {
            const success = await JWTManager.getRefreshToken();
            if (success) {
                setIsAuthenticated(true);
            } else setIsAuthenticated(false);
        }
    };

    const logoutClient = ()=>{
        JWTManager.deleteToken();
        setIsAuthenticated(false);
    }

    const AuthContextData = {
        isAuthenticated,
        setIsAuthenticated,
        checkAuth,
        logoutClient,
    };
    return (
        <AuthContext.Provider value={AuthContextData}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;


