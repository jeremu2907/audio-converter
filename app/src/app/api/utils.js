const ytdl = require('@distube/ytdl-core');

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

// export function getRandomIPv6Agent() {
//     const segment = () => {
//         return Math.floor(Math.random() * 0x10000).toString(16);
//     };

//     // const randomIP = `${process.env.IPV6_PREFIX}:${segment()}:${segment()}:${segment()}:${segment()}`;
//     // console.info(randomIP);
//     const agentIPv6 = ytdl.createAgent(undefined, {
//         localAddress: randomIP,
//     });
//     return agentIPv6;
// }
