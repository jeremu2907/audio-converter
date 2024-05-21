export function encodeRFC5987ValueChars(str) {
    return encodeURIComponent(str)
        .replace(/['()]/g, c => '%' + c.charCodeAt(0).toString(16))
        .replace(/\*/g, '%2A')
        .replace(/%(?:7C|60|5E)/g, c => String.fromCharCode(parseInt(c.slice(1), 16)));
}

// Returns true if video is at most 60 minutes
export function validVideoLength(videoInfo) {
    const duration = videoInfo.player_response.streamingData.formats[0].approxDurationMs
    return (duration <= (60000 * 62));
}
