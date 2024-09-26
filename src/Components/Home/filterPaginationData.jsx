import axios from "axios";

export const filterPaginationData = async ({
  create_new_arr = false,
  state,
  data,
  page,
  countRoute,
  data_to_send = {},
  user = undefined,
}) => {
  let obj;

  let headers = {};

  if (user) {
    headers.headers = {
      Authorization: `Bearer ${user}`,
    };
  }

  if (state != null && !create_new_arr) {
    // Merge new data with the existing data
    obj = {
      ...state,
      results: [...state.results, ...data],
      page: page,
    };
  } else {
    try {
      // Initialize state if creating a new array
      const {
        data: { totalDocs },
      } = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + countRoute,
        data_to_send,
        headers
      );
      obj = {
        results: data,
        page: 1,
        totalDocs,
      };
    } catch (err) {
      console.error("Error fetching count:", err);
      obj = {
        results: data,
        page: 1,
        totalDocs: 0, // Default to 0 if there's an error
      };
    }
  }

  return obj;
};
