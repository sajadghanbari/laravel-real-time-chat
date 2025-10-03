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
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

function Home(selectedConversation = null, messages = null) {
    const { messages: messagesProp, selectedConversation: selectedConversationProp } = usePage().props;
    selectedConversation = selectedConversationProp;
    messages = messagesProp;
    const loadMoreIntersect = useRef(null);
    const [localMessages, setLocalMessages] = useState([]);
    const messagesCtrRef = useRef(null);
    const  [noMoreMessages , setNoMoreMessages] = useState(false);
    const [ scrollFromBottom , setScrollFromBottom] = useState(0)
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

    const loadMoreMessages = useCallback(() => {

        if(noMoreMessages){
            return;
        }

        const firstMessage = localMessages[0];
        axios
            .get(route("messages.loadOlder", firstMessage.id))
            .then(({ data }) => {
                if (data.data.length === 0) {
                    setNoMoreMessages(true);
                    return;
                }

                const scrollHeight = messagesCtrRef.current.scrollHeight;
                const scrollTop = messagesCtrRef.current.scrollTop;
                const clientHeight = messagesCtrRef.current.clientHeight;
                const tmpScrollFromBottom = (scrollHeight - scrollTop - clientHeight);
                console.log("tmpScrollFromBottom", tmpScrollFromBottom);
                setScrollFromBottom(tmpScrollFromBottom);

                setLocalMessages((prevMessages) => {
                    return [...data.data.reverse(), ...prevMessages];
                })
            });
    }, [localMessages ,noMoreMessages])

    const messageDeleted = ({ message, prevMessages }) => {
        if (!selectedConversation) return;

        setLocalMessages((prevMessages) =>
            prevMessages.filter((m) => m.id !== message.id)
        );
    };



    const onAttachmentClick = (attachments, index = 0) => {
        setPreviewAttachment({ attachments, index });
        setShowAttachmentPreview(true);
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

        setScrollFromBottom(0);
        setNoMoreMessages(false);
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

useEffect(() => {
    if (messagesCtrRef.current && scrollFromBottom !== null) {
        messagesCtrRef.current.scrollTop =
            messagesCtrRef.current.scrollHeight -
            messagesCtrRef.current.offsetHeight -
            scrollFromBottom;
    }

    if(noMoreMessages){
        return;
    }

    const observer = new IntersectionObserver(
        (entries) =>
            entries.forEach(
                (entry) => entry.isIntersecting && loadMoreMessages()
            ),
        {
            rootMargin: "0px 0px 250px 0px",
        }
    );

    if(loadMoreIntersect.current){
        setTimeout(() => {
            observer.observe(loadMoreIntersect.current);
        },100)
    }

    return () => {
        observer.disconnect();
    }

}, [localMessages])

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
                                <div ref={loadMoreIntersect}></div>
                                {localMessages.map((message) => (
                                    <MessageItem
                                        key={message.id}
                                        message={message}
                                        attachmentClick={onAttachmentClick}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <MessageInput conversation={selectedConversation} />
                </>
            )}
            {previewAttachment.attachments && previewAttachment.attachments.length > 0 && (
                <AttachmentPreviewModal
                    attachments={previewAttachment.attachments}
                    index={previewAttachment.index || 0}
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