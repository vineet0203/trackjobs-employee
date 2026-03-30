const formatClock = (seconds) => {
  const value = Math.max(0, Number(seconds) || 0);
  const hours = Math.floor(value / 3600);
  const mins = Math.floor((value % 3600) / 60);
  const secs = value % 60;

  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const TimeTracker = ({
  jobs,
  selectedJob,
  onSelectJob,
  isWorking,
  loading,
  seconds,
  activeSession,
  onCheckIn,
  onCheckOut,
}) => {
  return (
    <section className="employee-time-tracker-card">
      <div className="employee-time-tracker-head">
        <h2>Time Tracker</h2>
        <p>Manage your shift with quick check-in and check-out controls.</p>
      </div>

      <div className="employee-time-tracker-controls">
        <div className="employee-time-tracker-group">
          <label htmlFor="job-select">Assigned Job</label>
          <select
            id="job-select"
            value={selectedJob}
            onChange={(event) => onSelectJob(event.target.value)}
            disabled={isWorking || loading}
          >
            <option value="">Select Job</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.job_number ? `${job.job_number} - ` : ''}
                {job.title}
              </option>
            ))}
          </select>
        </div>

        <div className="employee-time-tracker-timer-wrap">
          <p className="employee-time-tracker-timer">{formatClock(seconds)}</p>
          <p className="employee-time-tracker-state">{isWorking ? 'Active Session' : 'No Active Session'}</p>
          {activeSession?.job_name ? (
            <p className="employee-time-tracker-job">{activeSession.job_name}</p>
          ) : null}
        </div>

        <div className="employee-time-tracker-buttons">
          <button
            type="button"
            className="employee-btn employee-btn-primary"
            onClick={onCheckIn}
            disabled={isWorking || loading || !selectedJob}
          >
            {loading && !isWorking ? 'Checking In...' : 'Check In'}
          </button>
          <button
            type="button"
            className="employee-btn employee-btn-danger"
            onClick={onCheckOut}
            disabled={!isWorking || loading}
          >
            {loading && isWorking ? 'Checking Out...' : 'Check Out'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default TimeTracker;
