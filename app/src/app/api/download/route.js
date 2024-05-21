const ytdl = require('ytdl-core');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

import { encodeRFC5987ValueChars, validVideoLength } from '../utils';

let cacheSize = 0;
const CACHE_CAPACITY = 50;

export async function GET(request) {
    exec('rm -rf /tmp/t-*.mp3 /tmp/*.jpg');
    if (cacheSize > CACHE_CAPACITY) {
        console.log('clearing cache');
        exec('rm -rf /tmp/*');
        cacheSize = 0;
    }

    const params = new URL(request.url).searchParams;
    const url = params.get('url').replace('"', '');

    if (!ytdl.validateURL(url)) {
        return new Response(
            'Invalid URL', {
                status: 400
            }
        );
    }

    const videoInfo = await ytdl.getBasicInfo(url);

    if (!validVideoLength(videoInfo)) {
        return new Response(
            'Please limit your video to at most 1 hour.',
            {
                status: 400
            }
        );
    }

    const title = videoInfo.videoDetails.title;
    const artist = videoInfo.videoDetails.ownerChannelName.replace('- Topic', '').trim();
    const videoId = videoInfo.videoDetails.videoId;
    const tempOutput = path.resolve(`/tmp/t-${videoId}.mp3`);
    const finalOutput = path.resolve(`/tmp/${videoId}.mp3`);
    const imagePath = path.resolve(`/tmp/${videoId}.jpg`);

    if (!fs.existsSync(finalOutput)) {
        console.log('not in cache');
        cacheSize++;

        const audioStream = ytdl(url, {
            filter: 'audioonly',
            quality: 'highestaudio',
        });

        const thumbnailURL = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

        let setThumbnail = true;
        try {
            const response = await axios.get(thumbnailURL, { responseType: 'arraybuffer' });
            fs.writeFileSync(imagePath, Buffer.from(response.data, 'binary'));
        } catch (err) {
            console.log(err);
            setThumbnail = false;
        }

        return new Promise((resolve, reject) => {
            const convertWAV = `ffmpeg -i pipe:0 -c:a libmp3lame -q:a 0 -metadata artist="${artist}" -metadata title="${title}" -y "${setThumbnail ? tempOutput : finalOutput}"`;
            const ffmpegProcess = exec(convertWAV, async (err, stdout, stderr) => {
                if (err) {
                    console.error('Error during conversion:', err);
                    reject(new Response('Internal Server Error', { status: 500 }));
                    return;
                }

                if (setThumbnail) {
                    const addThumbnail = `ffmpeg -i "${tempOutput}" -i "${imagePath}" -map 0:0 -map 1:0 -c copy -id3v2_version 3 -metadata:s:v title="Album cover" -metadata:s:v comment="Cover (front)" -y "${finalOutput}"`;
                    exec(addThumbnail, (err, stdout_, stderr_) => {
                        if (err) {
                            console.error('Error during thumnail:', err);
                            return;
                        }

                        const fileStreamSong = fs.createReadStream(finalOutput);

                        const headers = new Headers();
                        headers.append('Content-Type', 'audio/mp3');
                        const encodedTitle = encodeRFC5987ValueChars(title);
                        headers.append('Content-Disposition', `attachment; filename*=UTF-8''${encodedTitle}.mp3`);

                        resolve(new Response(fileStreamSong, { headers }));
                    });
                } else {
                    const fileStreamSong = fs.createReadStream(finalOutput);

                    const headers = new Headers();
                    headers.append('Content-Type', 'audio/mp3');
                    const encodedTitle = encodeRFC5987ValueChars(title);
                    headers.append('Content-Disposition', `attachment; filename*=UTF-8''${encodedTitle}.mp3`);

                    resolve(new Response(fileStreamSong, { headers }));
                }
            });

            audioStream.pipe(ffmpegProcess.stdin);
        });
    } else {
        console.log('found in cache');
        const fileStreamSong = fs.createReadStream(finalOutput);

        const headers = new Headers();
        headers.append('Content-Type', 'audio/mp3');
        const encodedTitle = encodeRFC5987ValueChars(title);
        headers.append('Content-Disposition', `attachment; filename*=UTF-8''${encodedTitle}.mp3`);

        return new Response(fileStreamSong, { headers });
    }
}
