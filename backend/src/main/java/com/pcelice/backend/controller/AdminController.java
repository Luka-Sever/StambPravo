package com.pcelice.backend.controller;

import com.pcelice.backend.CoOwnerRepository;
import com.pcelice.backend.entities.Users;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final CoOwnerRepository coOwnerRepository;

    public AdminController(CoOwnerRepository coOwnerRepository) {
        this.coOwnerRepository = coOwnerRepository;
    }

    @PostMapping("/user") // dodavanje usera
    public ResponseEntity<Users> createUser(@RequestBody Users newUsers) {
        if (coOwnerRepository.findByEmail(newUsers.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().build(); 
        }
        Users savedUsers = coOwnerRepository.save(newUsers);
        return ResponseEntity.ok(savedUsers);
    }
}