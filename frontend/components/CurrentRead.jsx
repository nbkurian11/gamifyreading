import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const initialBooks = [
  {
    title: 'The Alchemist',
    description: 'A young shepherd sets out to find treasure and discovers his personal legend.',
    totalPages: 200,
    pagesRead: 75,
    cover: 'https://covers.openlibrary.org/b/id/8167896-L.jpg',
  },
  {
    title: 'Atomic Habits',
    description: 'A guide to building better habits through small daily improvements.',
    totalPages: 300,
    pagesRead: 120,
    cover: 'https://covers.openlibrary.org/b/id/10594708-L.jpg',
  },
  {
    title: 'Deep Work',
    description: 'Strategies for focused success in a distracted world.',
    totalPages: 250,
    pagesRead: 90,
    cover: 'https://covers.openlibrary.org/b/id/9254161-L.jpg',
  },
  {
    title: 'The 4-Hour Workweek',
    description: 'Escape the 9–5 and create a life of freedom and fulfillment.',
    totalPages: 320,
    pagesRead: 60,
    cover: 'https://covers.openlibrary.org/b/id/8231991-L.jpg',
  },
  {
    title: 'Book 5',
    description: 'A mysterious novel about the unknown world.',
    totalPages: 180,
    pagesRead: 90,
    cover: 'https://covers.openlibrary.org/b/id/8235153-L.jpg',
  },
  {
    title: 'Dune',
    description: 'A sci-fi epic about politics, power, and spice on the desert planet Arrakis.',
    totalPages: 412,
    pagesRead: 150,
    cover: 'https://covers.openlibrary.org/b/id/10458961-L.jpg',
  },
  {
    title: '1984',
    description: 'A dystopian tale of surveillance, control, and rebellion.',
    totalPages: 328,
    pagesRead: 50,
    cover: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
  },
  {
    title: 'Sapiens',
    description: 'A brief history of humankind’s evolution and development.',
    totalPages: 400,
    pagesRead: 200,
    cover: 'https://covers.openlibrary.org/b/id/8319251-L.jpg',
  },
];

const CurrentRead = () => {
  const [books, setBooks] = useState(initialBooks);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const totalBooks = books.length;

  const wrapIndex = (index) => (index + totalBooks) % totalBooks;
  const nextBook = () => setCurrentIndex((prev) => wrapIndex(prev + 1));
  const prevBook = () => setCurrentIndex((prev) => wrapIndex(prev - 1));

  useEffect(() => {
    const fetchExtraBooks = async () => {
      setLoading(true);
      try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = 'Give me 5 made-up book titles with a short description and fictional page count and cover image link (you can use placeholder.com). Return JSON array.';
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/```json([\s\S]*?)```/);

        const cleaned = jsonMatch
          ? jsonMatch[1].trim()
          : text.trim();

        const parsedBooks = JSON.parse(cleaned);

        setBooks((prev) => [...prev, ...parsedBooks]);
      } catch (err) {
        console.error('Failed to load books from Gemini:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExtraBooks();
  }, []);

  return (
    <div className="relative z-10 p-6 bg-gray-900 text-white font-inter max-w-4xl mx-auto rounded-lg overflow-hidden">
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

            const isLoadingCard = loading && index >= 8;

            return (
              <div
                key={index}
                className={`absolute transition-all duration-500 ease-in-out transform ${
                  offset === 0 ? 'shadow-2xl shadow-blue-500/50' : ''
                } ${isLoadingCard ? 'animate-pulse' : ''}`}
                style={{
                  transform: `translateX(${translateX}px) scale(${scale})`,
                  opacity,
                  zIndex,
                }}
              >
                <div className="flex flex-col items-center w-44 bg-gray-800/60 p-2 rounded-xl border-2 border-gray-700 hover:border-blue-400 transition-all duration-300">
                  {isLoadingCard ? (
                    <div className="w-40 h-64 rounded-lg bg-gray-700 animate-pulse mb-2"></div>
                  ) : (
                    <>
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="rounded-lg shadow-lg w-40 h-64 object-cover border-2 border-gray-600"
                      />
                      <p className="text-base font-bold mt-2 text-center text-blue-300">
                        {book.title}
                      </p>
                      <p className="text-xs text-gray-300 mt-1 mb-1 text-center">
                        {book.description}
                      </p>
                      <div className="w-full h-3 bg-gray-700 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </>
                  )}
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
