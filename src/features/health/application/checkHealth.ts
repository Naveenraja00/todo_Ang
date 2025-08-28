export function checkHealth() {
  return { status: "ok", uptime: process.uptime() };
}
