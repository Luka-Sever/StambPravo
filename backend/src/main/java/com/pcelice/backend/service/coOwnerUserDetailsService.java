package com.pcelice.backend.service;

import com.pcelice.backend.entities.CoOwner;
import com.pcelice.backend.entities.RoleType;
import com.pcelice.backend.repositories.CoOwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.*;
import static org.springframework.security.core.authority.AuthorityUtils.commaSeparatedStringToAuthorityList;

@Service
public class coOwnerUserDetailsService implements UserDetailsService {

    @Value("{$progi.admin.password}")

    private String adminPasswordHash;

    @Autowired
    private CoOwnerService coOwnerService;
    @Autowired
    private CoOwnerRepository coOwnerRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return new User(username, adminPasswordHash, authorities(username));
    }

    private List<GrantedAuthority> authorities(String email) {

        if (coOwnerRepository.findByEmail(email).get().getRole().equals(RoleType.ADMIN)) {
            return commaSeparatedStringToAuthorityList("ROLE_ADMIN");
        }
        CoOwner coOwner = coOwnerRepository.findByEmail(email).orElseThrow(
                () -> new UsernameNotFoundException("No user '" + email + "'")
                );
        if (coOwner.getRole().equals(RoleType.REP)) {
            return commaSeparatedStringToAuthorityList("ROLE_REP");
        }
        else
            return commaSeparatedStringToAuthorityList("ROLE_COOWNER");
    }
}