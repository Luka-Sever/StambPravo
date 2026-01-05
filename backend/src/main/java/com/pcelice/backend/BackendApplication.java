package com.pcelice.backend;

import com.pcelice.backend.entities.CoOwner;
import com.pcelice.backend.entities.RoleType;
import com.pcelice.backend.repositories.CoOwnerRepository;
import com.pcelice.backend.service.CoOwnerService;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.Map;

@SpringBootApplication
@RestController
public class BackendApplication {
    @Autowired
    private CoOwnerRepository coOwnerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner demo(CoOwnerRepository repository) {
        //hardcodeani useri za testiranje
        return (args) -> {
            String encodedPassword = passwordEncoder.encode("password123");

            CoOwner admin = new CoOwner();
            admin.setEmail("placeholder@gmail.com");
            admin.setPasswd(encodedPassword);
            admin.setFirstName("Admin");
            admin.setLastName("Adminovic");
            admin.setRole(RoleType.ADMIN);
            repository.save(admin);


            CoOwner coOwner1 = new CoOwner();
            coOwner1.setEmail("suvlasnik@example.com");
            coOwner1.setPasswd(encodedPassword);
            coOwner1.setFirstName("Ime");
            coOwner1.setLastName("Prezime");
            coOwner1.setRole(RoleType.CO_OWNER);
            repository.save(coOwner1);

            CoOwner coOwner2 = new CoOwner();
            coOwner2.setEmail("predstavnik@example.com");
            coOwner2.setPasswd(encodedPassword);
            coOwner2.setFirstName("Ime");
            coOwner2.setLastName("Prezimepredstavnik");
            coOwner2.setRole(RoleType.REP);
            repository.save(coOwner2);
        };
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {  // fix za prihvatit request s frontenda za dodat usera
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") 
                        .allowedOrigins("http://localhost:5173") 
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") 
                        .allowedHeaders("*") 
                        .allowCredentials(true);
            }
        };
    }

    @GetMapping("/error")
    public String error(HttpServletRequest request) {
        String message = (String) request.getSession().getAttribute("error");
        request.getSession().removeAttribute("error");
        return message;
    }

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
