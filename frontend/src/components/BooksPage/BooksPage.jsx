import { useMemo } from 'react'
import { useCart } from '../../CartContext/CartContext.jsx'

import BP1 from '../../assets/Book1.png'
import BP2 from '../../assets/Book2.png'
import BP3 from '../../assets/Book3.png'
import BP4 from '../../assets/Book4.png'
import BP5 from '../../assets/Book5.png'
import BP6 from '../../assets/Book6.png'
import BP7 from '../../assets/Book7.png'
import BP8 from '../../assets/Book8.png'
import BP9 from '../../assets/BP9.png'
import BP10 from '../../assets/BP10.png'
import BP11 from '../../assets/BP11.png'
import BP12 from '../../assets/BP12.png'
import BP13 from '../../assets/BP13.png'
import BP14 from '../../assets/BP14.png'
import BP15 from '../../assets/BP15.png'
import BP16 from '../../assets/BP16.png'

const BooksPage = () => {
  const { cart, addToCart } = useCart()

  const books = useMemo(
    () => [
      { id: 1, image: BP1, title: 'The Silent Echo', author: 'Sarah Mitchell', price: 205, category: 'Mystery', description: 'A haunting tale of secrets and revelations that echo through time.' },
      { id: 2, image: BP2, title: 'Digital Fortress', author: 'James Cooper', price: 190, category: 'Thriller', description: 'In the age of digital warfare, no secret is safe from discovery.' },
      { id: 3, image: BP3, title: 'The Last Orbit', author: 'Emily Zhang', price: 202, category: 'Sci-Fi', description: 'Humanity\'s final journey among the stars holds unexpected truths.' },
      { id: 4, image: BP4, title: 'Beyond the Stars', author: 'Michael Chen', price: 209, category: 'Sci-Fi', description: 'An epic space odyssey that challenges our understanding of existence.' },
      { id: 5, image: BP5, title: 'Mystic River', author: 'Dennis Lehane', price: 180, category: 'Drama', description: 'A powerful story of friendship, trauma, and the price of secrets.' },
      { id: 6, image: BP6, title: 'The Alchemist', author: 'Paulo Coelho', price: 160, category: 'Philosophy', description: 'A mystical journey of self-discovery and the pursuit of dreams.' },
      { id: 7, image: BP7, title: 'Atomic Habits', author: 'James Clear', price: 203, category: 'Self-Help', description: 'Transform your life through the power of tiny, consistent changes.' },
      { id: 8, image: BP8, title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', price: 219, category: 'Psychology', description: 'Explore the two systems that drive the way we think and make decisions.' },
      { id: 9, title: 'The Design Of Books', author: 'Debbie Bern', price: 379, description: 'A Gothic tale of science gone wrong and its consequences...', image: BP9 },
      { id: 10, title: 'The Crossing', author: 'Jason Mott', price: 425, description: 'A psychological exploration of guilt and redemption...', image: BP10 },
      { id: 11, title: 'The Phoenix Of Destiny', author: 'Geronimo Stilton', price: 499, description: 'A fantasy adventure through Middle-earth...', image: BP11 },
      { id: 12, title: 'The Author', author: 'Raj Siddhi', price: 399, description: 'A dystopian vision of a scientifically engineered society...', image: BP12 },
      { id: 13, title: 'The Doctor', author: 'Oscar Patton', price: 549, description: 'An epic journey through Hell, Purgatory, and Paradise...', image: BP13 },
      { id: 14, title: 'Darkness Gathers', author: 'Emma Elliot', price: 325, description: 'A turbulent story of passion and revenge on the Yorkshire moors...', image: BP14 },
      { id: 15, title: 'Gitanjali', author: 'RabindraNath Tagore', price: 449, description: 'The epic poem about the Trojan War and Achilles\' rage...', image: BP15 },
      { id: 16, title: 'The Unwilling', author: 'John Hart', price: 399, description: 'The adventures of a nobleman who imagines himself a knight...', image: BP16 },
    ],
    []
  )

  const itemQuantity = (id) => cart.items.find((item) => item.id === id)?.quantity || 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Browse Books</h1>
        <p className="text-gray-600">Explore our featured picks and add books to your cart.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <article key={book.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <img src={book.image} alt={book.title} className="h-56 w-full object-cover" />
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-500">{book.category}</span>
                <span className="text-lg font-semibold text-slate-900">₹{book.price}</span>
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">{book.title}</h2>
              <p className="text-sm text-slate-600 mb-4">by {book.author}</p>
              <p className="text-sm text-slate-700 mb-5">{book.description}</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => addToCart({ id: book.id, title: book.title, price: book.price, author: book.author })}
                  className="rounded-full bg-slate-900 text-white px-4 py-2 text-sm hover:bg-slate-800 transition"
                >
                  Add to cart
                </button>
                {itemQuantity(book.id) > 0 && (
                  <span className="text-sm text-slate-500">In cart: {itemQuantity(book.id)}</span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default BooksPage
