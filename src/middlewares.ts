import type { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

import { JWT_PASSWORD } from "./config.js"
export const useMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    const decoded = jwt.verify(header as string, JWT_PASSWORD);
    if (decoded) {
        (req as any).userId = (decoded as any).id;
    
    next()
    } else {
        res.status(401).json({
            message: "you are not logged in"
        })
    }
    
}
