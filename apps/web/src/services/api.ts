import { Thread } from "@repo/db";

export const getAllThreads = async (page: number): Promise<Thread[]> => {
  const response = await fetch(`/api/threads?page=${page}`);
  if (!response.ok) throw new Error("Failed to fetch threads");
  const data = await response.json();
  return data?.data;
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
