import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import toast from 'react-hot-toast';
import axios from 'axios';


const BestSeller = () => {

  const [products, setProducts] = useState([]);
  const fetchBestSellerProducts = async () =>{
    try {
      const { data } = await axios.get(`/api/product/list`,{
        params : {
          inStock : true,
          limit : 5
        }
      })

      if(data.success){
        setProducts(data.products)
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    fetchBestSellerProducts()
  },[])
  return (
    <div className='mt-16'>
      <p className='text-2xl md:text-3xl font-medium'>Best Sellers</p>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
        {products.filter((product)=> product.inStock).slice(0,5).map((product, index)=>(
            <ProductCard key={index} product={product}/>
        ))}
        
      </div>
    </div>
  )
}

export default BestSeller
