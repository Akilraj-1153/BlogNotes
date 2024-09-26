import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { UserAuthDetails, DarkTheme } from "../Configuration/Atoms";
import { filterPaginationData } from "../Home/filterPaginationData";
import axios from "axios";
import NotificationContainer from "./NotificationContainer";
import { NotificationButtons } from "../Common/MiniComponent";
import FetchingLoader from "../Common/FetchingLoader";
import PageNotFound from "../Common/PageNotFound";

function Notifications() {
  const [filter, setFilter] = useState("all");
  const [userAuth, setUserAuth] = useRecoilState(UserAuthDetails);
  const [fetchedNotification, setFetchedNotification] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useRecoilState(DarkTheme);

  const filters = ["all", "like", "comment", "reply"];

  const fetchNotification = ({ page, deletedDocCount = 0 }) => {
    axios
      .post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/notification/notifications`,
        { page, filter, deletedDocCount },
        {
          headers: {
            Authorization: `Bearer ${userAuth.access_token}`,
          },
        }
      )
      .then(async ({ data: { notification: data } }) => {
        if (userAuth.new_notification_available) {
          setUserAuth({ ...userAuth, new_notification_available: false });
        }

        const formattedData = await filterPaginationData({
          state: page === 1 ? null : fetchedNotification,
          data,
          page,
          countRoute: "/api/notification/all_notifications_count",
          data_to_send: { filter },
          user: userAuth.access_token,
        });

        setTimeout(() => {
          setFetchedNotification(formattedData);
        }, 1000);
      })
      .catch((err) => console.error(err));
  };

  const handleFilterChange = (filterName) => {
    setFilter(filterName);
    setFetchedNotification(null);
  };

  useEffect(() => {
    if (userAuth.access_token) {
      fetchNotification({ page: 1 });
    }
  }, [filter, userAuth.access_token]);

  return (
    <div>
      <div
        className={`flex gap-3 py-5 sticky top-0 ${
          isDarkTheme ? "bg-[#121212]" : "bg-[#f9fafb]"
        }`}
      >
        {filters.map((filterName, i) => (
          <button
            key={i}
            onClick={() => handleFilterChange(filterName)}
            className={`${NotificationButtons(
              isDarkTheme,
              filter,
              filterName
            )} !w-fit capitalize`}
          >
            {filterName}
          </button>
        ))}
      </div>

      {fetchedNotification === null ? (
        <FetchingLoader des={"Fetching Notification Data"} />
      ) : (
        <>
          {fetchedNotification.results.length ? (
            <NotificationContainer
              notificationstate={{
                fetchedNotification,
                setFetchedNotification,
              }}
              fetchedNotification={fetchedNotification}
              fetchNotification={fetchNotification}
            />
          ) : (
            <PageNotFound
              des="It looks like you don't have any notifications yet. Check back later for updates or new messages!"
              error="No notifications found"
              errorType="NotificationNotFound"
            />
          )}
        </>
      )}
    </div>
  );
}

export default Notifications;
