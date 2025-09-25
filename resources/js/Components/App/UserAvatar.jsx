const UserAvatar = ({ user, online = null, profile = false }) => {
    if (!user) {
        // fallback کلی
        return (
            <div className="chat-image avatar placeholder">
                <div className="bg-primary text-grey-800 rounded-full w-8 h-8 flex items-center justify-center">
                    <span className="text-xs">?</span>
                </div>
            </div>
        );
    }

    let onlineClass =
        online === true ? "online" : online === false ? "offline" : "";

    const sizeClass = profile ? "w-40 h-40" : "w-8 h-8";

    return (
        <>
            {user.avatar_url ? (
                <div className={`chat-image avatar ${onlineClass}`}>
                    <div className={`rounded-full overflow-hidden ${sizeClass}`}>
                        <img src={user.avatar_url} alt={user.name ?? "user"} />
                    </div>
                </div>
            ) : (
                <div className={`chat-image avatar placeholder ${onlineClass}`}>
                    <div className={`bg-primary text-grey-800 rounded-full flex items-center justify-center ${sizeClass}`}>
                        <span className="text-xl">
                            {user?.name?.substring(0, 1) ?? "?"}
                        </span>
                    </div>
                </div>
            )}
        </>
    );
};


export default UserAvatar;