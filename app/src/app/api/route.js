// const ytdl = require('ytdl-core');
// const ffmpeg = require('fluent-ffmpeg');
// const fs = require('fs');
// const path = require('path');

// export async function GET(request) {
//     const params = request.nextUrl.searchParams;
//     const url = params.get('url');
//     const videoId = ytdl.getURLVideoID(url);
//     const output = path.resolve(`/tmp/${videoId}.flac`);

//     return new Promise((resolve, reject) => {
//         ytdl(url, {
//             filter: 'audioonly',
//             quality: 'highestaudio'
//         }).pipe(
//             ffmpeg()
//                 .audioCodec('flac')
//                 .toFormat('flac')
//                 .on('end', () => {
//                     const fileStream = fs.createReadStream(output);
//                     fileStream.on('end', () => {
//                         fs.unlink(output, (err) => {
//                             if (err) {
//                                 console.error('Error deleting file:', err);
//                             }
//                         });
//                     });

//                     const headers = new Headers();
//                     headers.append('Content-Type', 'audio/flac');
//                     headers.append('Content-Disposition', `attachment; filename="${videoId}.flac"`);

//                     resolve(new Response(fileStream, { headers }));
//                 })
//                 .on('error', (err) => {
//                     console.error('Error during conversion:', err);
//                     reject(new Response('Internal Server Error', { status: 500 }));
//                 })
//                 .save(output)
//         )
//     });
// }

const ytdl = require('ytdl-core');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

export async function GET(request) {
    const params = new URL(request.url).searchParams;
    const url = params.get('url');

    if (!ytdl.validateURL(url)) {
        return new Response('Invalid URL', { status: 400 });
    }

    const videoId = ytdl.getURLVideoID(url);
    const output = path.resolve(`/tmp/${videoId}.flac`);
    const audioStream = ytdl(url, {
        filter: 'audioonly',
        quality: 'highestaudio'
    });
    const thumbnailURL = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

    return new Promise((resolve, reject) => {
        const ffmpegProcess = exec(`ffmpeg -i pipe:0 -c:a flac -y ${output}`, (err, stdout, stderr) => {
            if (err) {
                console.error('Error during conversion:', err);
                reject(new Response('Internal Server Error', { status: 500 }));
                return;
            }

            const fileStream = fs.createReadStream(output);
            fileStream.on('end', () => {
                fs.unlink(output, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    }
                });
            });

            const headers = new Headers();
            headers.append('Content-Type', 'audio/flac');
            headers.append('Content-Disposition', `attachment; filename="${videoId}.flac"`);

            resolve(new Response(fileStream, { headers }));
        });

        audioStream.pipe(ffmpegProcess.stdin);
    });
}
