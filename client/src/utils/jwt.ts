import jwtDecode, { JwtPayload } from 'jwt-decode';

const JWTManager = () => {
    let inMemoryToken: string | null = null;
    // let refreshTokenTimeoutId: number | null = null;
    const getToken = () => inMemoryToken;

    const setToken = (token: string) => {
        inMemoryToken = token;
        const decodedToken = jwtDecode<JwtPayload & { userId: number }>(token);
        setRefreshTokenTimeout(
            (decodedToken.exp as number) - (decodedToken.iat as number)
        );
    };

    const setRefreshTokenTimeout = (delay: number) => {
        // refreshTokenTimeoutId = 
        window.setTimeout(
            getRefreshToken,
            (delay - 5) * 1000
        );
    };

    const getRefreshToken = async () => {
        const response = await fetch('http://localhost:4000/refresh-token', {
            credentials: 'include',
        });
        const data =(await response.json() )as {success: boolean, accessToken: string};
        console.log(data.accessToken);
        setToken(data.accessToken);
    };

    return { getToken, setToken };
};

export default JWTManager();
