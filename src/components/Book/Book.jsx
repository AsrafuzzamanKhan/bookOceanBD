import { useParams } from "react-router-dom";
import useBookData from "../../hooks/useBookData";
import BookCard from "../BookCard/BookCard";
import CategoryNav from "../CategoryNav/CategoryNav";
// import FadeIn from "../../Animation/FadeIn";
import { Helmet } from "react-helmet-async";

// import Pagination from "../Pagination/Pagination";
// import { useState } from "react";


const Book = () => {
    const [booksData] = useBookData()

    const { category } = useParams()




    // Define the category you want to filter by
    const selectedCategory = category;



    // Use the filter method to get products of the selected category
    const filteredProducts = booksData.filter(item => item.category === selectedCategory);


    // availableBooks 
    const availableBooks = filteredProducts.filter(item => item.available === "true")
    const unavailableBooks = filteredProducts.filter(item => item.available === "false")

    // meta data 
    const fantasyMetaData = selectedCategory === "fantasy"
    const classicMetaData = selectedCategory === "classics"
    const comicsMetaData = selectedCategory === "comics"
    const mangaMetaData = selectedCategory === "manga"
    const romanceMetaData = selectedCategory === "romance"
    const fictionMetaData = selectedCategory === "fiction"
    const nonFictionMetaData = selectedCategory === "non-fiction"
    const mythologyMetaData = selectedCategory === "mythology"
    const islamicMetaData = selectedCategory === "islamic"
    const horrorMetaData = selectedCategory === "horror"
    const crimeMetaData = selectedCategory === "crime"
    const thrillerMetaData = selectedCategory === "thriller"
    const scienceFictionMetaData = selectedCategory === "science fiction"
    const biographyMetaData = selectedCategory === "biography"
    const barnsNovelMetaData = selectedCategory === "barnes & noble"
    const deluxeMetaData = selectedCategory === "deluxe edition"
    const childenMetaData = selectedCategory === "children's"
    const historyMetaData = selectedCategory === "history"
    const poetryMetaData = selectedCategory === "poetry"

    console.log('category', category)

    const { author } = useParams()
    console.log('author', author)
    const uniqueAuthor = [...new Set(booksData.map(item => item.author))];
    console.log('total author:', uniqueAuthor.length)



    // Define the category you want to filter by
    const selectedAuthor = author;
    console.log("selectedAuthor", selectedAuthor);

    // Use the filter method to get products of the selected category
    const filteredAuthor = booksData.filter(item => item.author === selectedAuthor);


    return (
        <section className="mb-4 pt-[6rem] md:pt-28 lg:pt-24 min-h-screen">

            {
                selectedAuthor && <Helmet>
                    <title>Popular author {` ${selectedAuthor}'s`} books to buy online</title>
                    <meta name="description" content="Explore our diverse collection of books across various genres, including fiction, non-fiction, mystery, romance, and more. Discover bestsellers, new releases, and timeless classics to satisfy every reader's taste. Shop now for your next great read!" />
                </Helmet>
            }

            {/* {
                selectedCategory && <Helmet>
                    <title>Best {selectedCategory} books to buy online</title>

                    <meta name="description" content="Explore our diverse collection of books across various genres, including fiction, non-fiction, mystery, romance, and more. Discover bestsellers, new releases, and timeless classics to satisfy every reader's taste. Shop now for your next great read!" />
                </Helmet>
            } */}


            {
                fantasyMetaData && <Helmet>
                    <title>Buy Original Fantasy Books Online in Bangladesh | Book Ocean BD</title>

                    <meta name="description" content="Book Ocean BD offers a wide selection of authentic fantasy books. Shop now and get your favorite books delivered anywhere in Bangladesh. Pre-orders available!" />
                </Helmet>
            }
            {
                classicMetaData && <Helmet>
                    <title>Buy Timeless Classic Books – Penguin Classics & More | Book Ocean BD</title>

                    <meta name="description" content="Shop classic literature, including Penguin Classics, at Book Ocean BD. Experience the joy of reading timeless works by Marcus Aurelius, Tolstoy, and more, delivered across Bangladesh." />
                </Helmet>
            }
            {
                comicsMetaData && <Helmet>
                    <title>Buy Authentic Comics Books Online in Bangladesh | Book Ocean BD</title>

                    <meta name="description" content="Explore our collection of comics books, including iconic titles like Batman, The Dark Knight Returns, and more. Order now from Book Ocean BD for fast delivery." />
                </Helmet>
            }
            {
                mangaMetaData && <Helmet>
                    <title>Shop Popular Manga Titles | Attack on Titan, Naruto, Junji Ito & More | Book Ocean BD</title>

                    <meta name="description" content="Find the best manga books online at Book Ocean BD. Explore top titles like Spy x Family, Chainsaw Man, and Demon Slayer with hassle-free delivery in Bangladesh." />
                </Helmet>
            }
            {
                romanceMetaData && <Helmet>
                    <title>Buy Romance Books Online in Bangladesh | Book Ocean BD</title>

                    <meta name="description" content="Book Ocean BD offers a curated selection of romance novels, including new releases and timeless classics. Order your favorite romance books with easy delivery throughout Bangladesh." />
                </Helmet>
            }
            {
                fictionMetaData && <Helmet>
                    <title>Buy Fiction Books Online in Bangladesh | Book Ocean BD</title>

                    <meta name="description" content="Book Ocean BD offers a curated selection of fiction books, including works by Kazuo Ishiguro, Paulo Coelho, and more. Shop authentic editions with easy nationwide delivery." />
                </Helmet>
            }
            {
                nonFictionMetaData && <Helmet>
                    <title>Shop Popular Non-Fiction Books – Yuval Noah Harari, Robert Greene & More</title>

                    <meta name="description" content={`Discover a diverse range of non-fiction books online at Book Ocean BD. Shop bestsellers like " Freakonomics" and "Ikigai" with nationwide delivery across Bangladesh.`} />
                </Helmet>
            }
            {
                mythologyMetaData && <Helmet>
                    <title>Buy Mythology Books Online in Bangladesh | Book Ocean BD</title>

                    <meta name="description" content="Shop classic mythology books, including illustrated editions of timeless tales. Order now from Book Ocean BD for authentic print editions with nationwide delivery." />
                </Helmet>
            }
            {
                islamicMetaData && <Helmet>
                    <title>Shop Authentic Islamic Books – From Quran to Biographies</title>

                    <meta name="description" content="Explore our collection of Islamic literature, including the Quran, Sahih Bukhari, and inspiring works by Yasmin Mogahed. Order now for authentic print editions with nationwide delivery." />
                </Helmet>}
            {
                horrorMetaData && <Helmet>
                    <title>Shop Chilling Horror Books – From Classics to New Releases</title>

                    <meta name="description" content="Book Ocean BD offers a spine-chilling selection of horror novels, including 'The Complete Fiction of H. P. Lovecraft' " />
                </Helmet>
            }
            {
                horrorMetaData && <Helmet>
                    <title>Shop Chilling Horror Books – From Classics to New Releases</title>

                    <meta name="description" content="Book Ocean BD offers a spine-chilling selection of horror novels, including 'The Complete Fiction of H. P. Lovecraft' " />
                </Helmet>
            }
            {
                crimeMetaData && <Helmet>
                    <title>Buy Crime Books Online | Bestsellers & Classics | Book Ocean</title>

                    <meta name="description" content="Explore our vast collection of crime books. From Agatha Christie to modern thrillers, find authentic prints delivered nationwide. Shop now at Book Ocean BD!" />
                </Helmet>
            }
            {
                thrillerMetaData && <Helmet>
                    <title>Shop Bestselling Thrillers | Book Ocean BD | Order Online</title>

                    <meta name="description" content="Indulge in page-turning thrillers from our curated collection. Authentic prints delivered nationwide. Pre-order new releases. Shop at Book Ocean BD!" />
                </Helmet>
            }
            {
                scienceFictionMetaData && <Helmet>
                    <title>Shop Top Science Fiction | Bestsellers & Classics | Order</title>

                    <meta name="description" content="Find your next favorite poetry book at Book Ocean BD. Discover bestselling poets and hidden gems. Unbeatable selection with nationwide delivery." />
                </Helmet>
            }
            {
                biographyMetaData && <Helmet>
                    <title>Buy Life-Changing Biographies | Book Ocean BD Collection</title>

                    <meta name="description" content="Explore our vast biography collection. From Walter Isaacson to Sachin Tendulkar, find authentic prints delivered nationwide. Shop now at Book Ocean BD!" />
                </Helmet>
            }
            {
                barnsNovelMetaData && <Helmet>
                    <title>Order Luxury Barnes & Noble Books | Book Ocean Checkout</title>

                    <meta name="description" content="Discover collectible Barnes & Noble editions. Pre-order new releases and enjoy nationwide delivery. Order your next treasured book today!" />
                </Helmet>
            }
            {
                deluxeMetaData && <Helmet>
                    <title>Shop Premium Hardcover Books | Deluxe Editions | Order</title>

                    <meta name="description" content="Explore our Deluxe Edition collection featuring timeless works. Find perfect hardcover reads with authentic prints. Shop today for literary treasures!" />
                </Helmet>
            }
            {
                childenMetaData && <Helmet>
                    <title>Buy Children&apos;s Books | Magical Stories | Book Ocean BD</title>

                    <meta name="description" content="Discover enchanting stories for kids. Pre-order new releases and enjoy nationwide delivery. Order your child's next favorite book today!" />
                </Helmet>
            }
            {
                historyMetaData && <Helmet>
                    <title>Buy Bestselling History Books | Authentic Prints | Shop</title>

                    <meta name="description" content="Find your next history book at Book Ocean BD. Discover bestselling authors and untold stories. Unbeatable selection with nationwide delivery." />
                </Helmet>
            }
            {
                poetryMetaData && <Helmet>
                    <title>Buy Poetry Books | Rumi Collection | Book Ocean BD</title>

                    <meta name="description" content="Discover soul-stirring poetry. Pre-order new releases and enjoy nationwide delivery. Order your next inspirational read today from Book Ocean BD!" />
                </Helmet>
            }




            {/* {
                (fantasyMetaData && <Helmet>
                    <title>Buy Original Fantasy Books Online in Bangladesh | Book Ocean BD</title>

                    <meta name="description" content="Book Ocean BD offers a wide selection of authentic fantasy books. Shop now and get your favorite books delivered anywhere in Bangladesh. Pre-orders available!" />
                </Helmet>) || (classicMetaData && <Helmet>
                    <title>Buy Timeless Classic Books – Penguin Classics & More | Book Ocean BD</title>

                    <meta name="description" content="Shop classic literature, including Penguin Classics, at Book Ocean BD. Experience the joy of reading timeless works by Marcus Aurelius, Tolstoy, and more, delivered across Bangladesh." />
                </Helmet>) || (comicsMetaData && <Helmet>
                    <title>Buy Authentic Comics Books Online in Bangladesh | Book Ocean BD</title>

                    <meta name="description" content="Explore our collection of comics books, including iconic titles like Batman, The Dark Knight Returns, and more. Order now from Book Ocean BD for fast delivery." />
                </Helmet>)
            } */}


            {/* <Helmet>
                <title>{selectedCategory}</title>

                <meta name="description" content="Book Ocean BD offers a wide selection of authentic fantasy books. Shop now and get your favorite books delivered anywhere in Bangladesh. Pre-orders available!" />
            </Helmet> */}


            <div className="container mx-auto">
                <div className="flex gap-x-[30px] ">

                    {/* category nav  */}
                    <CategoryNav />

                    <div className="w-full px-1 lg:px-0">
                        <main className="">
                            {/* <FadeIn delay={0.4} direction='down' > */}
                            {/* title  */}

                            <div className="py-3 lg:py-0 lg:pb-2   text-center capitalize text-xl lg:text-left dark:text-white font-semibold">
                                <h1><span className="text-blue-400 me-2"> {category}{author}</span>Book</h1>
                            </div>

                            {/* get books by category  */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4  gap-[8px] md:gap-[20px] w-full px-[2vw] md:px-0">
                                {/* {filteredProducts.map((book, i) => {
                                    return <BookCard key={i} book={book}>
                                    </BookCard>

                                })} */}
                                {/* {currentPost.map((book, i) => {
                                    return <BookCard key={i} book={book}>
                                    </BookCard>

                                })} */}

                                {availableBooks.map((book, i) => {
                                    return <BookCard key={i} book={book}>
                                    </BookCard>

                                })}
                                {unavailableBooks.map((book, i) => {
                                    return <BookCard key={i} book={book}>
                                    </BookCard>

                                })}

                                {/* get author books  */}
                                {filteredAuthor.map((book, i) => {
                                    return <BookCard key={i} book={book}>
                                    </BookCard>

                                })}

                            </div>
                            {/* product grid   */}

                            {/* </FadeIn> */}
                        </main>
                        {/* pagination  */}
                        {/* <div>
                            <Pagination
                                totalPosts={filteredProducts.length}
                                postsPerPage={postsPerPage}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />
                        </div> */}
                    </div>

                    {/* author  */}



                </div>



            </div>
        </section>
    );
};

export default Book;