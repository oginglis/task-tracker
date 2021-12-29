import axios from 'axios';
import { ListType } from '../types/List'

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

export default {
  getList() {
    return apiClient.get('/lists?_embed=todos')
  },
  deleteList(id: Number) {
    return apiClient.delete('/lists/' + id)
  },
  postList(list: Object) {
    return apiClient.post('/lists/', list)
  },
  patchList(id: Number, update: ListType) {
    return apiClient.patch('/lists/' + id, update)
  }
}


