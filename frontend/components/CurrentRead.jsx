import React, { useState } from 'react';

const sampleBooks = [
  {
    id: 1,
    title: 'Atomic Habits',
    cover: 'https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg',
    pagesRead: 45,
    totalPages: 300,
  },
  {
    id: 2,
    title: 'Deep Work',
    cover: 'https://images-na.ssl-images-amazon.com/images/I/71g2ednj0JL.jpg',
    pagesRead: 120,
    totalPages: 280,
  },
  {
    id: 3,
    title: 'The Alchemist',
    cover: 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg',
    pagesRead: 75,
    totalPages: 200,
  },
];

const CurrentRead = () => {
  const [currentBook, setCurrentBook] = useState(sampleBooks[0]);

  const progressPercentage = Math.round((currentBook.pagesRead / currentBook.totalPages) * 100);

  return (
    <div className="p-6 max-w-xl mx-auto text-white font-inter bg-gray-900 min-h-screen">
      {/* Current Read Box */}
      <div className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-5 shadow-lg">
        <h2 className="text-2xl font-bold mb-2">📘 Current Read</h2>
        <p className="text-lg font-semibold">{currentBook.title}</p>
        <p className="text-sm mb-2">{`${currentBook.pagesRead} / ${currentBook.totalPages} pages read`}</p>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className="bg-green-400 h-3 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Carousel View */}
      <h3 className="text-lg font-semibold mb-2">📚 Select a Book</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {sampleBooks.map((book) => (
          <div
            key={book.id}
            onClick={() => setCurrentBook(book)}
            className={`flex-shrink-0 cursor-pointer border-4 rounded-lg ${
              currentBook.id === book.id ? 'border-green-400' : 'border-transparent'
            }`}
          >
            <img
              src={book.cover}
              alt={book.title}
              className="w-28 h-40 object-cover rounded-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentRead;
