package com.pcelice.backend.service.implementation;

import com.pcelice.backend.repositories.CoOwnerRepository;
import com.pcelice.backend.entities.CoOwner;
import com.pcelice.backend.service.CoOwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CoOwnerServiceJpa implements CoOwnerService {

    @Autowired
    private CoOwnerRepository coOwnerRepository;

    @Override
    public CoOwner createCoOwner(CoOwner coOwner) {
        if (coOwnerRepository.findByEmail(coOwner.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }
        return coOwnerRepository.save(coOwner);
    }

    @Override
    public boolean emailPresent(String email) {
        return coOwnerRepository.findByEmail(email).isPresent();
    }
}
