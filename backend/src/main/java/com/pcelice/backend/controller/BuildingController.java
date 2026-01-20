package com.pcelice.backend.controller;

import com.pcelice.backend.dto.addRepData;
import com.pcelice.backend.entities.Building;
import com.pcelice.backend.entities.CoOwner;
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

        CoOwner rep = coOwnerRepository.findByEmail(addRepData.getRep().getEmail()).orElseThrow(() -> new UsernameNotFoundException("Username not found"));
        Building building = buildingRepository.findByBuildingId(addRepData.getBuilding().getBuildingId()).orElseThrow(() -> new UsernameNotFoundException("Building not found"));

        if (addRepData.getBuilding().getRep() == null) {
            building.setRep(rep);
        }

        buildingRepository.save(building);
    }
}