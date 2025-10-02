import { isAudio, isImage, isPDF, isPreViewable, isVideo } from '@/helpers';
import { ArrowDownTrayIcon, BookOpenIcon, PaperClipIcon, PlayCircleIcon } from '@heroicons/react/24/solid';
import React from 'react';

const MessageAttachments = ({ attachments, attachmentClick }) => {
    if (!attachments || attachments.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 justify-end">
            {attachments.map((attachment, index) => (
                <div
                    key={attachment.id}
                    className="group flex flex-col items-center text-grey-500 relative"
                >
                    {/* دکمه دانلود */}
                    {!isAudio(attachment) && (
                        <a
                            href={attachment.url}
                            download
                            onClick={(e) => e.stopPropagation()} // ✅ جلوگیری از باز شدن preview
                            className="z-20 opacity-100 group-hover:opacity-100 transition-all w-8 h-8 flex items-center justify-center text-gray-100 bg-gray-700 rounded absolute right-0 top-0 cursor-pointer hover:bg-gray-800"
                        >
                            <ArrowDownTrayIcon className="w-4 h-4" />
                        </a>
                    )}

                    {/* ---- Preview بخش ---- */}
                    <div
                        onClick={() => attachmentClick(attachments, index)} // ✅ فقط وقتی روی preview می‌زنیم
                        className={
                            isAudio(attachment)
                                ? "w-84"
                                : "w-32 aspect-square bg-blue-100 flex justify-center items-center overflow-hidden cursor-pointer"
                        }
                    >
                        {isImage(attachment) && (
                            <img
                                src={attachment.url}
                                alt={attachment.name}
                                className="object-contain w-full h-full"
                            />
                        )}

                        {isVideo(attachment) && (
                            <div className="relative flex justify-center items-center w-full h-full">
                                <PlayCircleIcon className="z-20 absolute w-16 h-16 text-white opacity-70" />
                                <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />
                                <video src={attachment.url} className="w-full h-full object-cover"></video>
                            </div>
                        )}

                        {isAudio(attachment) && (
                            <div className="relative flex justify-center w-full">
                                <audio src={attachment.url} controls />
                            </div>
                        )}

                        {isPDF(attachment) && (
                            <div className="flex flex-col justify-center items-center">
                                <BookOpenIcon className="w-10 h-10 mb-3" />
                                <small className="text-center">{attachment.name}</small>
                            </div>
                        )}

                        {!isPreViewable(attachment) && (
                            <div className="flex flex-col justify-center items-center">
                                <PaperClipIcon className="w-10 h-10 mb-3" />
                                <small>{attachment.name}</small>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MessageAttachments;
