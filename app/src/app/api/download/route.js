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
    const tempOutput = path.resolve(`/tmp/t-${videoId}.mp3`);
    const finalOutput = path.resolve(`/tmp/${videoId}.mp3`);
    const imagePath = path.resolve(`/tmp/${videoId}.jpg`);
    const audioStream = ytdl(url, {
        filter: 'audioonly',
        quality: 'highestaudio'
    });

    const thumbnailURL = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    let setThumbnail = true;
    try {
        const response = await axios.get(thumbnailURL, { responseType: 'arraybuffer' });
        fs.writeFileSync(imagePath, Buffer.from(response.data, 'binary')); // Save the image file
    } catch (err){
        console.log(err)
        setThumbnail = false;
    }

    return new Promise(async (resolve, reject) => {
        const convertWAV = `ffmpeg -i pipe:0 -c:a libmp3lame -q:a 0 -metadata artist="${artist}" -metadata title="${title}" -y "${setThumbnail?tempOutput:finalOutput}"`;
        const ffmpegProcess = exec(convertWAV, (err, stdout, stderr) => {
            if (err) {
                console.error('Error during conversion:', err);
                reject(new Response('Internal Server Error', { status: 500 }));
                return;
            }

            if (setThumbnail) {
                const addThumbnail = `ffmpeg -i "${tempOutput}" -i "${imagePath}" -map 0:0 -map 1:0 -c copy -id3v2_version 3 -metadata:s:v title="Album cover" -metadata:s:v comment="Cover (front)" -y "${finalOutput}"`
                exec(addThumbnail, (err, stdout, stderr) => {
                    if (err) {
                        console.error('Error during thumnail:', err);
                        return;
                    }
                });
            }

            const fileStreamSong = fs.createReadStream(finalOutput);

            const headers = new Headers();
            headers.append('Content-Type', 'audio/mp3');
            const encodedTitle = encodeRFC5987ValueChars(title);
            headers.append('Content-Disposition', `attachment; filename*=UTF-8''${encodedTitle}.mp3`);

            resolve(new Response(fileStreamSong, { headers }));
        });

        fs.access(finalOutput, fs.constants.F_OK, (err) => {
            if (err) {
                audioStream.pipe(ffmpegProcess.stdin);
            } else {
                console.log("found in cache");
                const fileStreamSong = fs.createReadStream(finalOutput);

                const headers = new Headers();
                headers.append('Content-Type', 'audio/mp3');
                const encodedTitle = encodeRFC5987ValueChars(title);
                headers.append('Content-Disposition', `attachment; filename*=UTF-8''${encodedTitle}.mp3`);

                resolve(new Response(fileStreamSong, { headers }));
            }
        });
    });
}
