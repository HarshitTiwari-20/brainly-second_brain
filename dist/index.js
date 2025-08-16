//import express from "express";
import express from "express";
import mongoose from "mongoose";
import { UserModel } from "./db.js";
import jwt from "jsonwebtoken";
const JWT_PASSWORD = process.env.JWT_PASSWORD || "change_this_to_a_strong_secret";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Signup ----------------------------
app.post("/api/v1/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        await UserModel.create({
            username: username,
            password: password
        });
        res.json({ message: "Signup successful" });
    }
    catch (e) {
        res.status(411).json({ message: "User already exists" });
    }
});
// Signin------------------------------------
app.post("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const existingUser = await UserModel.findOne({
        username,
        password
    });
    if (existingUser) {
        const token = jwt.sign({
            id: existingUser._id
        }, JWT_PASSWORD);
        res.json({
            token
        });
    }
    else {
        res.status(403).json({
            message: "Invalid username or password"
        });
    }
});
app.get("/api/v1/content", (req, res) => {
    res.send("Content retrieved successfully");
});
app.delete("/api/v1/content", (req, res) => {
    res.send("Content deleted successfully");
});
app.post("/api/v1/brain/share", (req, res) => {
});
app.post("/api/v1/brain/shareLink", (req, res) => {
});
app.listen(3000);
console.log("Server is running on http://localhost:3000");
//# sourceMappingURL=index.js.map