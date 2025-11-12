package com.pcelice.backend.service;

import com.pcelice.backend.entities.CoOwner;

import java.util.Optional;

public interface CoOwnerService {

    CoOwner createCoOwner(CoOwner coOwner);

    Optional<CoOwner> findByUsername(String username);

    public boolean findByEmail(String email);
}
