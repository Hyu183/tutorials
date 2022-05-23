import { Context } from '../types/Context';
import { MiddlewareFn } from 'type-graphql';
import { AuthenticationError } from 'apollo-server-core';
import { decodeToken } from '../utils/auth';

export const checkAuth: MiddlewareFn<Context> = ({ context }, next) => {
    try {
        const authHeader = context.req.header('Authorization');
        const accessToken = authHeader && authHeader.split(' ')[1]
        
        if (!accessToken) {
            throw new AuthenticationError(
                'Not authenticated to perform GRAPHQL operations'
            );
        }
        const decodedUser = decodeToken('accessToken',accessToken);
        context.user = decodedUser;
        return next();
    } catch (error) {
        throw new AuthenticationError(`Error authenticating user, ${JSON.stringify(error)}`)
    }
   
};
