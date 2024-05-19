import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Mode from "./api/Mode";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-20">
            <Mode />
            <p className="mt-5">
                <span className="text-gray-500">Made by</span>
                <a href='https://jeremynguyen.dev' className="text-blue-100 hover:text-blue-50" target='_blank'> jeremy nguyen</a>
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
    );
}
