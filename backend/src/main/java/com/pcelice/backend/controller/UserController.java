package com.pcelice.backend.controller;

import com.pcelice.backend.dto.changePasswordData;
import com.pcelice.backend.entities.Building;
import com.pcelice.backend.repositories.BuildingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import com.pcelice.backend.entities.CoOwner;
import com.pcelice.backend.repositories.CoOwnerRepository;
import java.util.Collections;
import java.util.Map;
import java.util.HashMap;

@Profile("security")
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CoOwnerRepository coOwnerRepository;

    @Autowired
    private BuildingRepository buildingRepository;

    @GetMapping
    public Map<String, Object> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return Collections.emptyMap();
        }

        Map<String, Object> response = new HashMap<>();
        Object principal = authentication.getPrincipal();
        String email;

        if (principal instanceof OAuth2User) {
            OAuth2User oauth2User = (OAuth2User) principal;
            email = oauth2User.getAttribute("email");
            response.put("name", oauth2User.getAttribute("name"));
            response.put("email", email);
            response.put("role", oauth2User.getAttribute("role"));
            response.put("username", oauth2User.getAttribute("username"));
            response.put("authType", "google");
        } else if (principal instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) principal;
            email = userDetails.getUsername();
            response.put("email", email);
            response.put("authType", "database");
        } else {
            email = authentication.getName();
            response.put("name", authentication.getName());
        }

        if (email != null) {
            CoOwner user = coOwnerRepository.findByEmail(email).orElse(null);
            if (user != null) {
                response.put("firstName", user.getFirstName());
                response.put("lastName", user.getLastName());
                response.put("email", user.getEmail());
                response.put("username", user.getUsername());
                response.put("role", user.getRole());
                if (user.getBuilding() != null) {
                    response.put("buildingId", user.getBuilding().getBuildingId());
                    response.put("buildingAddress", user.getBuilding().getAddress());
                }
            } else {
                response.put("error", "User not registered in system");
            }
        }
        return response;
    }

    @PostMapping("/change-password")
    public void changePassword(@RequestBody changePasswordData changePasswordData) throws Exception {

        CoOwner coOwner = coOwnerRepository.findByUsername(changePasswordData.getUsername()).orElseThrow(() -> new UsernameNotFoundException("Username not found"));

        if (!passwordEncoder.matches(changePasswordData.getOldPassword(), coOwner.getPasswd())) {
            throw new Exception("Incorrect password");
        }

        coOwner.setPasswd(passwordEncoder.encode(changePasswordData.getNewPassword()));
        coOwnerRepository.save(coOwner);

    }

    @PostMapping("/add-coOwner")
    @PreAuthorize("hasAnyRole('REP', 'ADMIN')")
    public void addCoOwner(@RequestBody String coOwnerEmail, String repEmail) throws Exception {

        CoOwner rep = coOwnerRepository.findByEmail(repEmail).orElseThrow(() -> new Exception("User not found"));

        Building building = buildingRepository.findByBuildingId(rep.getBuilding().getBuildingId()).orElseThrow(() -> new Exception("Building not found"));

        CoOwner coOwner = coOwnerRepository.findByEmail(coOwnerEmail).orElseThrow(() -> new Exception("User not found"));

        coOwner.setBuilding(building);
        coOwnerRepository.save(coOwner);
    }

    @GetMapping("/debug")
    public Authentication debug(Authentication auth) {
        return auth;
    }
}
