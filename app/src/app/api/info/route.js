const ytdl = require('ytdl-core');

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
    const microformat = videoInfo.player_response.microformat.playerMicroformatRenderer;
    const embed = microformat.embed;

    const data = {
        title: title,
        artist: artist,
        embedObj: embed,
    }

    return Response.json(data);
}
