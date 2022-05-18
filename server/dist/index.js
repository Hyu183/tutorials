"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const apollo_server_core_1 = require("apollo-server-core");
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const type_graphql_1 = require("type-graphql");
const http_1 = require("http");
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("./entities/User");
const greeting_1 = require("./resolvers/greeting");
const user_1 = require("./resolvers/user");
const main = async () => {
    const AppDataSource = new typeorm_1.DataSource({
        type: 'postgres',
        database: process.env.DB_NAME,
        username: process.env.USER_DB,
        password: process.env.PASSWORD_DB,
        logging: true,
        synchronize: true,
        entities: [User_1.User],
    });
    await AppDataSource.initialize();
    const app = (0, express_1.default)();
    const httpServer = (0, http_1.createServer)(app);
    const server = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            validate: false,
            resolvers: [greeting_1.GreetingResolver, user_1.UserResolver],
        }),
        context: ({ req, res }) => ({ req, res }),
        csrfPrevention: true,
        plugins: [
            (0, apollo_server_core_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
            apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground,
        ],
    });
    await server.start();
    server.applyMiddleware({ app });
    const PORT = process.env.PORT || 4000;
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`SERVER STARTED ON PORT: ${PORT}. GRAPHQL ENDPOINT ON http://localhost:${PORT}${server.graphqlPath}`);
};
main().catch((error) => console.log('Server error: ', error));
//# sourceMappingURL=index.js.map