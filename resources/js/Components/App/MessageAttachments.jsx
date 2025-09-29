import { isAudio, isImage, isPDF, isPreViewable, isVideo } from '@/helpers';
import { ArrowDownTrayIcon, BookOpenIcon, PaperClipIcon, PlayCircleIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';
// const [previewAttachment, setPreviewAttachment ] = useState({});

const MessageAttachments = ({ attachments, attachmentClick }) => {
        const [showAttachmentPreview, setShowAttachmentPreview] = useState(true);
    const [previewAttachment, setPreviewAttachment] = useState(null);
        const AttachmentClick = (attachment , index) => {
        setPreviewAttachment({ attachment, index });
        setShowAttachmentPreview(true);
    };

    return (
        <>
            {attachments.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-end">
                    {attachments.map((attachment, index) => (
                        <div
                            onClick={(ev) => AttachmentClick(attachment,index)}
                            key={attachment.id}
                            className={
                                `group flex flex-col items-center text-grey-500 relative cursor-pointer` +
                                    (isAudio(attachment))
                                    ? "w-84"
                                    : "w-32 aspect-square bg-blue-100"
                            }
                        >
                            {!isAudio(attachment) && (
                                <a
                                    href={attachment.url}
                                    className="z-20 opacity-100 group-hover:opacity-100 transition-all w-8 h-8 flex items-center justify-center text-gray-100 bg-gray-700 rounded absolute right-0 top-0 cursor-pointer hover:bg-gray-800"
                                    download
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <ArrowDownTrayIcon className='w-4 h-4' />
                                </a>
                            )}
                            {isImage(attachment) && (
                                <img
                                    src={attachment.url}
                                    alt=""
                                    className='object-contain aspect-square'
                                />
                            )}
                            {isVideo(attachment) && (

                                <div className="relative flex justify-center items-center">
                                    <PlayCircleIcon className="z-20 absolute w-16 h-16 text-white opacity-70" />

                                    <div className='absolute top-0 left-0 w-full h-full bg-black/50 z-10'>

                                    </div>
                                    <video src={attachment.url}></video>
                                </div>
                            )}
                            {isAudio(attachment) && (
                                <div className='relative flex justify-center'>
                                    <audio
                                        src={attachment.url}
                                        controls
                                    ></audio>
                                </div>
                            )}
                            {isPDF(attachment) && (
                                <a
                                    onClick={(ev) => ev.stopPropagation()}
                                    download
                                    href={attachment.url}
                                    className='flex flex-col justify-center items-center'
                                >
                                    <BookOpenIcon className="w-10 h-10 mb-3" />
                                    <small>{attachment.name}</small>
                                </a>
                            )}
                            {!isPreViewable(attachment) && (
                                <a
                                    onClick={(ev) => ev.stopPropagation()}
                                    download
                                    href={attachment.url}
                                    className='flex flex-col justify-center items-center'
                                >
                                    <PaperClipIcon className="w-10 h-10 mb-3" />
                                    <small>{attachment.name}</small>
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default MessageAttachments;
