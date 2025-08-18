import { UsersIcon } from "@heroicons/react/24/solid";

const GroupAvatar = ({ }) => {
    return (
        <>
            <div className={`avatar placeholder`}>
                <div className={`bg-grey-400 text-grey-800 rounded-full w-8`}>
                    <span className="text-xl">
                        <UsersIcon className="w-4 h-4" />
                    </span>
                </div>

            </div>
        </>
    )
}