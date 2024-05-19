const ytdl = require('ytdl-core');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

function encodeRFC5987ValueChars(str) {
    return encodeURIComponent(str)
        .replace(/['()]/g, c => '%' + c.charCodeAt(0).toString(16))
        .replace(/\*/g, '%2A')
        .replace(/%(?:7C|60|5E)/g, c => String.fromCharCode(parseInt(c.slice(1), 16)));
}

export async function GET(request) {
    const params = new URL(request.url).searchParams;
    const url = params.get('url').replace("\"","");

    if (!ytdl.validateURL(url)) {
        return new Response('Invalid URL', { status: 400 });
    }

    const videoInfo = await ytdl.getBasicInfo(url);
    const title = videoInfo.videoDetails.title;
    const artist = videoInfo.videoDetails.ownerChannelName.replace("- Topic", "").trim();
    const videoId  = videoInfo.videoDetails.videoId;
    const thumbnailURL = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    const data = {
        data: { 
            title: encodeRFC5987ValueChars(title),
            artist: artist,
            thumbnailURL: thumbnailURL
        }
    }

    return Response.json(data);
}
