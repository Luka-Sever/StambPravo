package com.pcelice.backend.service.implementation;

import com.pcelice.backend.repositories.CoOwnerRepository;
import com.pcelice.backend.entities.CoOwner;
import com.pcelice.backend.service.CoOwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CoOwnerServiceJpa implements CoOwnerService {

    private void validatePassword(String password) {
        if (password.length() < 8) {
            throw new IllegalArgumentException("Password length should be at least 8 characters");
        }
    }
    private void validateUsername(String username) {
        if (!username.matches("[a-zA-Z0-9_-]+") || username.length() < 5) {
            throw new IllegalArgumentException("username cannot contain symbols and must be at least 5 characters");
        }
    }
    private void validateName(String firstName, String lastName) {
        if (!(firstName.matches("[a-zA-Z]+") && lastName.matches("[a-zA-Z]+"))) {
            throw new IllegalArgumentException("Name and surname cannot contain symbols and numbers");
        }
    }

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CoOwnerRepository coOwnerRepository;

    @Override
    public CoOwner createCoOwner(CoOwner coOwner) {

        validatePassword(coOwner.getPasswd());
        validateUsername(coOwner.getUsername());
        validateName(coOwner.getFirstName(), coOwner.getLastName());

        if (coOwnerRepository.findByEmail(coOwner.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        String hashedPassword = passwordEncoder.encode(coOwner.getPasswd());
        coOwner.setPasswd(hashedPassword);
        return coOwnerRepository.save(coOwner);
    }

    @Override
    public boolean emailPresent(String email) {
        return coOwnerRepository.findByEmail(email).isPresent();
    }

    @Override
    public boolean usernamePresent(String username) {
        return coOwnerRepository.findByUsername(username).isPresent();
    }
}
