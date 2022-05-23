"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const apollo_server_core_1 = require("apollo-server-core");
const auth_1 = require("../utils/auth");
const checkAuth = ({ context }, next) => {
    try {
        const authHeader = context.req.header('Authorization');
        const accessToken = authHeader && authHeader.split(' ')[1];
        if (!accessToken) {
            throw new apollo_server_core_1.AuthenticationError('Not authenticated to perform GRAPHQL operations');
        }
        const decodedUser = (0, auth_1.decodeToken)('accessToken', accessToken);
        context.user = decodedUser;
        return next();
    }
    catch (error) {
        throw new apollo_server_core_1.AuthenticationError(`Error authenticating user, ${JSON.stringify(error)}`);
    }
};
exports.checkAuth = checkAuth;
//# sourceMappingURL=checkAuth.js.map