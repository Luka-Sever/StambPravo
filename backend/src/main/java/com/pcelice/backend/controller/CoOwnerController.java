package com.pcelice.backend.controller;


import com.pcelice.backend.entities.CoOwner;
import com.pcelice.backend.service.CoOwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequestMapping("/coowner")
public class CoOwnerController {
    @Autowired
    private CoOwnerService coOwnerService;

    @PostMapping("")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<CoOwner> createCoOwner(@RequestBody CoOwner coOwner) {

        if (coOwnerService.findByEmail(coOwner.getEmail()))
            return ResponseEntity.badRequest().build();

        CoOwner saved = coOwnerService.createCoOwner(coOwner);
        return ResponseEntity.created(URI.create("/coowner/" + saved.getId())).body(saved);
    }
}
