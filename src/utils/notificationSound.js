// Synthesizes a short two-note "ding" via the Web Audio API instead of
// shipping an audio file - no extra asset to host/fetch, works identically
// everywhere. Used only for the admin "new order" notification (see
// NotificationBell.jsx) - deliberately not wired to every notification
// type, that would get noisy on a 30s poll.
let audioCtx;

const playTone = (ctx, freq, startTime, duration) => {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = freq;
    // quick fade in/out so it "dings" instead of clicking
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
};

export const playNewOrderSound = () => {
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        audioCtx = audioCtx || new Ctx();
        // browsers suspend the context until the page has seen a user
        // gesture - resume() is a harmless no-op if it's already running
        if (audioCtx.state === "suspended") audioCtx.resume();

        const now = audioCtx.currentTime;
        playTone(audioCtx, 880, now, 0.15); // first note
        playTone(audioCtx, 1318.5, now + 0.12, 0.25); // second, higher note - "ding-dong"
    } catch (err) {
        console.warn("Notification sound failed to play:", err);
    }
};
