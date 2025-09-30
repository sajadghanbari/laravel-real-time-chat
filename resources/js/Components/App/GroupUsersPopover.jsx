import { Popover, Transition } from "@headlessui/react";
import { UserIcon } from "@heroicons/react/24/solid";
import { Link } from "@inertiajs/react";
import UserAvatar from "./UserAvatar";
import { Fragment } from "react";


export default function GroupUsersPopover({ users = [] }) {
    return (
        <Popover className="relative">
            {({ open }) => (
                <>
                    <Popover.Button
                        className={`
                                ${open ? "text-gray-200" : "text-gray-400"}
                                    hover:text-gray-200
                                `}
                    >
                        <UserIcon className="w-4" />
                    </Popover.Button>
                    <Transition
                        as="div" // به جای Fragment
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                        className="absolute right-0 z-10 mt-3 w-[200px] px-4 sm:px-0"
                    >
                        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                            <div className="bg-gray-800 py-2">
                                {users.map((user) => (
                                    <Link
                                        href={route("chat.user", user.id)}
                                        key={user.id}
                                        className="flex items-center gap-2 py-2 px-3 hover:bg-black/30"
                                    >
                                        <UserAvatar user={user} />
                                        <div className="text-xs">{user.name}</div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </Transition>

                </>
            )}
        </Popover>
    )
};
