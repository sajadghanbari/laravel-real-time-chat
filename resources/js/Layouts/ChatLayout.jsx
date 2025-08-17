import { usePage } from "@inertiajs/react";
import Echo from "laravel-echo";
import { useEffect } from "react";


// const { Children } = require("react");

const ChatLayout = ({children}) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const selectedConversations = page.props.selectedConversations
    console.log("conversations",conversations)
    console.log("selectedConversations",selectedConversations)

    useEffect(() => {
        window.Echo.join('online')
            .here((users) => {
                console.log('Users currently online:', users);
            })
            .joining((user) => {
                console.log('User joined:', user);
            })
            .leaving((user) => {
                console.log('User left:', user);
            }).error((error) => {
                console.error('Error joining channel:', error);
            });

    },[])
    return (
        <>
            Chat Layout
            <div>
                {children}
            </div>
        </>
    )
}

export default ChatLayout;