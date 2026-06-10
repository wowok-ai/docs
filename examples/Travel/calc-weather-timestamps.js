
const now = Date.now();
const oneDay = 24 * 60 * 60 * 1000;

// Future 5 days timestamps (for testing weather-dependent activities)
for (let i = 1; i <= 5; i++) {
    const ts = now + i * oneDay;
    console.log(`Day ${i}: ${ts}`);
}
