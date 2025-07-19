import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const initialBooks = [
  {
    title: 'The Alchemist',
    totalPages: 200,
    pagesRead: 75,
    cover: 'https://covers.openlibrary.org/b/id/8167896-L.jpg',
    description: 'A journey of self-discovery and spiritual growth.',
  },
  {
    title: 'Atomic Habits',
    totalPages: 300,
    pagesRead: 120,
    cover: 'https://covers.openlibrary.org/b/id/10594708-L.jpg',
    description: 'Small habits, big results—master your behavior.',
  },
  {
    title: 'Deep Work',
    totalPages: 250,
    pagesRead: 90,
    cover: 'https://covers.openlibrary.org/b/id/9254161-L.jpg',
    description: 'Focused success in a distracted world.',
  },
  {
    title: 'Digital Minimalism',
    totalPages: 180,
    pagesRead: 45,
    cover: 'https://covers.openlibrary.org/b/id/9254515-L.jpg',
    description: 'Living better with less technology.',
  },
  {
    title: 'Can’t Hurt Me',
    totalPages: 250,
    pagesRead: 160,
    cover: 'https://covers.openlibrary.org/b/id/10045244-L.jpg',
    description: 'Master your mind and defy the odds with David Goggins.',
  },
];

const CurrentRead = () => {
  const [books] = useState(initialBooks);
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalBooks = books.length;

  const wrapIndex = (index) => (index + totalBooks) % totalBooks;
  const nextBook = () => setCurrentIndex((prev) => wrapIndex(prev + 1));
  const prevBook = () => setCurrentIndex((prev) => wrapIndex(prev - 1));

  return (
    <div className="relative z-10 p-6 bg-gray-900 text-white font-inter max-w-4xl mx-auto rounded-lg overflow-hidden">
      {/* HUD-style Title */}
      <div className="bg-gray-800 p-4 rounded-xl mb-6 shadow-lg text-center border-2 border-blue-500 shadow-blue-700">
        <h2 className="text-2xl font-extrabold tracking-wider uppercase text-blue-400 drop-shadow-lg">
          Current Read
        </h2>
      </div>

      <div className="relative flex justify-center items-center h-[460px]">
        <button
          onClick={prevBook}
          className="absolute left-0 p-3 bg-gray-800 hover:bg-blue-600 transition rounded-full z-10 shadow-md shadow-blue-400"
        >
          <FaArrowLeft size={20} />
        </button>

        <div className="relative w-full h-full flex justify-center items-center overflow-hidden">
          {[-1, 0, 1].map((offset) => {
            const index = wrapIndex(currentIndex + offset);
            const book = books[index];

            const translateX = offset * 220;
            const scale = offset === 0 ? 1.1 : 0.9;
            const opacity = offset === 0 ? 1 : 0.5;
            const zIndex = offset === 0 ? 10 : 5;

            const progressPercent = Math.min(
              100,
              Math.floor((book.pagesRead / book.totalPages) * 100)
            );

            return (
              <div
                key={book.title}
                className={`absolute transition-all duration-500 ease-in-out transform hover:scale-[1.02] ${
                  offset === 0 ? 'shadow-2xl shadow-blue-500/50' : ''
                }`}
                style={{
                  transform: `translateX(${translateX}px) scale(${scale})`,
                  opacity,
                  zIndex,
                }}
              >
                <div className="flex flex-col items-center w-44 bg-gray-800/60 p-2 rounded-xl border-2 border-gray-700 hover:border-blue-400 transition-all duration-300">
                  <img
                    src={book.cover}
                    alt={book.title}
                    draggable={false}
                    className="rounded-lg shadow-lg w-40 h-64 object-cover border-2 border-gray-600"
                  />
                  <p className="text-base font-bold mt-2 text-center text-white">
                    {book.title}
                  </p>
                  <p className="text-xs text-center text-gray-300 px-1 mt-1">
                    {book.description}
                  </p>
                  <div className="w-full h-3 bg-gray-700 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={nextBook}
          className="absolute right-0 p-3 bg-gray-800 hover:bg-blue-600 transition rounded-full z-10 shadow-md shadow-blue-400"
        >
          <FaArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default CurrentRead;
