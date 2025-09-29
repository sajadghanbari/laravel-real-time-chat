import { useEventBus } from "@/EventBus";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import UserAvatar from "./UserAvatar";
import { Link } from "@inertiajs/react";

export default function NewMessageNotification() {
    const [toast, setToast] = useState(null);
    const { on } = useEventBus();

    useEffect(() => {
        on("newMessageNotification", ({ message, user, group_id }) => {
            const uuid = uuidv4();

            // فقط آخرین toast رو نگه داریم
            setToast({ message, uuid, user, group_id });

            // بعد از ۳ ثانیه پاک بشه
            setTimeout(() => {
                setToast(null);
            }, 5000);
        });
    }, [on]);

    if (!toast) return null;

    return (
        <div className="toast toast-top toast-center min-w-[280px]">
            <div
                key={toast.uuid}
                className="alert alert-info py-3 px-4 text-gray-800 rounded-md "
            >
                <Link
                    className="flex items-center gap-2"
                    href={
                        toast.group_id
                            ? route("chat.group", toast.group_id)
                            : route("chat.user", toast.user.id)
                    }
                >
                    <UserAvatar user={toast.user} />
                    <span>{toast.message}</span>
                </Link>
            </div>
        </div>
    );
}
