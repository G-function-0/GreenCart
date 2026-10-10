import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { useParams, useSearchParams } from 'react-router'
import { categories } from '../assets/assets'
import ProductCard from '../components/ProductCard'
import toast from 'react-hot-toast'
import axios from 'axios'
import Pagination from '../components/Pagination'

const ProductCategory = () => {

    const [products , setProducts] = useState([]);
    const [totalPages , setTotalPages ] = useState();
    const { category } = useParams()

    const searchCategory = categories.find((item)=> item.path.toLowerCase() === category)
    const [searchParams, setSearchParams ] = useSearchParams();
   
    const currentPage = parseInt(searchParams.get('page') || 1,10);
    
    useEffect(() => {

      const fetchProducts = async () => {
        try {
          const { data } = await axios.get(`/api/product/list?${searchParams.toString()}`,{
              params: {
                    category,
                    inStock : true
              }
          })
          if(data.success){
            setProducts(data.products);
            setTotalPages(data.pagination.totalPages)
          }
          else{
            toast.error(data.message)
          }
        } catch (error) {
          toast.error(error.message)
        }
      }
      fetchProducts();
    },[searchParams])

    // const products = products.filter((product)=>product.category.toLowerCase() === category)

  return (
    <div className='mt-16'>
      {searchCategory && (
        <div className='flex flex-col items-end w-max'>
            <p className='text-2xl font-medium'>{searchCategory.text.toUpperCase()}</p>
            <div className="w-16 h-0.5 bg-primary rounded-full"></div>
        </div>
      )}
      
      {products.length > 0 ? (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6'>
            {products.map((product)=>(
                <ProductCard key={product._id} product={product}/>
            ))}
        </div>
      ): (
        <div className='flex items-center justify-center h-[60vh]'>
            <p className='text-2xl font-medium text-primary'>No products found in this category.</p>
        </div>
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  )
}

export default ProductCategory
