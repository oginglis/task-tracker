import axios from 'axios';

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
    return apiClient.get('/tasks')
  },
  deleteTask(id: Number) {
    return apiClient.delete('/tasks/' + id)
  },
  postTask(task: Object) {
    return apiClient.post('/tasks/', task)
  },
  patchTask(id: Number, update: Object) {
    return apiClient.patch('/tasks/' + id, update)
  }
}
