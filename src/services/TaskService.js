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
  deleteTask(id){
    return apiClient.delete('/tasks/' + id)
  },
  postTask(task){
    return apiClient.post('/tasks/', task)
  },
  patchTask(id, update){
    console.log(update)
    return apiClient.patch('/tasks/' + id, update)
  },
  processAll(array){
    console.log(Promise.all(array))
    return Promise.all(array)
  }
}
