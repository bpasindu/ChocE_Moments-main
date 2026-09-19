import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/product.js';

dotenv.config();

const products = [
    {
        productId: 'choce-nutmelt',
        name: 'ChocE NutMelt',
        description: 'ChocE NutMelt blends roasted nuts with rich chocolate to create a smooth, crunchy, irresistible bite.',
        price: 400, // Base price (fallback)
        category: 'Truffles',
        image: 'https://placehold.co/600x400', 
        stock: 100,
        isActive: true,
        quantityOptions: [
            { pieces: 2, price: 400 },
            { pieces: 4, price: 750 },
            { pieces: 6, price: 1000 }
        ]
    },
    {
        productId: 'choce-date-bliss',
        name: 'ChocE Date Bliss',
        description: 'ChocE Date Bliss combines soft, sweet dates with a layer of rich chocolate and a touch of nut crunch.',
        price: 400,
        category: 'Truffles',
        image: 'https://placehold.co/600x400',
        stock: 100,
        isActive: true,
         quantityOptions: [
            { pieces: 4, price: 400 },
            { pieces: 6, price: 550 },
            { pieces: 8, price: 700 }
        ]
    },
    {
        productId: 'choce-amour',
        name: 'ChocE Amour',
        description: 'ChocE Amour is a premium heart-shaped chocolate with a rich nut-filled center, the perfect romantic indulgence.',
        price: 400,
        category: 'Truffles',
        image: 'https://placehold.co/600x400',
        stock: 100,
        isActive: true,
        quantityOptions: [
            { pieces: 2, price: 400 },
            { pieces: 4, price: 750 },
            { pieces: 6, price: 1000 }
        ]
    }
];

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL)
    .then(async () => {
        console.log('Connected to MongoDB');
        
        try {
            // Delete existing products to avoid duplicates during dev
            // await Product.deleteMany({}); 
            
            for (const product of products) {
                const existingProduct = await Product.findOne({ productId: product.productId });
                if (!existingProduct) {
                    await Product.create(product);
                    console.log(`Created product: ${product.name}`);
                } else {
                    console.log(`Product already exists: ${product.name}`);
                    // Optional: Update price if needed
                    // existingProduct.price = product.price;
                    // await existingProduct.save();
                }
            }
            
            console.log('Seeding completed successfully');
            process.exit(0);
        } catch (error) {
            console.error('Error seeding products:', error);
            process.exit(1);
        }
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });
