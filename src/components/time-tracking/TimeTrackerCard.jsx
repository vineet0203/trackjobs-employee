const formatClock = (seconds) => {
  const value = Math.max(0, Number(seconds) || 0);
  const hours = Math.floor(value / 3600);
  const mins = Math.floor((value % 3600) / 60);
  const secs = value % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const TimeTrackerCard = ({
  jobs,
  selectedJob,
  onSelectJob,
  seconds,
  isWorking,
  isOnBreak,
  loading,
  onStart,
  onToggleBreak,
  onStop,
}) => {
  return (
    <section className="employee-time-card">
      <div className="employee-time-card-grid">
        <div>
          <h2 className="employee-time-card-title">Time tracker</h2>
          <p className="employee-time-card-subtitle">
            Track your work hours accurately and start your shift in one click.
          </p>
        </div>

        <div>
          <label className="employee-time-card-label" htmlFor="job-select">
            Assigned Jobs
          </label>
          <select
            id="job-select"
            className="employee-time-card-select"
            value={selectedJob}
            onChange={(event) => onSelectJob(event.target.value)}
            disabled={isWorking}
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

        <div className="employee-time-card-actions">
          <div className="employee-time-card-timer-wrap">
            <button type="button" className="employee-time-card-circle" onClick={onStart} disabled={isWorking || !selectedJob || loading}>
              ►
            </button>
            <div>
              <p className="employee-time-card-time">{formatClock(seconds)}</p>
              <p className="employee-time-card-time-caption">
                {isOnBreak ? 'On Break' : isWorking ? 'Working' : 'Ready to Start'}
              </p>
            </div>
          </div>

          <div className="employee-timer-actions">
            <button
              type="button"
              className="employee-time-card-button"
              onClick={onStart}
              disabled={isWorking || !selectedJob || loading}
            >
              {loading ? '...' : 'Start'}
            </button>

            <button
              type="button"
              className="employee-time-card-button secondary"
              onClick={onToggleBreak}
              disabled={!isWorking || loading}
            >
              {isOnBreak ? 'Resume' : 'Break'}
            </button>

            <button
              type="button"
              className="employee-time-card-button danger"
              onClick={onStop}
              disabled={!isWorking || isOnBreak || loading}
            >
              Stop
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimeTrackerCard;
