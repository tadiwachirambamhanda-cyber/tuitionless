export function daysLeft(deadline: string, now = new Date()): number {
  const d = new Date(deadline + "T00:00:00");
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}
export function dayMonth(deadline: string): string {
  return new Date(deadline + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
export function year(deadline: string): string {
  return String(new Date(deadline + "T00:00:00").getFullYear());
}
export function longDate(date: string): string {
  return new Date(date + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
