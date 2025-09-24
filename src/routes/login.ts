import { Router } from "express";
import argon2 from 'argon2';
import { User } from "../model/User";
import { emailRegex, usernameRegex } from "../utils/validators";

const loginRoute = Router();

loginRoute.get("/login", async (req, res) => {

})