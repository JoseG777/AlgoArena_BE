import { Router } from 'express';
import argon2 from 'argon2';
import { User } from '../model/User';
import { emailRegex } from '../utils/validators';
import { signAccess } from '../lib/jwt';

const loginRoute = Router();

function determineLookup(identifyingInput: string) {
  const cleanedInput = identifyingInput.trim().toLowerCase();
  if (emailRegex.test(cleanedInput)) {
    return { email: cleanedInput };
  }
  return { username: cleanedInput };
}

loginRoute.post('/login', async (req, res) => {
  const { identifyingInput, password } = req.body;

  if (!identifyingInput || !password) {
    return res.status(400).json({
      error: 'Missing Credentials!',
    });
  }

  try {
    const lookup = determineLookup(identifyingInput);
    const user = await User.findOne(lookup);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid Credentials.',
      });
    }

    const verifiedPassword = await argon2.verify(user.passwordHash, password);
    if (!verifiedPassword) {
      return res.status(401).json({
        error: 'Invalid Credentials.',
      });
    }

    const token = signAccess({
      sub: String(user._id),
      email: user.email,
      username: user.username,
    });

    res.cookie('access', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV !== 'development',
      path: '/',
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'Success!',
    });
  } catch (e) {
    console.error('Error during login:', e);

    return res.status(500).json({
      error: 'Internal Server Error. Please try again later.',
    });
  }
});

export default loginRoute;
