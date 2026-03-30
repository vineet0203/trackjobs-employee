import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const toDateKey = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const CalendarView = ({ listings, selectedDate, onDateChange, onClearDate }) => {
  const listingDateMap = listings.reduce((acc, item) => {
    const key = toDateKey(item.date);
    if (key) {
      acc[key] = true;
    }
    return acc;
  }, {});

  return (
    <section className="employee-calendar-card">
      <div className="employee-calendar-header">
        <div>
          <h2>Calendar View</h2>
          <p>Click a highlighted date to filter listings below.</p>
        </div>
        {selectedDate ? (
          <button type="button" className="employee-btn employee-btn-ghost" onClick={onClearDate}>
            Clear Date Filter
          </button>
        ) : null}
      </div>

      <Calendar
        onChange={(value) => onDateChange(Array.isArray(value) ? value[0] : value)}
        value={selectedDate || new Date()}
        tileClassName={({ date, view }) => {
          if (view !== 'month') return '';
          return listingDateMap[toDateKey(date)] ? 'employee-calendar-has-listing' : '';
        }}
      />
    </section>
  );
};

export default CalendarView;
