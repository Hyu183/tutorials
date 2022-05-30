import jwtDecode, { JwtPayload } from 'jwt-decode';

const JWTManager = () => {
    const LOGOUT_EVENT_NAME= 'jwt-logout';
    let inMemoryToken: string | null = null;
    let refreshTokenTimeoutId: number | null = null;
    let userID : number| null = null;

    const getToken = () => inMemoryToken;
    const getUserId = ()=>userID;

    const setToken = (token: string) => {
        inMemoryToken = token;
        const decodedToken = jwtDecode<JwtPayload & { userId: number }>(token);
        userID = decodedToken.userId;
        setRefreshTokenTimeout(
            (decodedToken.exp as number) - (decodedToken.iat as number)
        );
    };

    const setRefreshTokenTimeout = (delay: number) => {
        refreshTokenTimeoutId = window.setTimeout(
            getRefreshToken,
            (delay - 5) * 1000
        );
        console.log("SET TIMEOUT: ", refreshTokenTimeoutId)
    };
    //add event to logout all tabs
    window.addEventListener('storage',event=>{
        if(event.key === LOGOUT_EVENT_NAME)
            inMemoryToken = null;
    })

    const deleteToken = () => {
        inMemoryToken = null;
        window.localStorage.setItem(LOGOUT_EVENT_NAME,Date.now().toString());
        if (refreshTokenTimeoutId)  window.clearTimeout(refreshTokenTimeoutId);
        console.log('DELETE TIMEOUT: ', refreshTokenTimeoutId);
    };

    const getRefreshToken = async () => {
        const response = await fetch('http://localhost:4000/refresh-token', {
            credentials: 'include',
        });

        try {
            const data = (await response.json()) as {
                success: boolean;
                accessToken: string;
            };
            // console.log(data.accessToken);
            setToken(data.accessToken);
           
            return true;
        } catch (error) {
            console.log('GET REFRESH TOKEN ERROR: ', error);
            deleteToken();
            return false;
        }
    };

    return { getToken, setToken, getRefreshToken, deleteToken, getUserId };
};

export default JWTManager();
