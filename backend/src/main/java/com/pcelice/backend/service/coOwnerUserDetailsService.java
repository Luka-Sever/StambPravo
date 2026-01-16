package com.pcelice.backend.service;

import com.pcelice.backend.entities.CoOwner;
import com.pcelice.backend.entities.RoleType;
import com.pcelice.backend.repositories.CoOwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.*;
import static org.springframework.security.core.authority.AuthorityUtils.commaSeparatedStringToAuthorityList;

@Service
public class coOwnerUserDetailsService implements UserDetailsService {

   @Autowired
    private CoOwnerRepository coOwnerRepository;

    @Override
    public UserDetails loadUserByUsername(String loginToken) throws UsernameNotFoundException {

        CoOwner user = coOwnerRepository.findByEmail(loginToken)
                .orElse(coOwnerRepository.findByUsername(loginToken)
                .orElseThrow(()
                -> new UsernameNotFoundException("No user with email or username " + loginToken)));

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
        
        if (user.getRole() == RoleType.REP) {
            authorities.add(new SimpleGrantedAuthority("ROLE_CO_OWNER"));
        }
        
        return new User(
                user.getEmail(),
                user.getPassword(), 
                authorities
        );
    }
}