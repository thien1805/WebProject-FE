// src/pages/Doctor-dashboard/hooks/useDoctorDashboard.js
export function useDoctorDashboard() {
  const greeting = {
    name: "Zaid",
    subText: "Have a nice day and don't forget to take care of your health!",
    quote: "Good things take time.",
  };

  // Demo appointment history (replace with real API data when available)
  const demoAppointments = [
    { id: 1, patient: "Nguyen Van A", status: "completed", date: "2025-01-10" },
    { id: 2, patient: "Tran Thi B", status: "completed", date: "2025-01-21" },
    { id: 3, patient: "Le Minh C", status: "completed", date: "2025-02-05" },
    { id: 4, patient: "Pham D", status: "completed", date: "2025-02-18" },
    { id: 5, patient: "Hoang E", status: "completed", date: "2025-03-02" },
    { id: 6, patient: "Dang F", status: "completed", date: "2025-03-25" },
    { id: 7, patient: "Vu G", status: "completed", date: "2025-04-12" },
    { id: 8, patient: "Vo H", status: "completed", date: "2025-04-20" },
    { id: 9, patient: "Phan I", status: "completed", date: "2025-05-08" },
    { id: 10, patient: "Do J", status: "completed", date: "2025-05-22" },
    { id: 11, patient: "Mai K", status: "completed", date: "2025-06-03" },
    { id: 12, patient: "Bui L", status: "completed", date: "2025-06-19" },
    { id: 13, patient: "Ngo M", status: "completed", date: "2025-07-07" },
    { id: 14, patient: "La N", status: "completed", date: "2025-07-25" },
  ];

  const buildMonthlyActivity = (appointments, months = 6) => {
    const now = new Date();
    const buckets = [];

    for (let offset = months - 1; offset >= 0; offset -= 1) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      const month = monthDate.getMonth();
      const year = monthDate.getFullYear();

      const count = appointments.filter((appt) => {
        if (appt.status !== "completed") return false;
        const d = new Date(appt.date);
        return (
          !Number.isNaN(d.getTime()) &&
          d.getFullYear() === year &&
          d.getMonth() === month
        );
      }).length;

      buckets.push({
        label: monthDate.toLocaleString("en-US", { month: "short" }),
        count,
      });
    }

    const maxValue = Math.max(...buckets.map((b) => b.count), 1);
    const points = buckets.map((bucket, idx) => {
      const x = buckets.length > 1 ? (idx / (buckets.length - 1)) * 100 : 0;
      const baseline = 35; // axis y position (matches DashboardActivity viewBox)
      const amplitude = 25; // how high the line can go above baseline
      const normalizedY = baseline - (bucket.count / maxValue) * amplitude;
      return { x: Number(x.toFixed(2)), y: Number(normalizedY.toFixed(2)) };
    });

    return { points, labels: buckets.map((b) => b.label) };
  };

  const activity = buildMonthlyActivity(demoAppointments, 6);

  const formatNumber = (n) =>
    Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 0 });

  const countLastNDays = (appointments, days) => {
    const now = new Date();
    const cutoff = new Date(now);
    cutoff.setDate(now.getDate() - days);
    return appointments.filter((appt) => {
      const d = new Date(appt.date);
      return (
        !Number.isNaN(d.getTime()) &&
        d >= cutoff &&
        d <= now &&
        appt.status === "completed"
      );
    }).length;
  };

  const uniquePatients = Array.from(
    new Set(demoAppointments.map((a) => a.patient))
  ).length;
  const completedThisMonth = buildMonthlyActivity(demoAppointments, 1).points[0]
    ? buildMonthlyActivity(demoAppointments, 1).points[0].count
    : 0;
  const completedLastMonth = buildMonthlyActivity(demoAppointments, 2).points[0]
    ? buildMonthlyActivity(demoAppointments, 2).points[0].count
    : 0;
  const monthTrendDelta =
    completedLastMonth === 0
      ? 100
      : ((completedThisMonth - completedLastMonth) / completedLastMonth) * 100;

  const stats = [
    {
      id: "totalPatients",
      label: "Total Patients",
      value: formatNumber(uniquePatients),
      trend: `${monthTrendDelta >= 0 ? "+" : ""}${monthTrendDelta.toFixed(1)}%`,
      trendDirection: monthTrendDelta >= 0 ? "up" : "down",
      trendText: "vs last month",
    },
    {
      id: "newPatients",
      label: "New Patients (30d)",
      value: formatNumber(countLastNDays(demoAppointments, 30)),
      trend: "—",
      trendDirection: "up",
      trendText: "Last 30 days",
    },
    {
      id: "earnings",
      label: "Earnings",
      value: `${formatNumber(completedThisMonth * 500000)} VND`,
      trend: "est.",
      trendDirection: "up",
      trendText: "Based on completed visits",
    },
    {
      id: "appointments",
      label: "Appointments (month)",
      value: formatNumber(completedThisMonth),
      trend: `${monthTrendDelta >= 0 ? "+" : ""}${monthTrendDelta.toFixed(1)}%`,
      trendDirection: monthTrendDelta >= 0 ? "up" : "down",
      trendText: "vs last month",
    },
  ];

  const transactions = [
    {
      id: 1,
      type: "card",
      title: "Deposit from my Card",
      date: "28 January 2021",
      amount: "-$850",
      positive: false,
    },
    {
      id: 2,
      type: "paypal",
      title: "Mohamed Amir",
      date: "25 January 2025",
      amount: "+$2,500",
      positive: true,
    },
    {
      id: 3,
      type: "user",
      title: "Hussein Alnashat",
      date: "21 January 2025",
      amount: "+$5,400",
      positive: true,
    },
  ];

  // Calendar: dynamic based on real date + demo appointments
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11

  const monthLabel = now.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const activeDay = now.getDate();

  const demoCalendarAppointments = [
    {
      id: 1,
      date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-05`,
    },
    {
      id: 2,
      date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-12`,
    },
    {
      id: 3,
      date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-24`,
    },
  ];

  const dotDays = demoCalendarAppointments
    .map((a) => new Date(a.date))
    .filter(
      (d) =>
        !Number.isNaN(d.getTime()) &&
        d.getFullYear() === currentYear &&
        d.getMonth() === currentMonth
    )
    .map((d) => d.getDate());

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const firstWeekday = firstDayOfMonth.getDay(); // 0 = Sun
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstWeekday; i += 1) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d += 1) {
    days.push(d);
  }
  while (days.length % 7 !== 0) {
    days.push(null);
  }

  const calendar = {
    monthLabel,
    activeDay,
    dotDays,
    days,
  };

  const upcoming = {
    name: "Ahmed Tamer Fawzy",
    dateText: "8 August, 2025 - 04:00 PM",
  };

  return {
    greeting,
    stats,
    activity,
    transactions,
    calendar,
    upcoming,
  };
}
