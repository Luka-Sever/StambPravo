package com.pcelice.backend.controller;

import com.pcelice.backend.dto.createBuildingData;
import com.pcelice.backend.dto.createCoOwner;
import com.pcelice.backend.entities.CoOwner;
import com.pcelice.backend.repositories.CoOwnerRepository;
import com.pcelice.backend.service.BuildingService;
import com.pcelice.backend.service.CoOwnerService;
import com.pcelice.backend.entities.Building;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.pcelice.backend.repositories.BuildingRepository;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private CoOwnerService coOwnerService;

    @Autowired
    private BuildingService buildingService;
    
    @Autowired
    private BuildingRepository buildingRepository;

    @Value("${progi.fronted.url}")
    private String frontendUrl;
    @Autowired
    private CoOwnerRepository coOwnerRepository;

    @PostMapping("/user")
    public ResponseEntity<?> createCoOwner(@RequestBody createCoOwner coOwnerTemp) {

        CoOwner coOwner = new CoOwner();

        try {
            if (!coOwnerService.emailPresent(coOwnerTemp.getEmail()) && !coOwnerService.usernamePresent(coOwnerTemp.getUsername())) {

                coOwner.setEmail(coOwnerTemp.getEmail());
                coOwner.setUsername(coOwnerTemp.getUsername());
                coOwner.setFirstName(coOwnerTemp.getFirstName());
                coOwner.setLastName(coOwnerTemp.getLastName());
                coOwner.setPassword(coOwnerTemp.getPassword());
                coOwner.setRole(coOwnerTemp.getRole());

                if (coOwnerTemp.getBuildingId() != null) {
                Building building = buildingRepository.findByBuildingId(coOwnerTemp.getBuildingId())
                .orElseThrow(() -> new RuntimeException("Building not found"));

                coOwner.setBuilding(building);

            }
                CoOwner createdCoOwner = coOwnerService.createCoOwner(coOwner);
                return ResponseEntity.ok(createdCoOwner);
            }
            else  {
                return ResponseEntity.badRequest().body("Email already exists");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/building")
    public ResponseEntity<?> createBuilding(@RequestBody createBuildingData createBuildingData)
    {
        try {
            Building building = new Building();
            building.setAddress(createBuildingData.getAddress());
            building.setCityId(createBuildingData.getCityId());

            if (createBuildingData.getRepEmail() != null) {
                building.setRep(coOwnerRepository.findByEmail(createBuildingData.getRepEmail()).orElse(null));
            }

            if(!buildingService.idPresent(building.getBuildingId())) {

                Building newBuilding = buildingService.createBuilding(building);
                return ResponseEntity.ok(newBuilding);
            }
            else  {
                return ResponseEntity.badRequest().body("Building already exists");
            }
        }
        catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/buildings")
    public ResponseEntity<?> getAllBuildings() {
        return ResponseEntity.ok(buildingRepository.findAll());
    }

    @GetMapping("/debug")
    public ResponseEntity<?> debug() {
        return ResponseEntity.ok("Frontend URL: " + frontendUrl);
    }
}
