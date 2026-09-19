import User from '../models/user.js';
import Otp from '../models/otp.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { sendOTPEmail } from '../utils/emailService.js';
import crypto from 'crypto';

dotenv.config();

// Helper to generate 6-digit OTP
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

// --- SIGNUP FLOW ---

// Step 1: Request OTP for Signup
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

        const otp = generateOTP();
        const otpEntry = new Otp({ email, otp });
        await otpEntry.save();

        const emailSent = await sendOTPEmail(email, otp);
        if (!emailSent) {
            return res.status(500).json({ message: "Failed to send OTP email" });
        }

        res.json({ message: "OTP sent to email. Please verify to complete signup." });

    } catch (error) {
        console.error("Signup Init Error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// Step 2: Verify OTP and Create User
export async function verifySignup(req, res) {
    try {
        const { firstName, lastName, email, password, otp } = req.body;

        const record = await Otp.findOne({ email, otp });
        if (!record) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // OTP Valid - Create User
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash
        });

        await user.save();
        await Otp.deleteMany({ email }); // Clean up used OTPs

        res.json({ message: "User created successfully. You can now login." });

    } catch (error) {
        console.error("Signup Verify Error:", error);
        res.status(500).json({ message: "Server error" });
    }
}


// --- LOGIN FLOW ---

// Step 1: Validate Creds & Send OTP
export async function initiateLogin(req, res) {
    try {
        const { email, password } = req.body;

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

        // Credentials valid - Send OTP
        const otp = generateOTP();

        // Clean up any existing OTPs for this email
        await Otp.deleteMany({ email });

        const otpEntry = new Otp({ email, otp });
        await otpEntry.save();

        const emailSent = await sendOTPEmail(email, otp);
        if (!emailSent) {
            return res.status(500).json({ message: "Failed to send OTP email" });
        }

        res.json({ message: "OTP sent to email. Please verify to complete login." });

    } catch (error) {
        console.error("Login Init Error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// Step 2: Verify OTP and Issue Token
export async function verifyLogin(req, res) {
    try {
        const { email, otp } = req.body;

        const record = await Otp.findOne({ email, otp });
        if (!record) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Issue Token
        const token = jwt.sign(
            {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isBlocked: user.isBlocked,
                isEmailVerified: user.isEmailVerified,
                image: user.image
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Trigger n8n webhook (fire and forget) - Preserved logic
        const webhookPayload = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        };

        try {
            fetch('https://bpasindu.app.n8n.cloud/webhook-test/user-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(webhookPayload)
            }).then(response => {
                console.log('Webhook sent. Status:', response.status);
            }).catch(err => {
                console.error('Failed to trigger n8n login webhook:', err);
            });
        } catch (e) {
            console.error("Webhook dispatch error", e);
        }

        await Otp.deleteMany({ email }); // Clean up used OTPs

        res.json({
            token: token,
            message: "Login successful"
        });

    } catch (error) {
        console.error("Login Verify Error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export function isAdmin(req) {
    if (req.user == null) {
        return false;
    }
    if (req.user.role == 'admin') {
        return true;
    } else {
        return false;
    }
}