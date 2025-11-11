package com.pcelice.backend;

import com.pcelice.backend.entities.Users;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Collections;
import java.util.Map;

@SpringBootApplication
@RestController
public class BackendApplication {
    @Autowired
    private CoOwnerRepository coOwnerRepository;

    @GetMapping("/user")
    public Map<String, Object> user(@AuthenticationPrincipal OAuth2User principal) {
        return Collections.singletonMap("name", principal.getAttribute("name"));
    }
    @Bean
    public CommandLineRunner demo(CoOwnerRepository repository) {
        //hardcodeani useri za testiranje
        return (args) -> {
            Users admin = new Users();
            admin.setEmail("placeholder@gmail.com");
            admin.setFirstName("Admin");
            admin.setLastName("Adminovic");
            admin.setRole(RoleType.ADMIN);
            repository.save(admin);


            Users users1 = new Users();
            users1.setEmail("suvlasnik@example.com");
            users1.setFirstName("Ime");
            users1.setLastName("Prezime");
            users1.setRole(RoleType.CO_OWNER);
            repository.save(users1);

            Users users2 = new Users();
            users2.setEmail("predstavnik@example.com");
            users2.setFirstName("Ime");
            users2.setLastName("Prezimepredstavnik");
            users2.setRole(RoleType.REP);
            repository.save(users2);
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
