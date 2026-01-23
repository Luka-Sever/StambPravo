package com.pcelice.backend.controller;

import com.pcelice.backend.dto.addRepData;
import com.pcelice.backend.entities.Building;
import com.pcelice.backend.entities.CoOwner;
import com.pcelice.backend.entities.RoleType;
import com.pcelice.backend.repositories.BuildingRepository;
import com.pcelice.backend.repositories.CoOwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/building")
public class BuildingController {

    @Autowired
    private BuildingRepository buildingRepository;
    @Autowired
    private CoOwnerRepository coOwnerRepository;

    @PostMapping("/addRep")
    public void addRep(@RequestBody addRepData addRepData) {

        CoOwner rep = coOwnerRepository.findByEmail(addRepData.getRepEmail()).orElseThrow(() -> new UsernameNotFoundException("Username not found"));
        Building building = buildingRepository.findByBuildingId(addRepData.getBuildingId()).orElseThrow(() -> new UsernameNotFoundException("Building not found"));

        rep.setBuilding(building);

        if (building.getRep() == null) {
            building.setRep(rep);
        } else {
            CoOwner currentRep = building.getRep();
            currentRep.setRole(RoleType.CO_OWNER);
            building.setRep(rep);
            // keep current rep in the building as a regular co-owner
            currentRep.setBuilding(building);
            coOwnerRepository.save(currentRep);
        }
        if (rep.getRole() == RoleType.CO_OWNER) {
            rep.setRole(RoleType.REP);
        }

        coOwnerRepository.save(rep);
        buildingRepository.save(building);
    }
}
