package com.pcelice.backend.controller;

import com.pcelice.backend.entities.Users;
import org.springframework.context.annotation.Profile;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Profile("security")
@RestController
@RequestMapping("/user")
public class UserController {

    @GetMapping
    public Users getCurrentUser(@AuthenticationPrincipal Users user) {
        return new Users();
    }
}
