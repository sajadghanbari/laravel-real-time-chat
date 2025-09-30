// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AttachmentPreviewModal from '@/Components/App/AttachmentPreviewModal';
import ConversationHeader from '@/Components/App/ConversationHeader';
import MessageInput from '@/Components/App/MessageInput';
import MessageItem from '@/Components/App/MessageItem';
import { useEventBus } from '@/EventBus';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ChatLayout from '@/Layouts/ChatLayout';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

function Home(selectedConversation = null, messages = null) {
    const { messages: messagesProp, selectedConversation: selectedConversationProp } = usePage().props;
    selectedConversation = selectedConversationProp;
    messages = messagesProp;
    const [localMessages, setLocalMessages] = useState([]);
    const messagesCtrRef = useRef(null);
    const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);
    const [previewAttachment, setPreviewAttachment] = useState({});
    const { on } = useEventBus();
    const messageCreated = (message) => {
        if (selectedConversation && selectedConversation.is_group && selectedConversation.id == message.group_id) {
            setLocalMessages((prevMessages) => [...prevMessages, message]);
        } else if (selectedConversation && selectedConversation.is_user && selectedConversation.id == message.sender_id || selectedConversation.id == message.receiver_id) {
            setLocalMessages((prevMessages) => [...prevMessages, message]);
        }
    };

const messageDeleted = ({ message, prevMessage }) => {
    if (!selectedConversation) return;

    setLocalMessages((prevMessages) =>
        prevMessages.filter((m) => m.id !== message.id)
    );
};



    const AttachmentClick = (attachment, index) => {
        setPreviewAttachment({ attachment, index });
        setShowAttachmentPreview(false);
    };

    console.log("selectedConversation", selectedConversation)
    useEffect(() => {
        setTimeout(() => {
            if (messagesCtrRef.current) {
                messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight;
            }
        }, 10);
        const offCreated = on('message.created', messageCreated);
        const offDeleted = on('message.deleted', messageDeleted);


        return () => {
            offCreated();
            offDeleted();
        }
    }, [selectedConversation])

    useEffect(() => {
        if (messages) {
            setLocalMessages(messages.data.reverse());
        }
    }, [messages]);
    useEffect(() => {
        if (localMessages.length > 0 && messagesCtrRef.current) {
            messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight;
        }
    }, [localMessages]);
    console.log("messages", messages)
    return (
        <>
            {!messages && (
                <div className="flex flex-col gap-8 justify-center items-center text-center h-full opacity-35">
                    <div className="text-2xl md:text-4xl p-16 text-slate-200">
                        Please select conversation to see messages
                    </div>
                    <ChatBubbleLeftRightIcon className="w-32 h-32 inline-block" />
                </div>
            )}
            {messages && (
                <>
                    <ConversationHeader
                        selectedConversation={selectedConversation}
                    />

                    <div
                        ref={messagesCtrRef}
                        className="flex-1 overflow-y-auto p-5"
                    >
                        {/* {messages} */}
                        {localMessages.length === 0 && (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-lg text-slate-200">
                                    No messages found
                                </div>
                            </div>
                        )}
                        {localMessages.length > 0 && (
                            <div className='flex-1 flex flex-col '>
                                {localMessages.map((message) => (
                                    <MessageItem
                                        key={message.id}
                                        message={message}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <MessageInput conversation={selectedConversation} />
                </>
            )}
            {previewAttachment.attachment && (
                <AttachmentPreviewModal
                    attachments={previewAttachment.attachments}
                    index={previewAttachment.index}
                    show={showAttachmentPreview}
                    onClose={() => setShowAttachmentPreview(false)}
                />


            )}
        </>
    );
}

Home.layout = (page) => {
    return (
        <AuthenticatedLayout
            user={page.props.auth.user}
        >
            <ChatLayout children={page}></ChatLayout>
        </AuthenticatedLayout>
    )
}

export default Home;