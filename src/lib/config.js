const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

export const API_URL =
  configuredApiUrl?.replace(/\/$/, "") ||
  (import.meta.env.DEV ? "http://localhost:5000/api" : "/api");

export const ACADEMIC_SESSION = "2026/2027";
export const SCHOOL_HOTLINE = "07068098651";
export const WHATSAPP_URL = `https://wa.me/234${SCHOOL_HOTLINE.slice(1)}`;
