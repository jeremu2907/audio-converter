import { useState } from "react";
import axios from 'axios';
import {toast} from 'react-toastify';

export default function Mp3Converter() {
    const [yturl, setYturl] = useState('');
    const [videoData, setVideoData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = e => {
        setYturl(e.target.value);
        setVideoData(null);
    }

    const getInfo = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        try {
            if (yturl.trim() === "") {
                toast.info("You gotta paste valid Youtube URL");
                return;
            }
            const response = await axios.get(`/api/info?url=${yturl}`);
            setVideoData(response.data);
        } catch (err) {
            console.error(err);
            toast.error("Can't find your video");
        }
    };

    const download = async () => {
        setLoading(true);
        try {
            if (yturl.trim() === "") {
                toast.info("You gotta paste valid Youtube URL");
                setLoading(false);
                return;
            }
            const response = await axios.get(`/api/download?url=${yturl}`, {
                responseType: 'blob',
            });

            // Create a Blob object from the response
            const blob = new Blob([response.data]);

            // Create a temporary link element
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            // Extract filename from Content-Disposition header
            const contentDisposition = response.headers['content-disposition'];
            let fileName = `${videoData.title}.mp3`; // Default filename if Content-Disposition header is missing or not well-formed

            if (contentDisposition) {
                const matches = contentDisposition.match(/filename\*=UTF-8''([\w%]+\.mp3)/i);
                if (matches && matches.length > 1) {
                    fileName = decodeURIComponent(matches[1]);
                }
            }

            link.download = fileName;

            // Append the link to the body
            document.body.appendChild(link);

            // Trigger the download
            link.click();

            // Clean up
            document.body.removeChild(link);
        } catch (err) {
            console.error(err);
            toast.error("Can't download your .mp3 file");
        }
        setLoading(false);
    };

    return(
        <>
            <form className="w-1/2 min-w-[600px]">
                <div className="flex items-center border-b border-teal-200 py-2 w-full">
                    <input
                        className="appearance-none bg-transparent border-none w-full text-white-100 mr-3 py-1 px-2 leading-tight focus:outline-none"
                        type="text"
                        placeholder="Paste your YouTube URL here"
                        aria-label="URL"
                        onChange={handleInputChange}
                        value={yturl}
                    />
                    <button
                        className="flex-shrink-0 bg-transparent hover:bg-teal-200 border-0 text-m text-Tblue-50 px-5 py-2 rounded" type="button"
                        onClick={getInfo}
                        role='button'
                    >
                        Convert
                    </button>
                </div>
            </form>
            {(videoData && videoData.embedObj) && <div>
                <iframe
                    src={videoData.embedObj.iframeUrl}
                    width={videoData.embedObj.width * 0.5}
                    height={videoData.embedObj.height * 0.5}
                />
                <div className="flex justify-between align-center mt-10">
                    <div>
                        <h2 className='text-2xl font-semibold m-0 max-w-[30ch]'>
                            {videoData.title}
                        </h2>
                        <p>{videoData.artist}</p>
                    </div>
                    <button
                        className='bg-blue-100 text-white-100 px-5 py-0.5 rounded-md hover:bg-blue-50 max-h-[40px]'
                        onClick={download}
                        role='button'
                    >
                        <p className="m-0">{loading ? '...loading' : 'download'}</p>
                    </button>
                </div>
            </div>}
        </>
    );
}
