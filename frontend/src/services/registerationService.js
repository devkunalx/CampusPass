import api from "./api";

const registerForEvent = async (eventId) => {
  const response = await api.post(`/api/events/${eventId}/register`);
  return response.data;
};

const cancelRegistration = async (eventId) => {
  const response = await api.patch(`/api/events/${eventId}/register`);
  return response.data;
};

const getMyRegistrations = async () => {
  const response = await api.get("/api/students/registrations");
  return response.data;
};

export default {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
};