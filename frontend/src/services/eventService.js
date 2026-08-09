import api from "./api";

const getAllEvents = async (page = 1, limit = 6) => {
  const response = await api.get(
    `/events?page=${page}&limit=${limit}`
  );

  return response.data;
};

export default {
  getAllEvents,
};