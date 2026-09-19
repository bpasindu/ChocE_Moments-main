import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Helper to generate JWT Token
const generateToken = (user) => {
    const secret = process.env.JWT_SECRET || 'choce_secret_key_fallback';
    return jwt.sign(
        {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isBlocked: user.isBlocked,
            isEmailVerified: user.isEmailVerified,
            image: user.image
        },
        secret,
        { expiresIn: "7d" }
    );
};

// --- DIRECT SIGNUP (NO OTP) ---
export async function initiateSignup(req, res) {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash
        });

        await user.save();

        const token = generateToken(user);

        res.json({
            token,
            message: "User registered successfully",
            user: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Server error: " + error.message });
    }
}

// Retain verifySignup for backward compatibility
export async function verifySignup(req, res) {
    return initiateSignup(req, res);
}

// --- DIRECT LOGIN (NO OTP) ---
export async function initiateLogin(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: "Account is blocked" });
        }

        const token = generateToken(user);

        // Optional webhook call
        try {
            fetch('https://bpasindu.app.n8n.cloud/webhook-test/user-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, firstName: user.firstName, lastName: user.lastName })
            }).catch(() => {});
        } catch (e) {}

        res.json({
            token,
            message: "Login successful",
            user: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error: " + error.message });
    }
}

// Retain verifyLogin for backward compatibility
export async function verifyLogin(req, res) {
    return initiateLogin(req, res);
}

export function isAdmin(req) {
    if (req.user == null) {
        return false;
    }
    return req.user.role === 'admin';
}