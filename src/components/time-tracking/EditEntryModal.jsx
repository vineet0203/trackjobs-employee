import { useEffect, useState } from 'react';

const toTwo = (value) => String(value).padStart(2, '0');

const toTimeInput = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return `${toTwo(date.getHours())}:${toTwo(date.getMinutes())}`;
};

const toDatePrefix = (isoString) => {
  const date = new Date(isoString);
  return `${date.getFullYear()}-${toTwo(date.getMonth() + 1)}-${toTwo(date.getDate())}`;
};

const EditEntryModal = ({ open, entry, loading, onClose, onSubmit }) => {
  const [startTime, setStartTime] = useState(entry ? toTimeInput(entry.check_in) : '');
  const [endTime, setEndTime] = useState(entry ? toTimeInput(entry.check_out || entry.check_in) : '');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (entry) {
      setStartTime(toTimeInput(entry.check_in));
      setEndTime(toTimeInput(entry.check_out || entry.check_in));
      setLocalError('');
    }
  }, [entry]);

  if (!open || !entry) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setLocalError('');

    if (!startTime || !endTime) {
      setLocalError('Start time and end time are required.');
      return;
    }

    const datePrefix = toDatePrefix(entry.check_in);
    const startDateTime = `${datePrefix} ${startTime}:00`;
    const endDateTime = `${datePrefix} ${endTime}:00`;

    const startDate = new Date(startDateTime.replace(' ', 'T'));
    const endDate = new Date(endDateTime.replace(' ', 'T'));

    if (startDate >= endDate) {
      setLocalError('Start time must be before end time.');
      return;
    }

    if ((endDate - startDate) / 1000 > 86400) {
      setLocalError('Duration cannot exceed 24 hours.');
      return;
    }

    onSubmit({
      id: entry.id,
      start_time: startDateTime,
      end_time: endDateTime,
    });
  };

  return (
    <div className="employee-modal-overlay" role="presentation" onClick={onClose}>
      <div className="employee-modal-card" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <h3 className="employee-modal-title">Edit Entry</h3>

        <form className="employee-modal-form" onSubmit={handleSubmit}>
          <div className="employee-modal-grid">
            <div>
              <label className="employee-modal-label" htmlFor="startTime">
                Start Time
              </label>
              <input
                id="startTime"
                className="employee-modal-input"
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
              />
            </div>

            <div>
              <label className="employee-modal-label" htmlFor="endTime">
                End Time
              </label>
              <input
                id="endTime"
                className="employee-modal-input"
                type="time"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
              />
            </div>
          </div>

          {localError ? <p className="employee-modal-error">{localError}</p> : null}

          <div className="employee-modal-actions">
            <button type="button" className="employee-modal-btn cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="employee-modal-btn submit" disabled={loading}>
              {loading ? 'Saving...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEntryModal;
