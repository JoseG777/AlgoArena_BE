import { Router } from "express";
import argon2 from 'argon2';
import { User } from "../model/User";
import { emailRegex } from "../utils/validators";

const loginRoute = Router();

function determineLookup(identifyingInput: string)
{
    const cleanedInput = identifyingInput.trim().toLowerCase();
    if(emailRegex.test(cleanedInput))
    {
        return {email: cleanedInput};
    }
    return {username: cleanedInput};
}

loginRoute.post("/login", async (req, res) => {
    const {identifyingInput, password} = req.body;

    if(!identifyingInput || !password)
    {
        return res.status(400).json({
            error: "Missing Credentials!"
        })
    }

    try{
        const lookup = determineLookup(identifyingInput);
        console.log(lookup);
        const user = await User.findOne(lookup);
        if(!user)
        {
            return res.status(401).json({
                error: "Invalid Credentials."
            })
        }

        const verifiedPassword = await argon2.verify(user.passwordHash, password);
        if(!verifiedPassword)
        {
            return res.status(401).json({
                error: "Invalid Credentials."
            })
        }

        return res.status(200).json({
            message: "Success!"
        })
    }
    catch(e){
    
    }
})

export default loginRoute;