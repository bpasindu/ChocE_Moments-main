import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser"; 
import cors from "cors";
import userRouter from "./routers/userRouter.js"; 
import productRouter from "./routers/productRouter.js"; 
import orderRouter from "./routers/orderRouter.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express()

// Enable CORS for frontend (permissive for development)
app.use(cors());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use(bodyParser.json())

// JWT Authentication Middleware
app.use(
    (req, res, next) => {
        const value = req.get('authorization');
        if(value != null) {
            const token = value.replace("Bearer ","")
            jwt.verify(
                token, 
                process.env.JWT_SECRET,
                (err, decoded) => {
                    if(err || decoded == null) {
                        return res.status(403).json({
                            message : "Unauthorized"
                        })
                    }    
                    req.user = decoded;
                    next();
                }
            )    
         } else {
            next();
         }           

    }

)
const connectionString = process.env.DATABASE_URL

mongoose.connect(connectionString).then(
    () => {
        console.log("✅ Connected to database")
    }
).catch(
    (error) => {
        console.error("❌ Failed to connect to the database:", error.message)
        console.error("Please check your DATABASE_URL in .env file")
    }
)


// Health check endpoint
app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({
        status: 'ok',
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});

app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);








const PORT = process.env.PORT || 5000;

app.listen(PORT,
    () => {
        console.log(`Server started on port ${PORT}`);
    }  
)    



