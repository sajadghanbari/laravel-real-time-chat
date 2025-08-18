import { usePage } from "@inertiajs/react";
import Echo from "laravel-echo";
import { use, useEffect, useState } from "react";


// const { Children } = require("react");

const ChatLayout = ({ children }) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const selectedConversations = page.props.selectedConversations
    const [localConversations, setLocalConversations] = useState(conversations);
    const [sortedConversations, setSortedConversations] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState({});
    const isUserOnline = (userId) => onlineUsers[userId];

    console.log("conversations", conversations)
    console.log("selectedConversations", selectedConversations)

    useEffect(() => {
        setSortedConversations(
            localConversations.sort((a, b) => {
                if (a.blocked_at && b.blocked_at) {
                    return a.blocked_at > b.blocked_at ? 1 : -1;
                }else if (a.blocked_at) {
                    return 1;
                }else if (b.blocked_at) {
                    return -1;
                }
                if (a.last_message_date && b.last_message_date) {
                    return b.last_message_date.localeCompare(
                        a.last_message_date
                    );
                }else if (a.last_message_date) {
                    return -1;
                }else if (b.last_message_date) {
                    return 1;
                }else{
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
        
    </>
)
}

export default ChatLayout;