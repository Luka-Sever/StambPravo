package com.pcelice.backend.controller;

import com.pcelice.backend.dto.LoginRequest;
import com.pcelice.backend.entities.CoOwner;
import com.pcelice.backend.repositories.CoOwnerRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CoOwnerRepository coOwnerRepository;

    private final HttpSessionSecurityContextRepository securityContextRepository = 
            new HttpSessionSecurityContextRepository();

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest loginRequest, 
                                                       HttpServletRequest request, 
                                                       HttpServletResponse response) {

        UsernamePasswordAuthenticationToken token = UsernamePasswordAuthenticationToken.unauthenticated(
                loginRequest.getEmail(), loginRequest.getPassword());
        Authentication authentication = authenticationManager.authenticate(token);


        SecurityContext sc = SecurityContextHolder.createEmptyContext();
        sc.setAuthentication(authentication);
        SecurityContextHolder.setContext(sc);


        securityContextRepository.saveContext(sc, request, response);


        Map<String, Object> body = new HashMap<>();
        body.put("email", authentication.getName());
        

        CoOwner user = coOwnerRepository.findByEmail(authentication.getName()).orElse(null);
        if (user != null) {
            body.put("firstName", user.getFirstName());
            body.put("lastName", user.getLastName());
            body.put("role", user.getRole());
        }

        return ResponseEntity.ok(body);
    }
}