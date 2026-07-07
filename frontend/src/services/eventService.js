import api from "./api";

const getAllEvents = async () => {
  const response = await api.get("/events");
  return response.data;
};

export default {
  getAllEvents,
};