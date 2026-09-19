import Order from '../models/order.js';
import Product from '../models/product.js';
import mongoose from 'mongoose';



export async function createOrder(req, res) {
    try {
        // Check MongoDB connection
        if (mongoose.connection.readyState !== 1) {
            console.error('MongoDB is not connected. Connection state:', mongoose.connection.readyState);
            return res.status(503).json({
                message: "Database connection error. Please check if MongoDB is running.",
                error: "MongoDB not connected"
            });
        }

        console.log('Creating order...');

        if (req.user == null) {
            return res.status(401).json({
                message: "Please login to create an order"
            });
        }

        const items = [];
        let total = 0;

        if (!req.body.items || !Array.isArray(req.body.items) || req.body.items.length === 0) {
            return res.status(400).json({ message: "Invalid items format or empty cart" });
        }

        
        let orderId = "CM00001"; // Default start
        try {
            
            const latestOrder = await Order.findOne().sort({ _id: -1 });
            if (latestOrder && latestOrder.orderId) {
                const lastIdStr = latestOrder.orderId.replace("CM", "");
                const lastIdNum = parseInt(lastIdStr, 10);
                if (!isNaN(lastIdNum)) {
                    orderId = "CM" + (lastIdNum + 1).toString().padStart(5, "0");
                }
            }
        } catch (idError) {
            console.error('Error generating Order ID:', idError);
            // Fallback to random ID to avoid collision if generation fails
            orderId = "CM" + Math.floor(Math.random() * 100000).toString().padStart(5, "0");
        }
        

        for (let i = 0; i < req.body.items.length; i++) {
            let item = req.body.items[i];

            // Basic validation
            if (!item.productId || !item.name || !item.quantity) {
                return res.status(400).json({
                    message: `Invalid item at index ${i}: missing required fields`,
                });
            }

            // Find product
            let product = null;
            try {
                product = await Product.findOne({ productId: item.productId });
            } catch (e) {
                console.warn(`Product lookup failed for ${item.productId}`, e);
            }

            
            if (product && product.options && product.options.length > 0) {
                

                const selectedOptions = item.selectedOptions || {};

                for (const option of product.options) {
                    const userValue = selectedOptions[option.name];

                    // 1. Check if required option is missing
                    if (!userValue) {
                        return res.status(400).json({
                            message: `Missing required option '${option.name}' for product '${product.name}'`
                        });
                    }

                    // 2. Check if selected value is valid
                    if (!option.values.includes(userValue)) {
                        return res.status(400).json({
                            message: `Invalid value '${userValue}' for option '${option.name}'. Allowed: ${option.values.join(", ")}`
                        });
                    }
                }
            }
            

            
            if (!product) {
                return res.status(400).json({ message: `Product not found: ${item.productId}` });
            }

            // --- Server-Side Price Calculation (Security Fix) ---
            
            let pricePerUnit = product.price; // Default
            const requestedPieces = Number(item.pieces) || 0;

            // 1. Find price for specific quantity option (pieces)
            if (product.quantityOptions && product.quantityOptions.length > 0 && requestedPieces > 0) {
                const matchedOption = product.quantityOptions.find(opt => opt.pieces === requestedPieces);
                if (matchedOption) {
                    pricePerUnit = matchedOption.price;
                } else {
                     // If user sends invalid pieces count, fallback or error? 
                     // For now, let's error to be strict about 'pieces' matching available options
                     // OR ignore pieces and use base price? 
                     // Safe approach: if pieces provided but not found, error.
                     return res.status(400).json({ 
                        message: `Invalid quantity option (${requestedPieces} pieces) for product ${product.name}` 
                     });
                }
            }

            // 2. Add-ons Calculation
            // Hardcoded backend prices for add-ons (should ideally be in DB/Config)
            const ADDON_PRICES = {
                giftCard: 350,
                customName: 250
            };

            let addOnTotal = 0;
            const verifiedAddOns = {
                 giftCard: false,
                 customName: null
            };

            if (item.addOns) {
                if (item.addOns.giftCard === true) {
                    addOnTotal += ADDON_PRICES.giftCard;
                    verifiedAddOns.giftCard = true;
                }
                if (item.addOns.customName && typeof item.addOns.customName === 'string') {
                    addOnTotal += ADDON_PRICES.customName;
                    verifiedAddOns.customName = item.addOns.customName;
                }
            }

            // 3. Final Calculation
            const itemTotal = (pricePerUnit + addOnTotal) * Number(item.quantity);

            items.push({
                productId: product.productId,
                name: product.name,
                image: product.image,
                price: pricePerUnit, // The verified unit price for that size
                quantity: Number(item.quantity),
                pieces: requestedPieces,
                basePrice: pricePerUnit,       
                totalPrice: itemTotal / Number(item.quantity), // Price per single item including add-ons
                addOns: verifiedAddOns
            });

            // Calculate total using the trusted calculated price
            total += itemTotal;
        }

        // Validate user info from token/body
        if (!req.body.address || !req.body.phone) {
            return res.status(400).json({ message: "Address and Phone are required." });
        }

        const orderData = {
            orderId: orderId,
            email: req.user.email,
            name: `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email, 
            address: req.body.address,
            phone: req.body.phone,
            items: items,
            total: total, // Trusted total
            paymentMethod: req.body.paymentMethod || "cash",
            date: new Date() 
        };

        const order = new Order(orderData);
        const result = await order.save();

        console.log('Order saved:', result.orderId);
        res.json({
            message: "Order created successfully",
            result: result
        });

    } catch (error) {
        console.error('Order creation error:', error);

        // Handle Duplicate Key Error (E11000) for orderId specifically
        if (error.code === 11000 && error.keyPattern && error.keyPattern.orderId) {
            return res.status(409).json({
                message: "Order creation failed due to ID collision. Please try again.",
                error: "Duplicate Order ID"
            });
        }

        res.status(500).json({
            message: "Failed to create order",
            error: error.message
        });
    }
}

export async function getAllOrders(req, res) {
    try {
        const orders = await Order.find().sort({ date: -1 });
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
}

export async function updateOrderStatus(req, res) {
    const { orderId } = req.params;
    const { status } = req.body;
    
    // Allowed statuses
    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
            message: `Invalid status. Allowed values: ${validStatuses.join(", ")}` 
        });
    }

    try {
        const order = await Order.findOne({ orderId: orderId });
        
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        await order.save();

        res.json({ 
            message: "Order status updated successfully",
            order: order 
        });

    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Failed to update order status" });
    }
}