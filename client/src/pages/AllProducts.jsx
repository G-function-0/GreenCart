import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard'
import Pagination from '../components/Pagination'
import { useSearchParams } from 'react-router'
import toast from 'react-hot-toast'
import axios from 'axios'

const AllProducts = () => {

    const { searchQuery } = useAppContext()
    const [products, setProducts] = useState([])
    const [totalPages, setTotalPages] = useState()
    const [loading, setLoading] = useState(false);
    const [searchParams,setSearchParams] = useSearchParams();
    const parsedPage = parseInt(searchParams.get('page') || '1' ,10)
    const currentPage = isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

    useEffect(()=>{
      const currentSearchInUrl = searchParams.get('search') || '';

      if (searchQuery !== currentSearchInUrl) {
        setSearchParams((prev) =>{
          const newParams = new URLSearchParams(prev)
          if(searchQuery.trim() !== ''){
            newParams.set('search', searchQuery);
          }
          else{
            newParams.delete('search');
          }
          newParams.set('page','1')
          return newParams;
        })
      }
    },[searchQuery , searchParams , setSearchParams])


    useEffect(()=>{
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const { data } = await axios.get(`/api/product/list?${searchParams.toString()}`)
          
          if(data.success){
            setProducts(data.products)
            setTotalPages(data.pagination.totalPages)
          }
          else{
            toast.error(data.message);
          }
        } catch (error) {
            toast.error(error.message);
        }
        finally{
          setLoading(false);
        }

      }

      fetchProducts();
    },[searchParams])

  return (
    <div className='mt-16 flex flex-col'>
      <div className='flex flex-col items-end w-max'>
        <p className='text-2xl font-medium uppercase'>All products</p>
        <div className='w-16 h-0.5 bg-primary rounded-full'></div>
      </div>
    {loading ? (
      <div className="py-20 text-center text-gray-500">Loading products...</div>
    ) : products.length === 0 ? (
      <div className='flex items-center justify-center h-[60vh]'>
            <p className='text-2xl font-medium text-primary'>No products found.</p>
        </div>
    ) : (<>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
              {products.map((product)=>(
                <ProductCard key={product._id || product.id} product={product}/>
              ))}
            </div>

          </>)
      }
      {(<Pagination currentPage={currentPage} totalPages={totalPages}/>)}
    </div>)
}

export default AllProducts
