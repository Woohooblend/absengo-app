import api from './index';

// Fetch attendance for a specific student (by studentId or current user)
export async function fetchAttendance(studentId) {
  // If studentId is provided, fetch for that student; otherwise, fetch for current user
  const url = studentId ? `/attendance?studentId=${studentId}` : '/attendance/self';
  const response = await api.get(url);
  return response.data;
}

// Fetch all session details
export async function fetchSessions() {
  const response = await api.get('/classsession/session');
  return response.data;
}

// Patch attendance by ID
export async function patchAttendance(id, data) {
  const response = await api.patch(`/attendance/patch/${id}`, data);
  return response.data;
}

// Fetch attendance history (sessions already over)
export async function fetchAttendanceHistory() {
  const response = await api.get('/attendance/self');
  const now = new Date();
  // Filter for sessions that are already over
  return response.data.filter(item => {
    if (!item.SessionDate || !item.sessionHourEnd) return false;
    const endDateTime = new Date(`${item.SessionDate}T${item.sessionHourEnd}`);
    return endDateTime < now;
  });
}

// Fetch incomplete attendance (not yet complete)
export async function fetchIncompleteAttendance() {
  const response = await api.get('/attendance/self');
  return response.data.filter(item => !item.checkInTime || !item.checkOutTime);
} 