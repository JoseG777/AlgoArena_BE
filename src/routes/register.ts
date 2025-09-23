import { Router } from "express";
import argon2 from 'argon2';
import { User } from "../model/User";

const registerRoute = Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z0-9]+$/;

registerRoute.post("/register", async (req, res) => 
{
    const {username, email, password} = req.body;

    if(!username || !usernameRegex.test(username))
    {
        return res.status(400).json({
            error: "Invalid Username"
        })
    }

    if(!email || !emailRegex.test(email))
    {
        return res.status(400).json({
            error: "Invalid Email"
        })
    }

    if(!password || password.length < 8)
    {
        return res.status(400).json({
            error: "Invalid Password"
        })
    }

    const exists = await User.findOne({$or:[{username}, {email}]});
    if(exists)
    {
        return res.status(400).json({
            error: "Username or Email already in use"
        })
    }

    const passwordHash = await argon2.hash(password);
    await User.create({username, email, passwordHash});

    res.status(201).json({
        message: "User successfully registered!"
    })
});

export default registerRoute;