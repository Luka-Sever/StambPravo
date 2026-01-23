package com.pcelice.backend.service.implementation;

import com.pcelice.backend.dto.addRepData;
import com.pcelice.backend.entities.Building;
import com.pcelice.backend.entities.CoOwner;
import com.pcelice.backend.entities.RoleType;
import com.pcelice.backend.repositories.BuildingRepository;
import com.pcelice.backend.repositories.CoOwnerRepository;
import com.pcelice.backend.service.BuildingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

@Service
public class BuildingServiceJpa implements BuildingService {

    @Autowired
    private CoOwnerRepository coOwnerRepository;

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

    @Override
    @Transactional
    public void addRep(addRepData addRepData) {
        CoOwner rep = coOwnerRepository.findByEmail(addRepData.getRepEmail()).orElseThrow(() -> new UsernameNotFoundException("Username not found"));
        Building building = buildingRepository.findByBuildingId(addRepData.getBuildingId()).orElseThrow(() -> new UsernameNotFoundException("Building not found"));

        if (building.getRep()) {
            CoOwner currentRep = building.getRep();
            currentRep.setRole(RoleType.CO_OWNER);
        }

        if (rep.getRole() != RoleType.REP) {
            rep.setRole(RoleType.REP);
        }

        if (rep.getBuilding() != building) {
            throw new RuntimeException("User isnt member of target building");
        }

        building.setRep(rep);

        buildingRepository.save(building);
    }


}
