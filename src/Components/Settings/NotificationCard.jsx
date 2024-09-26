import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getDay } from "../Common/Date";
import NotificationCommentField from "./NotificationCommentField";
import { useRecoilState } from "recoil";
import { UserAuthDetails, DarkTheme } from "../Configuration/Atoms";
import axios from "axios";
import { getButtonClass } from "../Common/MiniComponent";

function NotificationCard({ data, index, notificationstate }) {
    const [isReplying, setIsReplying] = useState(false);
    const [userAuth] = useRecoilState(UserAuthDetails);
    const [isDarkTheme] = useRecoilState(DarkTheme);

    const {
        fetchedNotification,
        fetchedNotification: { results, totalDocs },
        setFetchedNotification,
    } = notificationstate;

    const {
        reply,
        blog: { _id, blog_id, title },
        user: {
            personal_info: { fullname, username, profile_img },
            _id: user_id,
        },
        replied_on_comment,
        comment,
        type,
        createdAt,
        _id: notification_id,
    } = data;

    const handleDelete = (comment_id, type, target) => {
        target.setAttribute("disabled", true);
        axios
            .post(
                `${import.meta.env.VITE_SERVER_DOMAIN}/api/comment_Like/delete_comment`,
                { _id: comment_id },
                {
                    headers: {
                        Authorization: `Bearer ${userAuth.access_token}`,
                    },
                }
            )
            .then(() => {
                if (type === "comment") {
                    results.splice(index, 1);
                } else {
                    delete results[index].reply;
                }

                setFetchedNotification({
                    ...fetchedNotification,
                    results,
                    totalDocs: totalDocs - 1,
                    deleteDocCount: fetchedNotification.deleteDocCount + 1,
                });
                target.removeAttribute("disabled");
            })
            .catch((err) => {
                console.error(err);
                target.removeAttribute("disabled");
            });
    };

    return (
        <div
            className={`p-4 max-w-xl flex flex-col gap-4 shadow-lg rounded-lg ${
                isDarkTheme ? "bg-[#282828] text-white" : "bg-white text-black"
            }`}
        >
            <div className="flex gap-2 w-full items-center">
                <img
                    src={profile_img}
                    className="h-10 w-10 rounded-full object-cover"
                    alt={`${fullname}'s profile`}
                />
                <div className="flex flex-col w-full">
                    <Link
                        to={`/user/${username}`}
                        className="text-md font-semibold truncate w-[80%]"
                    >
                        @{username}
                    </Link>
                    <p className="text-sm">
                        {type === "like" && "liked your post"}
                        {type === "comment" && "commented on your post"}
                        {type === "reply" && "replied to your comment"} on{" "}
                        {getDay(createdAt)}
                    </p>
                </div>
            </div>
            <div>
                <div
                    className={`mt-2 p-3 rounded-lg shadow-lg ${
                        isDarkTheme ? "bg-[#3f3f3f]" : "bg-white"
                    }`}
                >
                    {type === "reply" ? (
                        <div className="max-w-sm overflow-hidden truncate whitespace-nowrap">
                            <p className="mt-2 text-wrap">
                                <span className="underline">Reply :</span> "
                                {replied_on_comment.comment} "
                            </p>
                        </div>
                    ) : (
                        <Link to={`/blog/${blog_id}`} className="underline">
                            {`"${title}"`}
                        </Link>
                    )}

                    {type !== "like" && comment && (
                        <div className="max-w-sm overflow-hidden truncate whitespace-nowrap">
                            <p className="mt-2 text-wrap">
                                <span className="underline">Comment : </span> "
                                {comment.comment} "
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4 mt-3">
                    {type !== "like" && (
                        <div className="flex gap-2">
                            {!reply && (
                                <button
                                    className={getButtonClass(isDarkTheme)}
                                    onClick={() => setIsReplying((prev) => !prev)}
                                >
                                    Reply
                                </button>
                            )}
                            <button
                                className={getButtonClass(isDarkTheme)}
                                onClick={(e) =>
                                    handleDelete(comment._id, "comment", e.target)
                                }
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                {type !== "like" && isReplying && (
                    <NotificationCommentField
                        _id={_id}
                        blog_author={user_id}
                        index={index}
                        replying_to={comment._id}
                        setIsReplying={setIsReplying}
                        notificationData={notificationstate}
                        notification_id={notification_id}
                    />
                )}

                {reply && (
                    <div className="mt-2">
                        <div className="flex gap-2">
                            <img
                                src={userAuth.profile_img}
                                className="h-8 w-8 rounded-full object-cover"
                                alt={`${fullname}'s profile`}
                            />
                            <div>
                                <Link
                                    to={`/user/${userAuth.username}`}
                                    className="text-blue-500 text-sm hover:underline"
                                >
                                    @{userAuth.username}
                                </Link>
                                <p className="text-sm text-gray-600">replied to</p>
                                <Link
                                    to={`/user/${username}`}
                                    className="text-blue-500 text-sm hover:underline"
                                >
                                    @{username}
                                </Link>
                            </div>
                        </div>
                        <div
                            className={`mt-2 p-3 rounded-lg shadow-lg ${
                                isDarkTheme ? "bg-[#3f3f3f]" : "bg-white"
                            }`}
                        >
                            <div className="max-w-sm overflow-hidden truncate whitespace-nowrap">
                                <p className="mt-2 text-wrap">
                                    <span className="underline">Comment : </span> "
                                    {reply.comment} "
                                </p>
                            </div>
                        </div>
                        <button
                            className={`${getButtonClass(isDarkTheme)} mt-2`}
                            onClick={(e) => handleDelete(reply._id, "reply", e.target)}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default NotificationCard;
