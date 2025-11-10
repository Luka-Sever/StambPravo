package com.pcelice.backend.controller;

import com.pcelice.backend.CoOwnerRepository;
import com.pcelice.backend.coOwner;
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
    public ResponseEntity<coOwner> createUser(@RequestBody coOwner newUser) {
        if (coOwnerRepository.findByEmail(newUser.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().build(); 
        }
        coOwner savedUser = coOwnerRepository.save(newUser);
        return ResponseEntity.ok(savedUser);
    }
}