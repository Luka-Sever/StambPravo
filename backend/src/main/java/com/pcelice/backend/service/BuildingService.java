package com.pcelice.backend.service;

import com.pcelice.backend.entities.Building;
import com.pcelice.backend.entities.CoOwner;
import jakarta.persistence.criteria.CriteriaBuilder;

public interface BuildingService {

    Building createBuilding(Building building);

    public boolean idPresent(Integer buildingId);
}
