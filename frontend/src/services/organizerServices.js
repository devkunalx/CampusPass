import api from "./api";

const createEvent = async (eventData) => {
  const response = await api.post("/api/events", eventData);
  return response.data;
};

const getMyEvents = async () => {
  const response = await api.get("/api/events/my-events");
  return response.data;
};

const updateEvent = async (id, eventData) => {
  const response = await api.patch(`/api/events/${id}`, eventData);
  return response.data;
};

const deleteEvent = async (id) => {
  await api.delete(`/api/events/${id}`);
};

const getEventById = async (id) => {
  const response = await api.get(`/api/events/${id}`);
  return response.data;
};

export default {
  createEvent,
  getMyEvents,
  updateEvent,
  deleteEvent,
  getEventById,
};