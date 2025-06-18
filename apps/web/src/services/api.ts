import { Thread } from "@repo/db";

export const getAllThreads = async (
  page: number,
  size = 15,
): Promise<Thread[]> => {
  const response = await fetch(`/api/threads?page=${page}&size=${size}`);
  if (!response.ok) throw new Error("Failed to fetch threads");
  const data = await response.json();
  return data?.data;
};

export const getThread = async (threadId: string): Promise<Thread | null> => {
  const response = await fetch(`/api/threads/${threadId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch thread");
  }
  const data = await response.json();
  return data?.data || null;
};

export const searchThreads = async (query: string): Promise<Thread[]> => {
  const response = await fetch(
    `/api/threads/search?query=${encodeURIComponent(query)}`,
  );
  if (!response.ok) {
    throw new Error("Failed to search threads");
  }
  const data = await response.json();
  return data?.data || [];
};

export const getUserModels = async () => {
  const response = await fetch("/api/models");
  if (!response.ok) {
    throw new Error("Failed to fetch models");
  }
  const data = await response.json();
  return data?.data || [];
};

export const createUserModel = async (model: {
  name: string;
  model: string;
  provider: string;
  key: string;
}) => {
  const response = await fetch("/api/models", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(model),
  });
  if (!response.ok) {
    throw new Error("Failed to create model");
  }
  return response.json();
};

export const deleteUserModel = async (id: string) => {
  const response = await fetch(`/api/models`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
  if (!response.ok) {
    throw new Error("Failed to delete model");
  }
};

export const deleteThread = async (id: string) => {
  const response = await fetch(`/api/threads`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
  if (!response.ok) {
    throw new Error("Failed to delete thread");
  }
  return response.json();
};