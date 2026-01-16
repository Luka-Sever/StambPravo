package com.pcelice.backend.service;

import com.pcelice.backend.entities.CoOwner;

import java.util.Optional;

public interface CoOwnerService {

    CoOwner createCoOwner(CoOwner coOwner);

    public boolean emailPresent(String email);

    public boolean usernamePresent(String username);

}
