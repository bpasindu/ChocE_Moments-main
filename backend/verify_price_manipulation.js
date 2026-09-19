
import fetch from 'node-fetch'; // Requires node-fetch if running in older node, or use built-in fetch in Node 18+
import dotenv from 'dotenv';
dotenv.config();

// Configuration
const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;

async function verifyPriceManipulation() {
    console.log("--- Starting Price Manipulation Verification ---");

    // 1. Login to get token (adjust credentials as needed)
    let token = "";
    try {
        const loginRes = await fetch(`${BASE_URL}/api/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: "test@example.com", // Replace with valid user
                password: "password123"    // Replace with valid password
            })
        });

        if (loginRes.ok) {
            const data = await loginRes.json();
            token = data.token;
            console.log("Login successful.");
        } else {
            console.warn("Login failed. Proceeding without token (might fail if auth required).");
        }
    } catch (e) {
        console.warn("Login step skipped or failed:", e.message);
    }

    
    const manipulatedItem = {
        productId: "VALID_PRODUCT_ID_HERE",
        name: "Expensive Chocolate",
        quantity: 1,
        basePrice: 1.00,  
        totalPrice: 1.00, 
        address: "123 Test St",
        phone: "555-0000"
    };

    const payload = {
        items: [
            {
                productId: "VALID_PRODUCT_ID_HERE", 
                name: "Test Product",
                quantity: 1,
                basePrice: 1.00,   
                totalPrice: 1.00   
            }
        ],
        address: "123 Test St",
        phone: "555-0000",
        paymentMethod: "cash"
    };

    console.log("Sending order with manipulated price (1.00)...");

    try {
        const res = await fetch(`${BASE_URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok) {
            console.log("Order created successfully.");
            console.log("Order Total:", data.result.total);

            if (data.result.total === 1.00) {
                console.error("FAIL: The server accepted the manipulated price of 1.00!");
            } else {
                console.log("PASS: The server ignored the manipulated price. Total is:", data.result.total);
            }
        } else {
            console.log("Order creation failed (Expected if product ID is invalid or auth failed).");
            console.log("Response:", data);
        }

    } catch (err) {
        console.error("Request failed:", err.message);
    }
}

verifyPriceManipulation();
