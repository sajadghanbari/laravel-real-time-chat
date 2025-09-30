import { useEventBus } from "@/EventBus";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon, LockOpenIcon, ShieldCheckIcon, TrashIcon, UserIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { Fragment } from "react";

function MessageDropDownOptions({ message }) {
    const { emit } = useEventBus();

const onMessageDelete = async () => {
    try {
        const res = await axios.delete(route("messages.destroy", message.id));
        emit('message.deleted', { message, prevMessage: res.data.message });
    } catch (err) {
        console.error(err);
    }
};




    return (
        <div className="absolute right-full top-1/2 text-gray-100 -translate-y-1/2">
            <Menu as='div' className="relative inline-block text-left">
                <div>
                    <Menu.Button className="flex justify-center items-center w-8 h-8 rounded-full hover:bg-black/40">
                        <EllipsisVerticalIcon className="w-5 h-5" />
                    </Menu.Button>
                </div>
                {/* <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                > */}
                    <Menu.Items className="absolute right-0 mt-2 w-17 rounded-md bg-gray-800 shadow-lg z-50">
                        <div className="px-1 py-1 ">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={onMessageDelete}
                                        className={`${active ? "bg-gray-700 text-white" : "text-gray-100"
                                            } group flex rounded-md flex items-center justify-center w-auto px-2 py-2 text-sm`}
                                    >
                                        <TrashIcon className="w-4 h-4 mr-4" />

                                    </button>
                                )}
                            </Menu.Item>
                        </div>

                    </Menu.Items>
                {/* </Transition> */}
            </Menu>
        </div>
    );
};

export default MessageDropDownOptions;