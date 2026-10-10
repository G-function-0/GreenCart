import { Link, useLocation } from "react-router";



const getPaginationLinks = (currentPage, totalPages) => {
    
    if(totalPages <= 7){
        return Array.from({length :  totalPages}, (_, i) => i+1);
    }
    
    if(currentPage < 4){
        return [1,2,3,4,"...",totalPages]
    }

    if(currentPage > totalPages-3){
        return [1,"...",totalPages-3,totalPages-2,totalPages-1,totalPages];
    }

    return [1,"...",currentPage-1,currentPage,currentPage+1,"...",totalPages];
    
} 

export default function Pagination ({currentPage, totalPages}) {
            
            if(!totalPages || totalPages <= 1){
                return null;
            }
    const location = useLocation();
    const createPageUrl = (pageNumber) => {
        
        const searchParams = new URLSearchParams(location.search) 
        searchParams.set('page',pageNumber.toString());
        return `?${searchParams.toString()}`;
    
    }

    const pages = getPaginationLinks(currentPage, totalPages);

    return (
        <nav aria-label="Page Navigation" className="flex justify-center items-center gap-2 mt-10">
            {/* prev button  */}
            <Link
                to={currentPage > 1 ? createPageUrl(currentPage - 1) : '#'}
                aria-disabled={currentPage === 1}
                aria-label="Go to previous page"
                className={`px-3 py-1 border rounded transition-colors ${
                    currentPage === 1 ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'hover:bg-gray-100'
                }`}
            >
                Prev
            </Link>
            {/* pages  */}
            {pages.map((page,index) => {
                if(page === "..."){
                    return <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-500">
                        &hellip;
                    </span>
                }
                return <Link
                        key={page}
                        to={createPageUrl(page)}
                        aria-current={currentPage === page ? 'page' : undefined}
                        aria-label={`Go to page ${page}`}
                        className={`px-3 py-1 border rounded transition-colors ${
                            currentPage === page
                                ? 'bg-primary text-white border-primary cursor-default pointer-events-none'
                                : 'hover:bg-gray-100 text-gray-700'
                        }`}
                    >
                    {page}
                    </Link>
            })}
            {/* next button  */}
            <Link
                to={currentPage < totalPages ? createPageUrl(currentPage + 1) : '#'}
                aria-disabled={currentPage === totalPages}
                aria-label="Go to next page"
                className={`px-3 py-1 border rounded transition-colors ${
                    currentPage === totalPages ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'hover:bg-gray-100'
                }`}
            >
                Next </Link>
        </nav>
    )
}