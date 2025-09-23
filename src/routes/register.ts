import { Router } from "express";
import argon2 from 'argon2';
import { User } from "../model/User";

const router = Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z0-9]+$/;

router.post("/register", async (req, res) => 
{
    console.log("Place holding");
});

export default router;