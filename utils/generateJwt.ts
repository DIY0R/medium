import jwt from "jsonwebtoken";

export interface dataJwt {
  id: number;
  email: string;
}
export interface jwTgenerateInterface {
  genererate(id: number, email: string, key: string): string;
}
export interface jwTcheckInterface {
  verify(token: string, key: string): dataJwt;
}
class JwtCreate implements jwTcheckInterface, jwTgenerateInterface {
  genererate(id: number, email: string, key: string) {
    return jwt.sign({ id, email }, key, {
      expiresIn: "24h",
    });
  }
  verify(token: string, key: string) {
    const decoded = jwt.verify(token, key);
    return decoded as dataJwt;
  }
}

export const jwtCreate = new JwtCreate();
