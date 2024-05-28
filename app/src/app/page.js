import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

import Mode from './pages/Mode';

export default function Home() {
    return (
        <>
            <div className='sticky top-[-100%] left-0 py-2 px-10 bg-teal-200 w-full'>
                <h1 className='font-light font-encodeSans text-[30px] cursor-default'>TAudio.</h1>
            </div>
            <main className="flex min-h-screen flex-col items-center justify-center p-20">
                <div className='flex items-center mt-[50px] mb-[100px] text-gray-500'>
                    <h1>Convert Youtube url to mp3. Always ad-free, always available, always free.</h1>
                </div>
                <Mode />
                <div className='flex items-center mt-[100px] mb-[50px] gap-[30px] text-gray-500'>
                    <p>
                    I don&apos;t like ads, and I believe you don&apos;t either.<br/>
                    It would mean a lot if you could support me on Ko-fi.
                    </p>
                    <a href='https://ko-fi.com/D1D0YBLRS' target='_blank'>
                        <img height='36' style={{ border:'0px', height:'36px' }} src='https://storage.ko-fi.com/cdn/kofi2.png?v=3' border='0' alt='Support me on Ko-fi' />
                    </a>
                </div>
                <p>
                    <span className="text-gray-500">Made by</span>
                    <a href='https://jeremynguyen.dev' className="text-blue-100 hover:text-blue-50" target='_blank'> jeremy nguyen</a>
                </p>
                <p>
                    <span className="text-gray-500">Report issue</span>
                    <a href='mailto:jeremu2907@gmail.com?subject=Mp3%20App%20Report%20Issue' className="text-blue-100 hover:text-blue-50" target='_blank'> here</a>
                </p>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover={false}
                    theme="dark"
                />
            </main>
        </>
    );
}
