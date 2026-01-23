package com.pcelice.backend.service.implementation;

import com.pcelice.backend.entities.Building;
import com.pcelice.backend.entities.CoOwner;
import com.pcelice.backend.repositories.BuildingRepository;
import com.pcelice.backend.service.BuildingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BuildingServiceJpa implements BuildingService {

    @Autowired
    private BuildingRepository buildingRepository;

    @Override
    public Building createBuilding(Building building) {
        if (buildingRepository.findByBuildingId(building.getBuildingId()).isPresent()
                || buildingRepository.findByCityIdAndAddress(building.getCityId(), building.getAddress()).isPresent()) {
            throw new RuntimeException("Building already exists");
        }
        return buildingRepository.save(building);
    }

    @Override
    public boolean idPresent(Integer buildingId) {
        return buildingRepository.findByBuildingId(buildingId).isPresent();
    }
}
