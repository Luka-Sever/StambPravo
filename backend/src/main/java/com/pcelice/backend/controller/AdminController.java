package com.pcelice.backend.controller;

import com.pcelice.backend.entities.CoOwner;
import com.pcelice.backend.service.BuildingService;
import com.pcelice.backend.service.CoOwnerService;
import com.pcelice.backend.entities.Building;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private CoOwnerService coOwnerService;

    @Autowired
    private BuildingService buildingService;

    @Value("${progi.fronted.url}")
    private String frontendUrl;

    @PostMapping("/user")
    public ResponseEntity<?> createCoOwner(@RequestBody CoOwner coOwner) {
        try {
            if (!coOwnerService.emailPresent(coOwner.getEmail())) {
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
    public ResponseEntity<?> createBuilding(@RequestBody Building buiding) {
        try {
            if(!buildingService.idPresent(buiding.getBuildingId())) {
                Building building = buildingService.createBuilding(buiding);
                return ResponseEntity.ok(building);
            }
            else  {
                return ResponseEntity.badRequest().body("Building already exists");
            }
        }
        catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/debug")
    public ResponseEntity<?> debug() {
        return ResponseEntity.ok("Frontend URL: " + frontendUrl);
    }
}
