import { isPDF } from '@/helpers';
import { PaperClipIcon } from '@heroicons/react/24/solid';
import React from 'react';

const AttachmentPreview = ({file}) => {
    return (
        <div className="w-full items-center gap-2 py-2 px-3 rounded-md bg-slate-800">
            <div>
            {isPDF(file.file) && <img src="/img/pdf.png" alt="PDF Preview" className="w-8" />}
            {!isPDF(file.file) && (
                <div className="flex justify-center items-center w-10 h-10 bg-gray-700 rounded">
                    <PaperClipIcon className='w-6' />
                </div>
            )}
            </div>
            <div className='flex-1 text-gray-400 text-nowrap text-ellipsis overflow-hidden'>
               <h3 className='font-medium'>{file.file.name}</h3>
                <p className='text-sm'>{(file.file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
        </div>
    );
}

export default AttachmentPreview;
