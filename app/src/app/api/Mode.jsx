'use client';

import { useState } from "react";
import Mp3Converter from "./Mp3Converter";

export default function Mode() {
    const [mode, setMode] = useState(0);

    const handleClick = mode => {
        setMode(mode);
    };

    return(
        <>
            <div class='w-max flex justify-evenly gap-10 border-b border-gray-100 mb-10'>
                <button role='button' onClick={() => handleClick(0)}
                    className={`border-b border-gray-200 py-2 mb-5 ${mode === 0 && 'bg-blue-100'} rounded-lg p-5`}
                >
                    .mp3 conversion
                </button>
                <button role='button'
                    className='border-b border-gray-200 py-2 mb-5'
                >
                    upcoming...
                </button>
                <button role='button'
                    className='border-b border-gray-200 py-2 mb-5'
                >
                    upcoming...
                </button>
            </div>
            {(mode === 0) && <Mp3Converter />}
        </>
    )
}
