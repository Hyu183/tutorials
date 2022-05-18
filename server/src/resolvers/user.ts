import { RegisterInput } from '../types/registerInput';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { User } from '../entities/User';
import argon2 from 'argon2';
import { UserMutationResponse } from '../types/UserMutationResponse';
import { LoginInput } from '../types/LoginInput';
import { createToken } from '../utils/auth';

@Resolver()
export class UserResolver {
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

    @Mutation(_return=> UserMutationResponse)
    async login(
        @Arg('loginInput')
        loginInput: LoginInput): Promise<UserMutationResponse>{
        const {username, password} = loginInput;

        const existingUser = await User.findOne({where:{username}});

        if(!existingUser){
            return {
                code: 400,
                success: false,
                message: 'Username or password isn\'t correct'
            }
        }

        const isPasswordCorrect = await argon2.verify(existingUser.password, password);
        if(!isPasswordCorrect){
             return {
                 code: 400,
                 success: false,
                 message: "Username or password isn't correct",
             };
        }
        
        return {
            code: 200,
            success: true,
            message: 'Logged In',
            user: existingUser,
            accessToken: createToken(existingUser)
        };
    }
}