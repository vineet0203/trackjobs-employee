const formatDuration = (seconds) => {
  const value = Number(seconds) || 0;
  const hrs = Math.floor(value / 3600);
  const mins = Math.floor((value % 3600) / 60);
  return `${hrs}h ${String(mins).padStart(2, '0')}m`;
};

const formatTime = (iso) => {
  if (!iso) return '-';
  const date = new Date(iso);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const statusClass = {
  pending: 'status-pending',
  approved: 'status-approved',
  rejected: 'status-rejected',
};

const TimeEntriesTable = ({ entries, employeeName, pagination, onPageChange, onEdit }) => {
  const pageButtons = Array.from({ length: pagination.last_page || 1 }, (_, idx) => idx + 1);
  const showFrom = pagination.total === 0 ? 0 : (pagination.current_page - 1) * pagination.per_page + 1;
  const showTo = pagination.total === 0 ? 0 : Math.min(pagination.current_page * pagination.per_page, pagination.total);

  return (
    <section className="employee-table-shell">
      <div className="employee-table-scroll">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Job</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Hours</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={7} className="employee-table-empty">No time entries yet.</td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.date}</td>
                  <td>{entry.job_name || '-'}</td>
                  <td>{formatTime(entry.check_in)}</td>
                  <td>{formatTime(entry.check_out)}</td>
                  <td>{formatDuration(entry.total_time)}</td>
                  <td><span className={`employee-status-badge ${statusClass[entry.status] || 'status-pending'}`}>{entry.status}</span></td>
                  <td>
                    <button
                      type="button"
                      className={`employee-action-button ${entry.status === 'approved' ? 'neutral' : 'primary'}`}
                      onClick={() => onEdit(entry)}
                      disabled={entry.status === 'approved'}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="employee-pagination">
        <p>
          Showing {showFrom}-{showTo} out of {pagination.total} results
        </p>
        <div className="employee-pagination-buttons">
          {pageButtons.map((page) => (
            <button
              key={page}
              type="button"
              className={page === pagination.current_page ? 'active' : ''}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimeEntriesTable;
