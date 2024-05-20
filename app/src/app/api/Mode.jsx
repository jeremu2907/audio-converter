'use client';

import { useState } from 'react';
import Mp3Converter from './Mp3Converter';

export default function Mode() {
    const [mode, setMode] = useState(0);

    const handleClick = (choice) => {
        setMode(choice);
    };

    return (
        <>
            <div className='w-max flex justify-evenly gap-10 border-b-2 border-gray-100 mb-10'>
                <button role='button' onClick={() => handleClick(0)}
                    className={`border-b border-gray-200 py-2 mb-5 ${(mode === 0) && 'bg-blue-100'} rounded-md p-5 transition-all hover:bg-blue-100`}
                >
                    .mp3 conversion
                </button>
                <button role='button'
                    className={`border-b border-gray-200 py-2 mb-5 ${(mode === 1) && 'bg-blue-100'} rounded-md p-5 transition-all hover:bg-blue-100`}
                >
                    more features coming soon ...
                </button>
            </div>
            {(mode === 0) && <Mp3Converter />}
        </>
    );
}
