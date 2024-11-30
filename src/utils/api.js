// src/api.js

const API_BASE_URL = "http://localhost:5000/api"; // Replace with your backend URL if deployed

export const createUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/user/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return response.json();
};

export const fetchTasks = async () => {
  const response = await fetch(`${API_BASE_URL}/tasks`);
  return response.json();
};

export const completeTask = async (data) => {
  const response = await fetch(`${API_BASE_URL}/tasks/complete`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getLeaderboard = async () => {
  const response = await fetch(`${API_BASE_URL}/leaderboard`);
  return response.json();
};

export const addReferral = async (data) => {
  const response = await fetch(`${API_BASE_URL}/user/add-referral`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};
