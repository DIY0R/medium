"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sslparam = void 0;
const sslparam = () => +process.env.DEV
    ? {}
    : {
        ssl: true,
        extra: {
            ssl: {
                rejectUnauthorized: false,
            },
        },
    };
exports.sslparam = sslparam;
