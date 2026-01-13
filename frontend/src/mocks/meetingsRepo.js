import seedMeetings from './pastMeetings.json'

const STORAGE_KEY = 'mockMeetings:v2'

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function seedIfEmpty() {
  const existing = safeParse(localStorage.getItem(STORAGE_KEY), null)
  if (Array.isArray(existing)) return existing
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedMeetings))
  return seedMeetings
}

function saveAll(meetings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings))
}

export function getAllMeetingsMock() {
  return seedIfEmpty()
}

export function createMeetingMock(meeting) {
  const all = seedIfEmpty()
  const id = `m-${Date.now()}`

  const next = {
    id,
    title: meeting.title,
    meeting_start_time: meeting.meeting_start_time,
    meeting_location: meeting.meeting_location,
    summary: meeting.summary,
    status: meeting.status || 'PLANIRAN',
    items: Array.isArray(meeting.items) ? meeting.items : [],
    viewedBy: meeting.viewedBy || {},
  }

  const updated = [next, ...all]
  saveAll(updated)
  return next
}

export function publishMeetingMock(id) {
  const all = seedIfEmpty()
  const updated = all.map((m) => (m.id === id ? { ...m, status: 'OBJAVLJEN' } : m))
  saveAll(updated)
}


