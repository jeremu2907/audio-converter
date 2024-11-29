const ytdl = require('@distube/ytdl-core');
const fs = require('fs');
const path = require('path');

export function encodeRFC5987ValueChars(str) {
    return encodeURIComponent(str)
        .replace(/['()]/g, c => '%' + c.charCodeAt(0).toString(16))
        .replace(/\*/g, '%2A')
        .replace(/%(?:7C|60|5E)/g, c => String.fromCharCode(parseInt(c.slice(1), 16)));
}

// Returns true if video is at most 60 minutes
export function validVideoLength(videoInfo) {
    const duration = videoInfo.player_response.streamingData.formats[0].approxDurationMs;
    return (duration <= (60000 * 62));
}

export function getAgent() {
    const cookiesFilePath = path.resolve(process.cwd(), 'cookies.json');

    if (!fs.existsSync(cookiesFilePath)) {
        console.warn('cookies.json not found. Returning default agent.');
        return ytdl.createAgent();
    }

    try {
        const cookies = JSON.parse(fs.readFileSync(cookiesFilePath, 'utf-8'));
        return ytdl.createAgent(cookies);
    } catch (error) {
        console.error('Error reading cookies.json:', error);
        return ytdl.createAgent();
    }
}
