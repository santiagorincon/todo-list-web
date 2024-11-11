import axios from "axios";
import { TaskItem } from "../models/TaskItem";

let apiUrl = "http://todo-list-api-lb-1456152441.us-east-1.elb.amazonaws.com/api/todos"

export const getTasks = async () => {
    try {
      const response = await axios.get(apiUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  };

  export const getTaskById = async (id: number) => {
    try {
      const response = await axios.get(`${apiUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching task by ID:', error);
      throw error;
    }
  };

  export const createTask = async (task: TaskItem) => {
    try {
      const response = await axios.post(apiUrl, task);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  export const updateTask = async (id: number | null, updatedTask: TaskItem) => {
    try {
      const response = await axios.put(`${apiUrl}/${id}`, updatedTask);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  export const deleteTask = async (id: number | null) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      return id;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };