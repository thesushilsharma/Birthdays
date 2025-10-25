import { useState, useEffect } from 'react';
import birthdaysData from './birthdays.json';

interface Birthday {
  name: string;
  date: string;
}

const Calendar = () => {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setBirthdays(birthdaysData);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  const getMonthName = (month: number) => {
    return new Date(currentYear, month).toLocaleString('default', { month: 'long' });
  };

  const goToPreviousMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
    setCurrentYear((prevYear) => (currentMonth === 0 ? prevYear - 1 : prevYear));
  };

  const goToNextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
    setCurrentYear((prevYear) => (currentMonth === 11 ? prevYear + 1 : prevYear));
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = new Date();
  const todayFormatted = formatDate(today.toISOString());
  const todayBirthday = birthdays.find((birthday) => formatDate(birthday.date) === todayFormatted);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <button onClick={goToPreviousMonth} className="text-lg font-bold">&lt;</button>
        <h1 className="text-2xl font-bold">
          {getMonthName(currentMonth)} {currentYear}
        </h1>
        <button onClick={goToNextMonth} className="text-lg font-bold">&gt;</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-center">
        {[...Array(daysInMonth)].map((_, index) => {
          const currentDate = new Date(currentYear, currentMonth, index + 1);
          const formattedDate = formatDate(currentDate.toISOString());
          const birthdayEvents = birthdays.filter((birthday) => formatDate(birthday.date) === formattedDate);
          const isToday = currentDate.toDateString() === new Date().toDateString();

          return (
            <div key={index} className={`p-4 border border-slate-500 hover:border-slate-400 ${isToday ? 'bg-black text-white' : ''}`}>
              <div className="font-bold">{formattedDate}</div>
              {birthdayEvents.map((event, index) => (
                <div className="bg-sky-400 text-white hover:bg-sky-500 active:bg-sky-600 focus:outline-none focus:ring focus:ring-sky-300" key={index}>{event.name}</div>
              ))}
            </div>
          );
        })}
      </div>
      {todayBirthday && (
        <div className="mt-4 p-4 border border-gray-300 sm:text-2xl text-xl font-medium text-blue-500 hover:text-blue-900 underline">
          Happy Birthday, {todayBirthday.name}!<br></br> May your birthday be filled with happiness!. You are {today.getFullYear() - new Date(todayBirthday.date).getFullYear()} years old today!
        </div>
      )}
    </div>
  );
};

export default Calendar;
