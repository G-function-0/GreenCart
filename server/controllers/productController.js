import { v2 as cloudinary } from "cloudinary"
import Product from "../models/Product.js"

// Add Product : /api/product/add
export const addProduct = async (req, res)=>{
    try {
        let productData = JSON.parse(req.body.productData)

        const images = req.files

        let imagesUrl = await Promise.all(
            images.map(async (item)=>{
                let result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'});
                return result.secure_url
            })
        )

        await Product.create({...productData, image: imagesUrl})

        res.json({success: true, message: "Product Added"})

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Get Product : /api/product/list?page=1&limit=10
export const productList = async (req, res)=>{
    try {
        const { search, category, inStock } = req.query;
        const limit =parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page-1) * limit;
        let filter = {};
        if( search !== undefined  && search.trim() !== '') {
            filter.name = { $regex : search.trim(), $options : 'i' }
        }
        if(category){
            filter.category = { $regex : `${category.trim()}`, $options : 'i'};
        }
        if( inStock !== undefined){
            filter.inStock = inStock === "true";
        }

        const result = await Product.aggregate([
            { $match : filter },
            {
                $facet : {
                    metadata : [{ $count : "totalCount" } ],
                    data : [ { $skip : skip }, { $limit  : limit}]
                }
            }
        ])
        const products = result[0].data;
        const totalCount = result[0].metadata[0]?.totalCount || 0;
        const totalPages = Math.ceil(totalCount/limit);


        res.json({success: true, products, 
            pagination : {
                page,
                limit,
                totalCount,
                totalPages,
                "hasNextPage": page < totalPages,
                "hasPrevPage": page > 1
            }
        })
    } catch (error) {
        console.log(error.message);
        res.json({ 
            success: false, 
            message: error.message,
            products: [],
            pagination: { 
                page: 1, limit: 10, totalCount: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false 
            }
         })
    }
}

// Get single Product : /api/product/:id
export const productById = async (req, res)=>{
    try {
        const id = req.params.id || '';
        const product = await Product.findById(id)
        res.json({success: true, product})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Change Product inStock : /api/product/stock
export const changeStock = async (req, res)=>{
    try {
        const { id, inStock } = req.body
        await Product.findByIdAndUpdate(id, {inStock})
        res.json({success: true, message: "Stock Updated"})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}
