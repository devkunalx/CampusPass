import api from "./api";

const getDashboard = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

const getUsers = async (page = 1, limit = 10) => {
  const response = await api.get(
    `/admin/users?page=${page}&limit=${limit}`
  );

  return response.data;
};

const getEvents = async (page = 1, limit = 6) => {
  const response = await api.get(
    `/admin/events?page=${page}&limit=${limit}`
  );

  return response.data;
};

const deleteEvent = async (eventId) => {
  const response = await api.delete(
    `/admin/events/${eventId}`
  );

  return response.data;
};

export default {
  getDashboard,
  getUsers,
  getEvents,
  deleteEvent,
};