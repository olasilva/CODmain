const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "")
const STORAGE_KEY = "cod-academy-store"
const SESSION_KEY = "cod-academy-session"

function readStore() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
      users: [],
      applications: [],
      payments: [],
      messages: [],
      subscribers: [],
    }
  } catch {
    return { users: [], applications: [], payments: [], messages: [], subscribers: [] }
  }
}

function writeStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || "Request failed")
  return data
}

function id(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export async function registerUser(user) {
  if (API_URL) return request("/auth/register", { method: "POST", body: JSON.stringify(user) })
  const store = readStore()
  if (store.users.some((item) => item.email.toLowerCase() === user.email.toLowerCase())) {
    throw new Error("An account with this email already exists.")
  }
  const created = { ...user, id: id("user"), createdAt: new Date().toISOString() }
  store.users.push(created)
  writeStore(store)
  return created
}

export async function loginUser(credentials) {
  if (API_URL) return request("/auth/login", { method: "POST", body: JSON.stringify(credentials) })
  const store = readStore()
  const user = store.users.find(
    (item) => item.email.toLowerCase() === credentials.email.toLowerCase() && item.password === credentials.password && item.role === credentials.role,
  )
  if (!user) throw new Error("Invalid email, password, or account type.")
  const session = { id: user.id, fullName: user.fullName, email: user.email, role: user.role }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY))
  } catch {
    return null
  }
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY)
}

export async function createApplication(application) {
  if (API_URL) return request("/applications", { method: "POST", body: JSON.stringify(application) })
  const store = readStore()
  const created = { ...application, id: id("app"), status: "awaiting_payment", createdAt: new Date().toISOString() }
  store.applications.push(created)
  writeStore(store)
  return created
}

export async function recordPayment(payment) {
  if (API_URL) return request("/payments", { method: "POST", body: JSON.stringify(payment) })
  const store = readStore()
  const created = { ...payment, id: id("pay"), transactionId: `COD-${Date.now().toString().slice(-8)}`, status: "paid", paidAt: new Date().toISOString() }
  store.payments.push(created)
  const application = store.applications.find((item) => item.id === payment.applicationId)
  if (application) application.status = "submitted"
  writeStore(store)
  return created
}

export async function submitContactMessage(message) {
  if (API_URL) return request("/contact", { method: "POST", body: JSON.stringify(message) })
  const store = readStore()
  store.messages.push({ ...message, id: id("msg"), createdAt: new Date().toISOString() })
  writeStore(store)
  return { ok: true }
}

export async function subscribeToNewsletter(email) {
  if (API_URL) return request("/newsletter", { method: "POST", body: JSON.stringify({ email }) })
  const store = readStore()
  if (!store.subscribers.includes(email.toLowerCase())) store.subscribers.push(email.toLowerCase())
  writeStore(store)
  return { ok: true }
}
