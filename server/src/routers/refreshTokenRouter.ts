import express from 'express';
import { User } from '../entities/User';
import { createToken, decodeToken, setRefreshTokenInCookie } from '../utils/auth';


const router = express.Router();


router.get('/',async (req, res)=>{
    
    const refreshToken = req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME as string];
    if(!refreshToken)
        return res.sendStatus(401);
    try {
        const decodedUser = decodeToken('refreshToken', refreshToken);
        const existingUser = await User.findOne({where:{id: decodedUser.userId}});
        if(!existingUser) return res.sendStatus(401);
        setRefreshTokenInCookie(res, existingUser) ;
        return res.json({
            success: true,
            accessToken: createToken('accessToken', existingUser)
    
        })
    } catch (error) {
        console.log('ERROR REFRESH TOKEN: ', error);
        return res.sendStatus(403);
    }
    
})


export default router;