"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtCreate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtCreate {
    genererate(id, email, key) {
        return jsonwebtoken_1.default.sign({ id, email }, key, {
            expiresIn: "24h",
        });
    }
    verify(token, key) {
        const decoded = jsonwebtoken_1.default.verify(token, key);
        return decoded;
    }
}
exports.jwtCreate = new JwtCreate();
