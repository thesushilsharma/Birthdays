import React from 'react';
import Calendar from './Calendar';

const App = () => {
  return (
    // <div className='bg-blue-200 p-4 rounded shadow'>
    //   <div className="container mx-auto mt-8 ">
    //   <h1 className="text-2xl font-bold mb-4">Birthday Calendar</h1>
    //   <Calendar />
    // </div>
    // </div>

    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-slate-300 p-4 rounded-xl shadow-xl">
        <header className="text-center">
          <h1 className="text-3xl font-medium title-font text-black mb-12 text-center">🗓️ Birthday Calendar 📅</h1>
          <q className="text-lg italic leading-relaxed mb-6">🎁 Not friends, not enemies, just strangers with memories. 🎂</q>
        </header>
        <Calendar />
      </div>
    </div>
  );
};

export default App;
