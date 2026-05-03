
const now = Date.now();
const oneDay = 24 * 60 * 60 * 1000;

for (let i = 4; i >= 0; i--) {
    const ts = now - i * oneDay;
    console.log(`Day ${4 - i + 1}: ${ts}`);
}
