package com.pcelice.backend;

import com.pcelice.backend.entities.CoOwner;
import com.pcelice.backend.entities.RoleType;
import com.pcelice.backend.repositories.CoOwnerRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@RestController
@EnableCaching
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
            admin.setEmail("brunoplese0@gmail.com");
            admin.setUsername("Admin");
            admin.setPassword(encodedPassword);
            admin.setFirstName("Bruno");
            admin.setLastName("Plese");
            admin.setRole(RoleType.ADMIN);
            repository.save(admin);
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
