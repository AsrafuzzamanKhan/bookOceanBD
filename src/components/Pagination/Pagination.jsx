import './Pagination.css'
const Pagination = ({ totalPosts, postsPerPage, setCurrentPage, currentPage }) => {
    let pages = [];

    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pages.push(i)
    }
    return (
        <div className='pagination bg-slate-300 text-center my-10 rounded'>{
            pages.map((page, index) =>
                <button className={`${currentPage == page && 'active'} btn m-2`} key={index} onClick={() => setCurrentPage(page)}>{page}
                </button>
            )
        }


        </div>
    )
}

export default Pagination