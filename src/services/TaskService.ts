import axios from 'axios';
import { TodoType } from '../types/Todo'

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

export default {
  getTasks() {
    return apiClient.get('/todos')
  },
  deleteTask(id: Number) {
    return apiClient.delete('/todos/' + id)
  },
  postTask(task: Object) {
    return apiClient.post('/todos/', task)
  },
  patchTask(id: Number, update: TodoType) {
    return apiClient.patch('/todos/' + id, update)
  }
}



