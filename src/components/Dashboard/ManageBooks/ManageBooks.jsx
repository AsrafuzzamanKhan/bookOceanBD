import { AiFillDelete } from "react-icons/ai";
import { FaSync } from "react-icons/fa";
import useBookData from "../../../hooks/useBookData";
import Swal from "sweetalert2";
import { showSuccessToast, showErrorToast } from "../../../utils/toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useState } from "react";
// import { useQueryClient } from '@tanstack/react-query';
// import BookDetails from "../../BookDetails/BookDetails";

const ManageBooks = () => {
    const [booksData, , refetch] = useBookData()
    const [searchTerm, setSearchTerm] = useState('')
    const [axiosSecure] = useAxiosSecure()
    const [syncing, setSyncing] = useState(false)
    const [syncResult, setSyncResult] = useState(null)

    // dryRun: true previews the sync (updated/created counts, category
    // breakdown) without writing anything - only pulls name/author/category/
    // availability/price from the sheet, see googleSheetSync.js on the server
    const handleSyncSheet = (dryRun) => {
        setSyncing(true)
        setSyncResult(null)
        axiosSecure.post('/admin/sync-google-sheet', { dryRun })
            .then(res => {
                setSyncResult(res.data)
                if (dryRun) {
                    showSuccessToast('Preview ready', `${res.data.updated} would update, ${res.data.created} would be created.`)
                } else {
                    showSuccessToast('Sync complete', `${res.data.updated} updated, ${res.data.created} new books added.`)
                    refetch()
                }
            })
            .catch(err => {
                showErrorToast('Sync failed', err.response?.data?.message || err.message)
            })
            .finally(() => setSyncing(false))
    }



    const filterBook = e => {
        e.preventDefault();
        setSearchTerm(e.target.value)
    }

    const term = searchTerm.toLowerCase()
    const filteredBooks = booksData?.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.author.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
    ) || []

    // category-wise: group alphabetically by category, then by name within
    // each category, with a header row between groups
    const sortedBooks = [...filteredBooks].sort((a, b) => {
        const catCompare = (a.category || '').localeCompare(b.category || '')
        if (catCompare !== 0) return catCompare
        return (a.name || '').localeCompare(b.name || '')
    })
    const categoryCounts = sortedBooks.reduce((acc, b) => {
        const cat = b.category || 'uncategorized'
        acc[cat] = (acc[cat] || 0) + 1
        return acc
    }, {})


    // console.log(booksData)
    const handleDeleteBook = book => {
        console.log('selected book', book)
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            console.log(result)
            if (result.isConfirmed) {
                axiosSecure.delete(`/books/${book._id}`)
                    .then(res => {
                        if (res.data.deletedCount > 0) {
                            refetch();
                            showSuccessToast('Deleted!', 'Your item has been deleted.')
                        }
                    })


            }
        })
    }


    return (
        <div className="container mx-auto">
            <Helmet>
                <title>Book Ocean BD || Manage Books</title>
            </Helmet>

            <div className="mb-[30px] pt-24 md:pt-28 lg:pt-0 xl:pt-24 min-h-screen">
                <div className='flex flex-col items-center  mb-8 '>
                    <p className=' bg-slate-800 text-white px-8 py-3 rounded'>Manage Books: {booksData.length}</p>

                </div>
                {/* filter  */}
                <div className="flex items-center justify-center bg-slate-300 py-4 rounded gap-4 ">
                    <label htmlFor="" className="text-md font-semibold">Filter: </label>
                    <input type="text" className="p-2  rounded-xl border dark:bg-white w-1/2 " onChange={filterBook} placeholder="Name / Author name/ Category" name="" id="" /></div>

                {/* google sheet sync */}
                <div className="my-6 border dark:border-0 dark:bg-gray-800 rounded-[8px] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                        <h2 className="font-semibold dark:text-white">Sync from Google Sheet</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleSyncSheet(true)}
                                disabled={syncing}
                                className="px-4 py-2 rounded text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 duration-200 disabled:opacity-50"
                            >
                                {syncing ? 'Working...' : 'Preview (no changes)'}
                            </button>
                            <button
                                onClick={() => handleSyncSheet(false)}
                                disabled={syncing}
                                className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium bg-slate-800 text-white hover:bg-slate-700 duration-200 disabled:opacity-50"
                            >
                                <FaSync size={12} /> {syncing ? 'Syncing...' : 'Sync Now'}
                            </button>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        Only updates name/author/category/quantity/price (availability is derived from quantity). Existing
                        books are matched by name+author; anything not already in your catalog is added with a placeholder
                        cover for you to finish manually. Also runs automatically once a day.
                    </p>

                    {syncResult && (
                        <div className="text-sm dark:text-white">
                            <div className="flex flex-wrap gap-4 mb-3">
                                <span>Rows processed: <strong>{syncResult.totalRows}</strong></span>
                                <span className="text-blue-500">Updated: <strong>{syncResult.updated}</strong></span>
                                <span className="text-green-500">{syncResult.dryRun ? 'Would create' : 'Created'}: <strong>{syncResult.created}</strong></span>
                            </div>
                            {syncResult.newlyCreated?.length > 0 && (
                                <div className="max-h-48 overflow-y-auto border-t dark:border-gray-700 pt-2">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        {syncResult.dryRun ? 'Would be newly created (needs a cover added afterward):' : 'Newly created - needs a cover added:'}
                                    </p>
                                    <ul className="text-xs space-y-1">
                                        {syncResult.newlyCreated.map((b, i) => (
                                            <li key={i}>{b.name} — <span className="text-gray-400">{b.author} · {b.category}{b.price ? ` · ৳${b.price}` : ''}</span></li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="">
                    <div className="overflow-x-auto border">
                        <table className="table table-xs lg:text-[16px] lg:table-lg"  >
                            {/* head */}
                            <thead>
                                <tr>
                                    <th>S/N</th>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Quantity</th>
                                    <th>Available</th>
                                    <th>Price</th>
                                    <th>Edit</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(() => {
                                    let lastCategory = null
                                    let serial = 0
                                    return sortedBooks.map(book => {
                                        const rows = []
                                        if (book.category !== lastCategory) {
                                            lastCategory = book.category
                                            rows.push(
                                                <tr key={`cat-${book.category}-${book._id}`} className="bg-slate-200 dark:bg-gray-700">
                                                    <td colSpan={8} className="font-semibold capitalize py-2 px-3">
                                                        {book.category || 'Uncategorized'}
                                                        <span className="font-normal text-xs text-gray-500 dark:text-gray-300"> ({categoryCounts[book.category || 'uncategorized']})</span>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        serial++
                                        rows.push(
                                            <tr key={book._id}>
                                                <th>
                                                    <label>
                                                        {serial}
                                                    </label>
                                                </th>
                                                <td>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="avatar">
                                                            <div className="mask mask-squircle w-12 h-12">
                                                                <img src={book?.image} alt={book?.image} />
                                                            </div>
                                                        </div>

                                                    </div>
                                                </td>
                                                <td>
                                                    {book?.name}
                                                    <br />
                                                    <span className="badge badge-ghost ">{book?.author}</span>
                                                </td>
                                                <td>{book?.quantity ?? '—'}</td>
                                                <td>{book?.available}</td>
                                                <td>{book?.price}</td>
                                                <td>
                                                    <Link to={`/dashboard/updateBook/${book._id}`}>

                                                        <button className="btn btn-ghost btn-xs">Edit</button>
                                                    </Link>
                                                </td>
                                                <th>
                                                    <button onClick={() => handleDeleteBook(book)} className="btn bg-red-600 text-white"> <AiFillDelete className='text-xl' /></button>


                                                    {/* <BookDetails handleDeleteBook={handleDeleteBook}></BookDetails> */}
                                                </th>
                                            </tr>
                                        )
                                        return rows
                                    })
                                })()}
                            </tbody>


                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageBooks;