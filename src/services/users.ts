import { BASE_URL } from "../values";
import axios, { AxiosResponse } from "axios";

export interface User {
  id: number;
  name: string;
  gender: "male" | "female";
  email: string;
  status: "active" | "inactive";
}

export interface Post {
  id: number;
  user_id: string;
  title: string;
  body: string
}

interface GetUsersFilters {
  page?: number;
  per_page?: number;
  name?: string;
  email?: string;
  gender?: string;
}

function getUsers<T>(options: GetUsersFilters): Promise<AxiosResponse<T>> {
  return axios.get<T>(`${BASE_URL}/users`, {
    params: { ...options, status: "active" },
  });
}

function getUserPost<T>(userId: number): Promise<AxiosResponse<T>> {
  return axios.get<T>(`${BASE_URL}/users/${userId}/posts`);
}

export { getUsers, getUserPost };
