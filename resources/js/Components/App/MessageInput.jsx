import { useState, Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import {
    PaperClipIcon,
    PhotoIcon,
    FaceSmileIcon,
    HandThumbUpIcon,
    PaperAirplaneIcon,
} from "@heroicons/react/24/solid";
import NewMessageInput from "./NewMessageInput";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";


const MessageInput = ({ conversation = null }) => {
    const [newMessage, setNewMessage] = useState("");
    const [chosenFiles, setChosenFiles] = useState(0);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [inputErrorMessage, setInputErrorMessage] = useState("");
    const [messageSending, setMessageSending] = useState(false);
    const onFileChange = (ev) => {
        const files = ev.target.files;

        const updatedFiles = [...files].map((file) => {
            return {
                file: file,
                url: URL.createObjectURL(file),
            }
        });
        setChosenFiles(updatedFiles);
    }
    const onSendClick = () => {
        if (newMessage.trim() === "") {
            setInputErrorMessage("Message cannot be empty");

            setTimeout(() => {
                setInputErrorMessage("");
            }, 3000)
            return;
        }
        const formData = new FormData();
        formData.append("message", newMessage)
        if (conversation.is_user) {
            formData.append("receiver_id", conversation.id)
        } else if (conversation.is_group) {
            formData.append("group_id", conversation);
        }

        setMessageSending(true);
        axios.post(route("message.store"), formData, {
            onUploadProgress: (progressEvent) => {
                console.log("Upload Progress: " + Math.round((progressEvent.loaded / progressEvent.total) * 100) + "%");
            }
        }).then((response) => {
            setNewMessage("");
            setMessageSending(false);
        }).catch((error) => {
            setMessageSending(false);
        });
    }
    const onLikeClick = () => {
        if (messageSending) {
            return;
        }
        const data = {
            message: "👍"
        }
        if (conversation.is_user) {
            data["receiver_id"] = conversation.id
        } else if (conversation.is_group) {
            data["group_id"] = conversation;
        }
        axios.post(route("message.store"), data)
    }

    const sendRequest = (formData) => {
        axios.post(route("message.store"), formData, {
            onUploadProgress: (progressEvent) => {
                console.log("Upload Progress: " + Math.round((progressEvent.loaded / progressEvent.total) * 100) + "%");
            }
        }).then((response) => {
            setNewMessage("");
            setMessageSending(false);
        }).catch((error) => {
            setMessageSending(false);
        });
    }
    return (
        <div className="flex flex-wrap items-start border-t border-slate-700 py-3 ">
            <div className="order-2 flex-1 xs:flex-none xs:order-1 p-2">
                <button className="p-1 text-gray-400 hover:text-gray-300 relative">
                    <PaperClipIcon className="w-6" />
                    <input
                        type="file"
                        multiple
                        className="absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer"
                    />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-300 relative">
                    <PhotoIcon className="w-6" />
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer"
                    />
                </button>
            </div>
            <div className="order-1 px-3 xs:p-0 min-w-[220px] basis-full xs:basis-0 xs:order-2 flex-1 relative">
                <div className="flex">
                    <NewMessageInput
                        value={newMessage}
                        onSend={onSendClick}
                        onChange={(ev) => setNewMessage(ev.target.value)}
                    />
                    <button onClick={onSendClick} className="btn btn-info rounded-1-none">
                        {messageSending && (
                            <span className="loading loading-spinner loading-xs"></span>
                        )}
                        <PaperAirplaneIcon className="w-4" />
                        <span className="hidden sm:inline">Send</span>
                    </button>
                </div>
                {inputErrorMessage && (
                    <p className="text-red-500 text-xs">
                        {inputErrorMessage}
                    </p>
                )}
            </div>

            <div className="order-3 flex xs:order-3 p-2">
                <Popover className="relative">
                    <Popover.Button className="p-1 text-gray-400 hover:text-gray-300 ">
                        <FaceSmileIcon className="w-6 h-6" />
                    </Popover.Button>
                    <Popover.Panel className="absolute z-10 right-0 bottom-full">
                        <EmojiPicker theme="dark" onEmojiClick={ev => setNewMessage(newMessage + ev.emoji)} />
                    </Popover.Panel>
                </Popover>
                <button onClick={onLikeClick} className="p-1 text-gray-400 hover:text-gray-300 ">
                    <HandThumbUpIcon className="w-6 h-6" />
                </button>
            </div>

        </div>
    );
}

export default MessageInput;
