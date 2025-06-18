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
  return response.json();
};

export const deleteUserModel = async (id: string) => {
  const response = await fetch(`/api/models/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete model");
  }
};
