import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config.js";
export const useMiddleware = (req, res, next) => {
    const header = req.headers["authorization"];
    const decoded = jwt.verify(header, JWT_PASSWORD);
    if (decoded) {
        req.userId = decoded.id;
        next();
    }
    else {
        res.status(401).json({
            message: "you are not logged in"
        });
    }
};
//# sourceMappingURL=middlewares.js.map