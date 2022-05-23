require('dotenv').config();

import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { buildSchema } from 'type-graphql';
import { createServer } from 'http';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { GreetingResolver } from './resolvers/greeting';
import { UserResolver } from './resolvers/user';
import { Context } from './types/Context';
import refreshTokenRouter from './routers/refreshTokenRouter';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const main = async () => {
    const AppDataSource = new DataSource({
        type: 'postgres',
        database: process.env.DB_NAME,
        username: process.env.USER_DB,
        password: process.env.PASSWORD_DB,
        logging: true,
        synchronize: true,
        entities: [User],
    });
    await AppDataSource.initialize();

    const app = express();

    app.use(cookieParser());
    app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
    app.use('/refresh-token', refreshTokenRouter);

    const httpServer = createServer(app);
    const server = new ApolloServer({
        schema: await buildSchema({
            validate: false,
            resolvers: [GreetingResolver, UserResolver],
        }),
        context: ({ req, res }): Pick<Context, 'req' | 'res'> => ({ req, res }),
        csrfPrevention: true,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            ApolloServerPluginLandingPageGraphQLPlayground,
        ],
    });
    await server.start();
    server.applyMiddleware({
        app,
        cors: { origin: 'http://localhost:3000', credentials: true },
    });
    const PORT = process.env.PORT || 4000;

    await new Promise((resolve) =>
        httpServer.listen({ port: PORT }, resolve as () => void)
    );

    console.log(
        `SERVER STARTED ON PORT: ${PORT}. GRAPHQL ENDPOINT ON http://localhost:${PORT}${server.graphqlPath}`
    );
};

main().catch((error) => console.log('Server error: ', error));
