import { usePage } from "@inertiajs/react";
import Echo from "laravel-echo";
import { use, useEffect, useState } from "react";
import { PencilSquareIcon } from '@heroicons/react/24/solid'
import TextInput from "@/Components/TextInput";
import ConversationItem from "@/Components/App/ConversationItem";
import { useEventBus } from '@/EventBus';
import GroupModal from "@/Components/App/GroupModal";



// const { Children } = require("react");

const ChatLayout = ({ children }) => {
    const page = usePage();
    const { on } = useEventBus();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    const [localConversations, setLocalConversations] = useState(conversations);
    const [sortedConversations, setSortedConversations] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState({});
    const [showGroupModal , setShowGroupModal] = useState(false);
    const isUserOnline = (userId) => onlineUsers[userId];
    const onSearch = (e) => {
        const search = e.target.value.toLowerCase();
        setLocalConversations(
            conversations.filter((conversation) => {
                return (
                    conversation.name.toLowerCase().includes(search) ||
                    conversation.user.name.toLowerCase().includes(search)
                );
            })
        );
    }

    const messageCreated = (message) => {
        setLocalConversations((oldUsers) => {
            return oldUsers.map((u) => {
                // If the message is for user
                if (
                    message.receiver_id &&
                    !u.is_group &&
                    (u.id == message.sender_id || u.id == message.receiver_id)
                ) {
                    u.last_message = message.message;
                    u.last_message_date = message.created_at;
                    return u;
                }
                // If the message is for group
                if (
                    message.group_id &&
                    u.is_group &&
                    u.id == message.group_id
                ) {
                    u.last_message = message.message;
                    u.last_message_date = message.created_at;
                    return u;
                }
                return u;
            });
        });
    };

const messageDeleted = ({ prevMessage }) => {
    if (!selectedConversation) return;

    if (prevMessage) {
        // اگر پیام قبلی وجود داشت، مثل messageCreated رفتار کن
        messageCreated(prevMessage);
    } else {
        // اگر پیام قبلی وجود نداشت (یعنی آخرین پیام پاک شد)
        setLocalConversations((oldUsers) =>
            oldUsers.map((u) => {
                if (
                    (!u.is_group &&
                        (u.id === selectedConversation.id)) ||
                    (u.is_group && u.id === selectedConversation.id)
                ) {
                    return {
                        ...u,
                        last_message: null,
                        last_message_date: null,
                    };
                }
                return u;
            })
        );
    }
};

    console.log("selectedConversation", selectedConversation)
    useEffect(() => {

        const offCreated = on('message.created', messageCreated);
        const offDeleted = on('message.deleted', messageDeleted);
        const offModalShow = on('GroupModal.show',(group) => {
            setShowGroupModal(true);
        });

        return () => {
            offCreated();
            offDeleted();
            offModalShow();
        }
    }, [selectedConversation])
    useEffect(() => {
        setSortedConversations(
            localConversations.sort((a, b) => {
                if (a.blocked_at && b.blocked_at) {
                    return a.blocked_at > b.blocked_at ? 1 : -1;
                } else if (a.blocked_at) {
                    return 1;
                } else if (b.blocked_at) {
                    return -1;
                }
                if (a.last_message_date && b.last_message_date) {
                    return b.last_message_date.localeCompare(
                        a.last_message_date
                    );
                } else if (a.last_message_date) {
                    return -1;
                } else if (b.last_message_date) {
                    return 1;
                } else {
                    return 0;
                }
            })
        );
    }, [localConversations]);

    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);


    
    useEffect(() => {
        window.Echo.join('online')
            .here((users) => {
                const onlineUserObj = Object.fromEntries(
                    users.map(user => [user.id, user])
                );

                setOnlineUsers(prevOnlineUsers => ({
                    ...prevOnlineUsers, ...onlineUserObj
                }));

            })
            .joining((user) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updatedUsers = { ...prevOnlineUsers };
                    updatedUsers[user.id] = user;
                    return updatedUsers
                });
            })
            .leaving((user) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updatedUsers = { ...prevOnlineUsers };
                    delete updatedUsers[user.id];
                    return updatedUsers;
                });
            }).error((error) => {
                console.error('Error joining channel:', error);
            });

        return () => {
            window.Echo.leave('online');
        };

    }, [])
    return (
        <>
            <div className="flex-1 w-full flex overflow-hidden">
                <div
                    className={`transition-all w-full sm:w-[200px] md:w-[300px] bg-slate-800
                    flex flex-col overflow-hidden ${selectedConversation ? "-ml-[100%] sm:ml-0" : ""}`}
                >
                    <div className="flex items-center justify-between py-2 px-3 text-xl font-medium">
                        <span>Conversations</span>
                        <div className="tooltip tooltip-left" data-tip="Create new Group">
                            <button onClick={ev => setShowGroupModal(true)} className="text-gray-400 hover:text-grey-300">
                                <PencilSquareIcon className="w-4 h-4 inline-block ml-2" />
                                New Group
                            </button>
                        </div>
                    </div>
                    <div className="p-3">
                        <TextInput
                            // onKeyUp = {onSearch}
                            placeholder="Filter users and groups"
                            className="w-full"
                        />
                    </div>
                    <div className="flex-1 overflow-auto">
                        {sortedConversations && sortedConversations.map(conversation => (
                            <ConversationItem
                                key={`${conversation.is_group ? 'group' : 'user'
                                    }-${conversation.id}`}
                                conversation={conversation}
                                online={!!isUserOnline(conversation.id)}
                                selectedConversation={selectedConversation}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex-1 flex flex-col overflow-hidden">
                    {children}
                </div>
            </div>
            <GroupModal 
            show={showGroupModal} 
            onClose={() => setShowGroupModal(false)} />
        </>
    )
}

export default ChatLayout;