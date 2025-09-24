//import express from "express";
import express from "express";
import mongoose from "mongoose";
import { ContentModel, LinkModel, UserModel } from "./db.js";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config.js";
import { useMiddleware } from "./middlewares.js";
import { random } from "./utils.js";
import cors from "cors";
//const JWT_PASSWORD = process.env.JWT_PASSWORD || "123456";
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// Signup ----------------------------------------------------------
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
// Content --------------------------------------------------
app.post("/api/v1/content", useMiddleware, async (req, res) => {
    const link = req.body.link;
    const type = req.body.type;
    await ContentModel.create({
        link,
        type,
        title: req.body.title,
        //---------------ts-ignore laga hua tha
        userId: req.userId,
        tags: [],
    });
    return res.json({
        message: "Content created successfully"
    });
});
// get content ---------------------------------------------
app.get("/api/v1/content", useMiddleware, async (req, res) => {
    const userId = req.userId;
    const content = await ContentModel.find({
        userId: userId
    }).populate("userId", ("username"));
    return res.json(content);
});
// del content ---------------------------------------------
app.delete("/api/v1/content", useMiddleware, async (req, res) => {
    const contentId = req.body.contentId;
    await ContentModel.deleteMany({
        contentId,
        userId: req.userId,
    });
    return res.json({
        message: " Content deleted successfully"
    });
});
//share --------------------------------------------
app.post("/api/v1/brain/share", useMiddleware, async (req, res) => {
    const share = req.body.share;
    if (share) {
        const existingLink = await LinkModel.findOne({
            userId: req.userId
        });
        if (existingLink) {
            res.json({
                hash: existingLink.hash,
            });
            return;
        }
        const hash = random(20);
        await LinkModel.create({
            userId: req.userId,
            hash: hash
        });
        res.json({
            hash
        });
    }
    else {
        await LinkModel.deleteOne({
            userId: req.userId
        });
        res.json({
            message: "Removed sharable link",
        });
    }
});
//link -----------------------------------------------------
app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;
    const link = await LinkModel.findOne({
        hash
    });
    if (!link) {
        res.status(411).json({
            message: "Link not found incorrent link"
        });
        return;
    }
    //userid 
    const content = await ContentModel.find({
        userId: link.userId
    });
    const user = await UserModel.findOne({
        _id: link.userId
    });
    if (!user) {
        res.status(411).json({
            message: "User not found kya yeh ho sakta hai"
        });
        return;
    }
    res.json({
        username: user?.username,
        content: content
    });
});
app.listen(3000);
console.log("Server is running on http://localhost:3000");
//# sourceMappingURL=index.js.map