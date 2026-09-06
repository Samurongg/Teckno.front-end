export interface SessionUser {
  name: string;
  email: string;
  role: string;
}

const SESSION_KEY = "tecnomarket.session";

const demoUser: SessionUser = {
  name: "Adriano Caycho",
  email: "analyst@tecnomarket.pe",
  role: "Data Analyst",
};

export function getSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function signIn(email: string, password: string): SessionUser | null {
  if (email.trim().toLowerCase() !== demoUser.email || password !== "teckno2026") return null;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(demoUser));
  return demoUser;
}

export function signOut() {
  window.localStorage.removeItem(SESSION_KEY);
}
