import axios from 'axios';

const baseURL = '/api/agent';

export const fetchChats = async () => (await axios.get(`${baseURL}/chats`)).data;
export const createChat = async ({ domain, message }) => await axios.post(`${baseURL}/chat`, { domain, message });
export const deleteChat = async (domain, id) => await axios.delete(`${baseURL}/chat/${domain}/${id}`);
export const updateChat = async (domain, id, payload) => await axios.put(`${baseURL}/chat/${domain}/${id}`, payload);
