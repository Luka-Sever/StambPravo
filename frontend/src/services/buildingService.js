import { post, get } from './httpClient.js';

// Kreiranje nove zgrade
export function createBuilding(buildingData) {
  // buildingData: { address, cityId }
  return post('/api/admin/building', buildingData);
}

// Dodavanje predstavnika zgradi
export function addRepToBuilding( addRepData ) {
  return post('/api/building/addRep', addRepData);
}

// Dohvat svih zgrada
export function getAllBuildings() {
  return get('/api/admin/buildings');
}