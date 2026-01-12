package com.pcelice.backend.service;

import com.pcelice.backend.entities.CoOwner;
import com.pcelice.backend.repositories.CoOwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomOidUserService extends OidcUserService {

    @Autowired
    private CoOwnerRepository coOwnerRepository;

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        OidcUser oidcUser = super.loadUser(userRequest);
        
        String email = oidcUser.getAttribute("email");
        
        List<GrantedAuthority> authorities = new ArrayList<>();
        
        if (email != null) {
            CoOwner user = coOwnerRepository.findByEmail(email).orElse(null);
            if (user != null) {
                String roleStr = "ROLE_" + user.getRole().name();
                authorities.add(new SimpleGrantedAuthority(roleStr));
            } else {
                authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
            }
        } else {
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        }
        

        return new DefaultOidcUser(
            authorities,
            oidcUser.getIdToken(),
            oidcUser.getUserInfo()
        );
    }
}