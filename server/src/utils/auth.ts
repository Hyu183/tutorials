import { Secret, sign, verify } from 'jsonwebtoken';
import { UserAuthPayload } from '../types/UserAuthPayload';
import { User } from '../entities/User';

export const createToken =(user:User)=>sign(
    {userId: user.id},
    process.env.ACCESS_TOKEN_SECRET as Secret,
    {
        expiresIn:"15m"
    }
);

export const decodeToken = (token: string) =>
    verify(token, process.env.ACCESS_TOKEN_SECRET as Secret) as UserAuthPayload;
    