import { RegisterInput } from '../types/registerInput';
import { Arg, Ctx, ID, Mutation, Query, Resolver } from 'type-graphql';
import { User } from '../entities/User';
import argon2 from 'argon2';
import { UserMutationResponse } from '../types/UserMutationResponse';
import { LoginInput } from '../types/LoginInput';
import { createToken, setRefreshTokenInCookie } from '../utils/auth';
import { Context } from '../types/Context';

@Resolver()
export class UserResolver {
    @Query((_return) => [User])
    async users(): Promise<User[]> {
        return await User.find();
    }
    @Mutation((_return) => UserMutationResponse)
    async register(
        @Arg('registerInput')
        registerInput: RegisterInput
    ): Promise<UserMutationResponse> {
        const { username, password } = registerInput;

        const existingUser = await User.findOne({ where: { username } });

        if (existingUser) {
            return {
                code: 400,
                success: false,
                message: 'Duplicated username',
            };
        }
        const hashedPassword = await argon2.hash(password);

        const newUser = User.create({ username, password: hashedPassword });

        await newUser.save();

        return {
            code: 200,
            success: true,
            message: 'User created',
            user: newUser,
        };
    }

    @Mutation((_return) => UserMutationResponse)
    async login(
        @Arg('loginInput')
        loginInput: LoginInput,
        @Ctx() { res }: Context
    ): Promise<UserMutationResponse> {
        const { username, password } = loginInput;

        const existingUser = await User.findOne({ where: { username } });

        if (!existingUser) {
            return {
                code: 400,
                success: false,
                message: "Username or password isn't correct",
            };
        }

        const isPasswordCorrect = await argon2.verify(
            existingUser.password,
            password
        );
        if (!isPasswordCorrect) {
            return {
                code: 400,
                success: false,
                message: "Username or password isn't correct",
            };
        }
        setRefreshTokenInCookie(res, existingUser);

        return {
            code: 200,
            success: true,
            message: 'Logged In',
            user: existingUser,
            accessToken: createToken('accessToken', existingUser),
        };
    }

    @Mutation((_return) => UserMutationResponse)
    async logout(
        @Arg('userId', (_type) => ID)
        userId: number,
        @Ctx() { res }: Context
    ): Promise<UserMutationResponse> {
        const existingUser = await User.findOne({ where: { id: userId } });
        if (!existingUser) {
            return {
                code: 400,
                success: false,
            };
        }

        existingUser.tokenVersion += 1;
        await existingUser.save();
        res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME as string, {
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
            path: '/refresh-token',
        });

        return {
            code: 200,
            success: true,
        };
    }
}
