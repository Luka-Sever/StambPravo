package com.pcelice.backend.controller;

import com.pcelice.backend.entities.CoOwner;
import com.pcelice.backend.service.CoOwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private CoOwnerService coOwnerService;

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

    @GetMapping("/debug")
    public ResponseEntity<?> debug() {
        return ResponseEntity.ok("Frontend URL: " + frontendUrl);
    }
}
