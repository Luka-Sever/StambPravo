import { post } from './httpClient.js';

export function createUser(userData) {
  // userData: { email, firstName, lastName, role }
  return post('/api/admin/user', userData);
}