import { useState, useEffect } from 'react';
import { Calendar as ShadcnCalendar } from './components/ui/calendar';
import birthdaysData from './birthdays.json';

interface Birthday {
  name: string;
  date: string;
}

const Calendar = () => {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    setBirthdays(birthdaysData);
  }, []);

  // Parse birthday dates and normalize them to current year for comparison
  const parseBirthdayDate = (dateString: string): Date => {
    return new Date(dateString);
  };

  // Get birthdays for a specific date (ignoring year)
  const getBirthdaysForDate = (date: Date): Birthday[] => {
    return birthdays.filter(birthday => {
      const birthdayDate = parseBirthdayDate(birthday.date);
      return birthdayDate.getMonth() === date.getMonth() &&
        birthdayDate.getDate() === date.getDate();
    });
  };

  // Get all birthday dates for the calendar modifiers (for any year)
  const getBirthdayDates = (year?: number): Date[] => {
    // If no year specified, generate for a range of years around current
    if (!year) {
      const currentYear = new Date().getFullYear();
      const years = [];
      // Generate birthdays for 10 years before and after current year
      for (let y = currentYear - 10; y <= currentYear + 10; y++) {
        years.push(y);
      }

      return years.flatMap(y =>
        birthdays.map(birthday => {
          const birthdayDate = parseBirthdayDate(birthday.date);
          return new Date(y, birthdayDate.getMonth(), birthdayDate.getDate());
        })
      );
    }

    // Generate for specific year
    return birthdays.map(birthday => {
      const birthdayDate = parseBirthdayDate(birthday.date);
      return new Date(year, birthdayDate.getMonth(), birthdayDate.getDate());
    });
  };

  // Get today's birthdays
  const todaysBirthdays = getBirthdaysForDate(new Date());

  // Get selected date birthdays
  const selectedDateBirthdays = selectedDate ? getBirthdaysForDate(selectedDate) : [];

  const calculateAge = (birthdayString: string, asOfDate?: Date): number => {
    const birthDate = parseBirthdayDate(birthdayString);
    const referenceDate = asOfDate || new Date();
    let age = referenceDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = referenceDate.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Birthday Calendar</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar Section */}
        <div className="flex flex-col items-center">
          <ShadcnCalendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{
              birthday: getBirthdayDates(),
            }}
            modifiersStyles={{
              birthday: {
                backgroundColor: '#0ea5e9',
                color: 'white',
                fontWeight: 'bold'
              }
            }}
            className="rounded-md border"
          />

          <div className="mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Birthday</span>
            </div>
          </div>
        </div>

        {/* Birthday Details Section */}
        <div className="space-y-6">
          {/* Today's Birthdays */}
          {todaysBirthdays.length > 0 && (
            <div className="p-6 border border-blue-200 bg-blue-50 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">🎉 Today's Birthdays!</h2>
              {todaysBirthdays.map((birthday, index) => (
                <div key={index} className="mb-3 last:mb-0">
                  <div className="font-medium text-blue-900">{birthday.name}</div>
                  <div className="text-sm text-blue-700">
                    Turning {calculateAge(birthday.date)} years old today!
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Selected Date Birthdays */}
          {selectedDate && selectedDateBirthdays.length > 0 && (
            <div className="p-6 border border-gray-200 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Birthdays on {selectedDate.toLocaleDateString()}
              </h2>
              {selectedDateBirthdays.map((birthday, index) => (
                <div key={index} className="mb-3 last:mb-0">
                  <div className="font-medium text-gray-900">{birthday.name}</div>
                  <div className="text-sm text-gray-600">
                    Born {parseBirthdayDate(birthday.date).getFullYear()}
                    {selectedDate ? ` (Age on this date: ${calculateAge(birthday.date, selectedDate)})` : ''}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upcoming Birthdays */}
          <div className="p-6 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Birthdays</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {birthdays
                .map(birthday => ({
                  ...birthday,
                  nextBirthday: (() => {
                    const birthdayDate = parseBirthdayDate(birthday.date);
                    const currentYear = new Date().getFullYear();
                    let nextBirthday = new Date(currentYear, birthdayDate.getMonth(), birthdayDate.getDate());

                    if (nextBirthday < new Date()) {
                      nextBirthday = new Date(currentYear + 1, birthdayDate.getMonth(), birthdayDate.getDate());
                    }

                    return nextBirthday;
                  })()
                }))
                .sort((a, b) => a.nextBirthday.getTime() - b.nextBirthday.getTime())
                .slice(0, 5)
                .map((birthday, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <div className="font-medium">{birthday.name}</div>
                      <div className="text-sm text-gray-600">
                        {birthday.nextBirthday.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {Math.ceil((birthday.nextBirthday.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
