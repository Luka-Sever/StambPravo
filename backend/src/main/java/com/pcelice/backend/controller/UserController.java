package com.pcelice.backend.controller;

import org.springframework.context.annotation.Profile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;
import java.util.HashMap;


@Profile("security")
@RestController
@RequestMapping("/api/user")
public class UserController {

   @GetMapping
    public Map<String, Object> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return Collections.emptyMap();
        }

        Map<String, Object> response = new HashMap<>();
        Object principal = authentication.getPrincipal();

        if (principal instanceof OAuth2User) {
            OAuth2User oauth2User = (OAuth2User) principal;
            response.put("name", oauth2User.getAttribute("name"));
            response.put("email", oauth2User.getAttribute("email"));
            response.put("authType", "google");
        } else if (principal instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) principal;
            response.put("name", userDetails.getUsername()); 
            response.put("email", userDetails.getUsername());
            response.put("roles", userDetails.getAuthorities());
            response.put("authType", "database");
        } else {
            response.put("name", authentication.getName());
        }

        return response;
    }
}
