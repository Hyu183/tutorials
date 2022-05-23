import { Secret, sign, verify } from 'jsonwebtoken';
import { UserAuthPayload } from '../types/UserAuthPayload';
import { User } from '../entities/User';
import {Response} from 'express';

export const createToken = (type: 'accessToken' | 'refreshToken', user: User) =>
    sign(
        { userId: user.id },
        type === 'accessToken'
            ? (process.env.ACCESS_TOKEN_SECRET as Secret)
            : (process.env.REFRESH_TOKEN_SECRET as Secret),
        {
            expiresIn: type === 'accessToken' ? '10s' : '60m',
        }
    );

export const decodeToken = (type: 'accessToken' | 'refreshToken', token: string) =>
    verify(
        token,
        type === 'accessToken'
            ? (process.env.ACCESS_TOKEN_SECRET as Secret)
            : (process.env.REFRESH_TOKEN_SECRET as Secret)
    ) as UserAuthPayload;

export const setRefreshTokenInCookie = (res: Response, user: User)=>{
    res.cookie(
        process.env.REFRESH_TOKEN_COOKIE_NAME as string,
        createToken('refreshToken', user),
        {
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
            path: '/refresh-token',
        }
    );
}