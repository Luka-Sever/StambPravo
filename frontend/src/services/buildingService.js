import { post } from './httpClient.js';

// Kreiranje nove zgrade
export function createBuilding(buildingData) {
  // buildingData: { address, cityId }
  return post('/api/admin/building', buildingData);
}

// Dodavanje predstavnika zgradi
export function addRepToBuilding({ buildingId, repEmail }) {
  return post('/api/building/addRep', { buildingId, repEmail });
}
