import { getRandomIPv6Agent } from '../utils';

const ytdl = require('@distube/ytdl-core');

export async function GET(request) {
    const params = new URL(request.url).searchParams;
    const url = params.get('url').replace('"', '');

    if (!ytdl.validateURL(url)) {
        return new Response(
            'Invalid URL', {
                status: 400,
            }
        );
    }

    const videoInfo = await ytdl.getBasicInfo(url, {
        agent: getRandomIPv6Agent(),
    });
    const title = videoInfo.videoDetails.title;
    const artist = videoInfo.videoDetails.ownerChannelName.replace('- Topic', '').trim();
    const microformat = videoInfo.player_response.microformat.playerMicroformatRenderer;
    const embed = microformat.embed;

    const data = {
        title: title,
        artist: artist,
        embedObj: embed,
    };

    return Response.json(data);
}

export async function POST(request) {
    const urlList = (await request.json()).data;
    const videoList = new Array();

    for (const url of urlList) {
        if (!ytdl.validateURL(url)) {
            continue;
        }

        const videoInfo = await ytdl.getBasicInfo(url, {
            agent: getRandomIPv6Agent(),
        });
        const title = videoInfo.videoDetails.title;
        const artist = videoInfo.videoDetails.ownerChannelName.replace('- Topic', '').trim();
        const videoId = videoInfo.videoDetails.videoId;

        const data = {
            title: title,
            artist: artist,
            thumbnailURL: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
            url: url,
        };

        videoList.push(data);
    }

    return new Response(JSON.stringify(videoList));
}
