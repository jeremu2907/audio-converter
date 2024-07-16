import { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Mp3Converter() {
    const [yturl, setYturl] = useState('');
    const [videoData, setVideoData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadStatus, setLoadStatus] = useState(0);
    const loadingDurationMil = useRef(0);

    const handleInputChange = e => {
        setYturl(e.target.value);
        setVideoData(null);
    };

    const getInfo = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        try {
            if (yturl.trim() === '') {
                toast.info('You gotta paste valid Youtube URL');
                return;
            }

            const start = new Date();
            const response = await axios.get(`/api/info?url=${yturl}`);
            const end = new Date();
            loadingDurationMil.current = end - start;
            console.log(loadingDurationMil.current);
            setVideoData(response.data);
        } catch (err) {
            if (err.response.status === 400) {
                toast.error(err.response.data);
            }
            else {
                toast.error('Something happened in the server');
            }
        }
    };

    const download = async () => {
        console.log(loadingDurationMil.current);
        setLoading(true);

        let fakeLoad;
        try {
            if (yturl.trim() === '') {
                toast.info('You gotta paste valid Youtube URL');
                setLoading(false);
                return;
            }

            let incTimes = 0;
            const DIVISION = 5;
            fakeLoad = setInterval(() => {
                incTimes++;
                if (incTimes < DIVISION) {
                    setLoadStatus(prev => {
                        if (prev > 100 - (100 / DIVISION)) {
                            return 100 - (100 / DIVISION);
                        }
                        return (prev + (100 / DIVISION));
                    });
                }
            }, ((loadingDurationMil.current + 5000) / DIVISION));

            const response = await axios.get(`/api/download?url=${yturl}`, {
                responseType: 'blob',
            });

            setLoadStatus(100);

            toast.success('Success!');

            // Create a blob URL for the downloaded file
            const blobUrl = URL.createObjectURL(response.data);

            // Create a link element
            const link = document.createElement('a');
            link.href = blobUrl;
            const contentDisposition = response.headers['content-disposition'];
            link.download = `${videoData.title}.mp3`;

            if (contentDisposition) {
                const matches = contentDisposition.match(/filename\*=UTF-8''([\w%]+\.mp3)/i);
                if (matches && matches.length > 1) {
                    link.download = decodeURIComponent(matches[1]);
                }
            }

            // Append the link to the body
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            if (err.response.status === 400) {
                toast.error(await err.response.data.text());
            }
            else {
                toast.error('Something happened in the server');
            }
        }

        setLoading(false);
        clearInterval(fakeLoad);
        setTimeout(() => {
            setLoadStatus(0);
        }, 1000);
    };

    return (
        <>
            <form className='w-1/2 min-w-[600px]'>
                <div className='flex items-center border-b border-teal-200 py-2 w-full'>
                    <input
                        className='appearance-none bg-transparent border-none w-full text-white-100 mr-3 py-1 px-2 leading-tight focus:outline-none cursor-text'
                        type='text'
                        placeholder='Paste your Youtube URL here'
                        aria-label='URL'
                        onChange={handleInputChange}
                        value={yturl}
                    />
                    <button
                        className='flex-shrink-0 bg-transparent hover:bg-teal-200 border-0 text-m text-Tblue-50 px-5 py-2 rounded transition-all'
                        type='button'
                        onClick={getInfo}
                        role='button'
                    >
                        Search
                    </button>
                </div>
            </form>

            {(videoData && videoData.embedObj) &&
                <div className='flex flex-col items-center'>
                    <iframe
                        src={videoData.embedObj.iframeUrl}
                        width={videoData.embedObj.width * 0.5}
                        height={videoData.embedObj.height * 0.5}
                    />
                    <div className='flex justify-between align-center mt-10 gap-3 w-full'>
                        <div>
                            <h2 className='text-2xl font-semibold m-0 max-w-[400px]'>
                                {videoData.title}
                            </h2>
                            <p>{videoData.artist}</p>
                        </div>
                        <button
                            className='bg-blue-100 text-white-100 px-5 py-0.5 rounded hover:bg-blue-50 max-h-[40px] transition-all'
                            onClick={download}
                            role='button'
                        >
                            <p className='m-0'>{loading ? '... loading' : 'download'}</p>
                        </button>
                    </div>
                    {loadStatus > 0 &&
                        <div className="w-1/2 min-w-[600px] bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-[20px]">
                            <div className="bg-gradient-to-r from-blue-100 to-teal-10 h-2.5 rounded-full transition-all ease-in-out" style={{ width: `${loadStatus}%` }}></div>
                        </div>
                    }
                </div>
            }
        </>
    );
}
