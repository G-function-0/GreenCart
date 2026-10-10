import Product from "../models/Product.js"
import User from "../models/User.js"

// Update User CartData : /api/cart/update

export const updateCart = async (req, res)=>{
    try {
        const { userId, cartItems } = req.body     
        await User.findByIdAndUpdate(userId, {cartItems})
        res.json({ success: true, message: "Cart Updated" })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// Get all the Cart Items : /api/cart/items 

export const getCart = async (req, res) => {
    try {   
        const { cartItems } = req.body;
        if (!cartItems) {
            return res.status(400).json({ 
                success: false, 
                message: 'Bad Request' 
            });
        }
        const productIds = Object.keys(cartItems);

        if (productIds.length === 0) {
            return res.status(200).json({ 
                success: true, 
                products: [] 
            });
        }

        
        const products = await Product.find({
            _id: { $in: productIds }
        });

        res.status(200).json({
            success : true,
            products
        })
        
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}