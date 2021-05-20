import http from "./httpService";

export function getAccounts() {
  return http.get(`/accounts`);
}

export function updateAccount({ _id, username, email, role }) {
  return http.put(`/account/${_id}`, { username, email, role });
}

export function deleteAccount({ _id }) {
  return http.delete(`/account/${_id}`);
}

export function getEventTypes() {
  return http.get(`/eventTypes`);
}

export function updateEventTypes(index, newData) {
  return http.put(`/eventType/${index}`, newData);
}

export function deleteEventTypes(index) {
  return http.delete(`/eventType/${index}`);
}

export function getAdditionalFunction() {
  return http.get(`/model-training`);
}
