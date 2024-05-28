import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function BatchMp3() {
    const [urlList, seturlList] = useState([]);
    const [videoList, setVideoList] = useState([]);
    const [loadStatus, setLoadStatus] = useState(0);
    const AVGDURATIONMS = 600;

    const convertToList = (str) => {
        return str.split('\n');
    };

    const handleChange = e => {
        seturlList([...new Set(convertToList(e.target.value))]);
    };

    const getInfo = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        let fakeLoad;
        try {
            if (urlList.length === 0) {
                toast.info('You gotta paste at least 1 Youtube URL');
                return;
            }

            let incTimes = 0;
            const DIVISION = 3 * urlList.length;
            console.log(DIVISION);
            fakeLoad = setInterval(() => {
                incTimes++;
                if (incTimes < DIVISION) {
                    setLoadStatus(prev => {
                        if (prev > 100) {
                            return 100 - (100 / DIVISION);
                        }
                        return (prev + (100 / DIVISION));
                    });
                }
            }, (AVGDURATIONMS * urlList.length / DIVISION));

            const response = await axios.post(
                '/api/info',
                {
                    data: urlList,
                }
            );

            setLoadStatus(100);
            setVideoList(response.data);
        } catch (err) {
            if (err.response.status === 400) {
                toast.error(err.response.data);
            }
            else {
                toast.error('Something happened in the server');
            }
        }

        clearInterval(fakeLoad);
        setTimeout(() => {
            setLoadStatus(0);
        }, 1000);
    };

    const download = async (videoData, self = true) => {
        try {
            const response = await axios.get(`/api/download?url=${videoData.url}`, {
                responseType: 'blob',
            });

            if (self) {
                toast.success('Success!');
            }

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
            if (err.response?.status === 400) {
                toast.error(await err.response.data.text());
            }
            else {
                toast.error('Something happened in the server');
            }
        }
    };

    const downloadAll = () => {
        for (const video of videoList) {
            download(video, false);
        }
        toast.success('Success!');
    };

    return (
        <>
            <div className='flex flex-col items-center w-1/2 min-w-[600px]'>
                <textarea
                    id='message'
                    rows='7'
                    className='appearance-none bg-transparent w-full text-white-100 py-3 px-2 leading-loose focus:outline-none cursor-text border-teal-200 border-t border-b resize-none'
                    placeholder={'Paste your video URLs here.\nEach URL in a separate line.'}
                    onChange={handleChange}
                >
                </textarea>
                <div className="flex gap-5 mt-5 justify-end w-full">
                    {(videoList.length > 0) && <button
                        className='bg-blue-100 text-white-100 px-5 py-2 rounded hover:bg-blue-50 max-h-[40px] transition-all w-fit'
                        onClick={downloadAll}
                        role='button'
                    >
                        download all
                    </button>}
                    <button
                        className='flex-shrink-0 bg-transparent hover:bg-teal-200 border-0 text-m text-Tblue-50 px-5 py-2 rounded transition-all'
                        type='button'
                        onClick={getInfo}
                        role='button'
                    >
                        Search
                    </button>
                </div>
                {loadStatus > 0 &&
                    <div className="w-1/2 min-w-[600px] bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-[20px]">
                        <div className="bg-gradient-to-r from-blue-100 to-teal-10 h-2.5 rounded-full transition-all ease-in-out" style={{width: `${loadStatus}%`}}></div>
                    </div>
                }
            </div>
            {(videoList.length > 0) &&
                <div className="w-1/2 min-w-[600px] gap-10 flex flex-col mt-5">
                    {videoList.map((videoData, idx) => {
                        return (
                            <div
                                className='w-full flex justify-between items-start border-t-2 border-gray-100 pt-10'
                                key={`batch-video-item${idx}`}
                            >
                                <img
                                    src={videoData.thumbnailURL}
                                    className='w-1/2'
                                    alt='thumbnail'
                                />
                                <div className='flex flex-col justify-start align-start gap-5 ml-[40px] w-1/2'>
                                    <div>
                                        <h2 className='text-2xl font-semibold m-0 max-w-[400px]'>
                                            {videoData.title}
                                        </h2>
                                        <p className='mt-5'>{videoData.artist}</p>
                                    </div>
                                    <button
                                        className='bg-blue-100 text-white-100 px-5 py-0.5 rounded hover:bg-blue-50 max-h-[40px] transition-all w-fit'
                                        onClick={() => download(videoData)}
                                        role='button'
                                    >
                                        download
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            }
        </>
    );
}
