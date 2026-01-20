package com.pcelice.backend.service;

import com.pcelice.backend.entities.Building;

public interface BuildingService {

    Building createBuilding(Building building);

    public boolean idPresent(Integer buildingId);
}
