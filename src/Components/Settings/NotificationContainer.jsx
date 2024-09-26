import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useRecoilState } from "recoil";
import axios from "axios";
import { UserAuthDetails, DarkTheme } from "../Configuration/Atoms";
import { getButtonClass } from "../Common/MiniComponent";

function NotificationCommentField({
    _id,
    blog_author,
    index = undefined,
    replying_to = undefined,
    setIsReplying,
    notificationData,
    notification_id,
}) {
    const [comment, setComment] = useState("");
    const [userAuth] = useRecoilState(UserAuthDetails);
    const [isDarkTheme] = useRecoilState(DarkTheme);

    const user_id = blog_author;
    const {
        fetchedNotification,
        fetchedNotification: { results },
        setFetchedNotification,
    } = notificationData;

    const handleComment = () => {
        if (!comment.length) {
            return toast.error("Write some comment before submitting");
        }

        axios
            .post(
                `${import.meta.env.VITE_SERVER_DOMAIN}/api/comment_Like/add_comment`,
                {
                    _id,
                    blog_author: user_id,
                    comment,
                    replying_to: replying_to,
                    notification_id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${userAuth.access_token}`,
                    },
                }
            )
            .then(({ data }) => {
                results[index].reply = { comment, _id: data._id };
                setFetchedNotification({ ...fetchedNotification, results });
                setIsReplying(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className="w-full p-2">
            <textarea
                autoFocus
                className="w-full min-h-24 rounded bg-transparent border p-1 resize-none outline-none"
                value={comment}
                placeholder="Write a Comment"
                onChange={(e) => setComment(e.target.value)}
            ></textarea>

            <div className="flex gap-2">
                <button
                    className={`${getButtonClass(isDarkTheme)}`}
                    onClick={handleComment}
                >
                    Reply
                </button>
            </div>
            <Toaster />
        </div>
    );
}

export default NotificationCommentField;
