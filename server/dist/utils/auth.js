"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRefreshTokenInCookie = exports.decodeToken = exports.createToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const createToken = (type, user) => (0, jsonwebtoken_1.sign)({ userId: user.id }, type === 'accessToken'
    ? process.env.ACCESS_TOKEN_SECRET
    : process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: type === 'accessToken' ? '10s' : '60m',
});
exports.createToken = createToken;
const decodeToken = (type, token) => (0, jsonwebtoken_1.verify)(token, type === 'accessToken'
    ? process.env.ACCESS_TOKEN_SECRET
    : process.env.REFRESH_TOKEN_SECRET);
exports.decodeToken = decodeToken;
const setRefreshTokenInCookie = (res, user) => {
    res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME, (0, exports.createToken)('refreshToken', user), {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        path: '/refresh-token',
    });
};
exports.setRefreshTokenInCookie = setRefreshTokenInCookie;
//# sourceMappingURL=auth.js.map