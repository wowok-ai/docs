const DAY_MS = 86400000; // 24 * 60 * 60 * 1000
const now = Date.now();
// Align to UTC 00:00:00 of today, then compute the next 5 days.
// Repository data is keyed by timestamp, so the submitted activity date
// must match exactly the id used when adding weather data.
const todayStart = Math.floor(now / DAY_MS) * DAY_MS;

// Future 5 days UTC day-start timestamps (for testing weather-dependent activities)
for (let i = 1; i <= 5; i++) {
    const ts = todayStart + i * DAY_MS;
    console.log(`Day ${i}: ${ts} (${new Date(ts).toISOString()})`);
}
