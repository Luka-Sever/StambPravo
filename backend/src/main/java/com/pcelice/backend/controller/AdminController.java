package com.pcelice.backend.controller;

import com.pcelice.backend.entities.CoOwner;
import com.pcelice.backend.service.CoOwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8081"}, allowCredentials = "true")
public class AdminController {

    @Autowired
    private CoOwnerService coOwnerService;

    @PostMapping("/user")
    public ResponseEntity<?> createCoOwner(@RequestBody CoOwner coOwner) {
        try {
            CoOwner createdCoOwner = coOwnerService.createCoOwner(coOwner);
            return ResponseEntity.ok(createdCoOwner);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}