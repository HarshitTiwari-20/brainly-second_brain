import type { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

import { JWT_PASSWORD } from "./config.js"
export const useMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    const decode = jwt.verify(header as string, JWT_PASSWORD)
    if (decode) {
        req.userID = decoded.id
    }
}
