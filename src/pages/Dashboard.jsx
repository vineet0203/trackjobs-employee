import { useEffect, useMemo, useState } from 'react';
import {
  breakEnd,
  breakStart,
  checkIn,
  checkOut,
  getDashboard,
  getTimeEntries,
  updateTimeEntry,
} from '../api/timeTracking';
import EditEntryModal from '../components/time-tracking/EditEntryModal';
import TimeEntriesTable from '../components/time-tracking/TimeEntriesTable';
import TimeTrackerCard from '../components/time-tracking/TimeTrackerCard';
import './Dashboard.css';

const getMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const computeElapsedSeconds = (activeEntry) => {
  if (!activeEntry?.check_in) return 0;

  const nowMs = Date.now();
  const checkInMs = new Date(activeEntry.check_in).getTime();
  const breakSeconds = Number(activeEntry.break_seconds || 0);
  const activeBreakSeconds =
    activeEntry.is_on_break && activeEntry.active_break_start
      ? Math.floor((nowMs - new Date(activeEntry.active_break_start).getTime()) / 1000)
      : 0;

  return Math.max(0, Math.floor((nowMs - checkInMs) / 1000) - breakSeconds - activeBreakSeconds);
};

const defaultPagination = {
  current_page: 1,
  last_page: 1,
  per_page: 5,
  total: 0,
};

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [entries, setEntries] = useState([]);
  const [pagination, setPagination] = useState(defaultPagination);
  const [activeSession, setActiveSession] = useState(null);

  const [isWorking, setIsWorking] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [activeEntryId, setActiveEntryId] = useState(null);

  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const [toast, setToast] = useState({ type: '', message: '' });
  const [editingEntry, setEditingEntry] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const employeeName = useMemo(() => {
    try {
      const raw = localStorage.getItem('employee_auth_employee');
      if (!raw) return 'Employee';
      const parsed = JSON.parse(raw);
      return parsed?.name || parsed?.full_name || parsed?.email || 'Employee';
    } catch {
      return 'Employee';
    }
  }, []);

  useEffect(() => {
    if (!toast.message) return;

    const timeoutId = setTimeout(() => {
      setToast({ type: '', message: '' });
    }, 2600);

    return () => clearTimeout(timeoutId);
  }, [toast]);

  useEffect(() => {
    if (!isWorking || !activeSession?.check_in) return;

    setSeconds(computeElapsedSeconds(activeSession));

    const intervalId = setInterval(() => {
      setSeconds(computeElapsedSeconds(activeSession));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isWorking, activeSession]);

  useEffect(() => {
    const init = async () => {
      setDashboardLoading(true);
      try {
        const response = await getDashboard();
        const data = response?.data?.data || {};

        setJobs(data.jobs || []);
        setEntries(data.entries || []);
        setPagination(data.entries_pagination || defaultPagination);

        const active = data.active_entry;
        if (active) {
          setActiveSession(active);
          setIsWorking(true);
          setIsOnBreak(Boolean(active.is_on_break));
          setActiveEntryId(active.id);
          setSelectedJob(String(active.job_id || ''));
          setSeconds(computeElapsedSeconds(active));
        } else {
          setActiveSession(null);
          setIsWorking(false);
          setIsOnBreak(false);
          setActiveEntryId(null);
          setSeconds(0);
        }
      } catch (error) {
        setToast({ type: 'error', message: getMessage(error, 'Failed to load dashboard.') });
      } finally {
        setDashboardLoading(false);
      }
    };

    init();
  }, []);

  const loadEntries = async (page) => {
    setTableLoading(true);
    try {
      const response = await getTimeEntries(page, pagination.per_page);
      const data = response?.data?.data || {};
      setEntries(data.items || []);
      setPagination(data.pagination || defaultPagination);
    } catch (error) {
      setToast({ type: 'error', message: getMessage(error, 'Failed to load entries.') });
    } finally {
      setTableLoading(false);
    }
  };

  const handleStart = async () => {
    if (!selectedJob) {
      setToast({ type: 'error', message: 'Please select a job first.' });
      return;
    }

    setActionLoading(true);
    try {
      const response = await checkIn({ job_id: Number(selectedJob) });
      const entry = response?.data?.data?.entry;

      setActiveSession(entry || null);
      setIsWorking(true);
      setIsOnBreak(false);
      setActiveEntryId(entry?.id || null);
      setSeconds(computeElapsedSeconds(entry));
      setToast({ type: 'success', message: 'Checked in successfully.' });
      await loadEntries(1);
    } catch (error) {
      setToast({ type: 'error', message: getMessage(error, 'Check-in failed.') });
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleBreak = async () => {
    setActionLoading(true);
    try {
      if (isOnBreak) {
        const response = await breakEnd();
        const breakEntry = response?.data?.data?.break_entry;

        setActiveSession((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            is_on_break: false,
            active_break_start: null,
            break_seconds: Number(prev.break_seconds || 0) + Number(breakEntry?.break_duration || 0),
          };
        });

        setIsOnBreak(false);
        setToast({ type: 'success', message: 'Break ended. Session resumed.' });
      } else {
        const response = await breakStart();
        const breakEntry = response?.data?.data?.break_entry;

        setActiveSession((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            is_on_break: true,
            active_break_start: breakEntry?.break_start || new Date().toISOString(),
          };
        });

        setIsOnBreak(true);
        setToast({ type: 'success', message: 'Break started.' });
      }
    } catch (error) {
      setToast({ type: 'error', message: getMessage(error, 'Failed to update break state.') });
    } finally {
      setActionLoading(false);
    }
  };

  const handleStop = async () => {
    if (!activeEntryId) return;

    setActionLoading(true);
    try {
      await checkOut({ time_entry_id: activeEntryId });

      setActiveSession(null);
      setIsWorking(false);
      setIsOnBreak(false);
      setSeconds(0);
      setActiveEntryId(null);
      setToast({ type: 'success', message: 'Checked out successfully.' });
      await loadEntries(1);
    } catch (error) {
      setToast({ type: 'error', message: getMessage(error, 'Check-out failed.') });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveEdit = async ({ id, start_time, end_time }) => {
    const nextStart = new Date(start_time.replace(' ', 'T')).getTime();
    const nextEnd = new Date(end_time.replace(' ', 'T')).getTime();

    const hasLocalOverlap = entries.some((entry) => {
      if (entry.id === id || !entry.check_out) return false;

      const existingStart = new Date(entry.check_in).getTime();
      const existingEnd = new Date(entry.check_out).getTime();

      return nextStart < existingEnd && nextEnd > existingStart;
    });

    if (hasLocalOverlap) {
      setToast({ type: 'error', message: 'Time range overlaps with another entry.' });
      return;
    }

    setEditLoading(true);
    try {
      await updateTimeEntry(id, { start_time, end_time });
      setToast({ type: 'success', message: 'Entry updated successfully.' });
      setEditingEntry(null);
      await loadEntries(pagination.current_page);
    } catch (error) {
      setToast({ type: 'error', message: getMessage(error, 'Failed to update entry.') });
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="employee-dashboard">
      <section>
        <p className="employee-dashboard-overline">Dashboard</p>
        <h1 className="employee-dashboard-title">Time Tracking</h1>
      </section>

      {toast.message ? (
        <div className={`employee-toast ${toast.type === 'error' ? 'error' : 'success'}`}>
          {toast.message}
        </div>
      ) : null}

      <section className="employee-dashboard-panel">
        <TimeTrackerCard
          jobs={jobs}
          selectedJob={selectedJob}
          onSelectJob={setSelectedJob}
          seconds={seconds}
          isWorking={isWorking}
          isOnBreak={isOnBreak}
          loading={actionLoading || dashboardLoading}
          onStart={handleStart}
          onToggleBreak={handleToggleBreak}
          onStop={handleStop}
        />

        {tableLoading ? (
          <div className="employee-table-loading">Loading entries...</div>
        ) : (
          <TimeEntriesTable
            entries={entries}
            employeeName={employeeName}
            pagination={pagination}
            onPageChange={loadEntries}
            onEdit={setEditingEntry}
          />
        )}
      </section>

      <EditEntryModal
        open={Boolean(editingEntry)}
        entry={editingEntry}
        loading={editLoading}
        onClose={() => setEditingEntry(null)}
        onSubmit={handleSaveEdit}
      />
    </div>
  );
};

export default Dashboard;
