package com.pcelice.backend;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

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
            coOwner admin = new coOwner();
            admin.setEmail("placeholder@gmail.com");
            admin.setFirstName("Admin");
            admin.setLastName("Adminovic");
            admin.setRole(Role.ADMIN);
            repository.save(admin);


            coOwner user1 = new coOwner();
            user1.setEmail("suvlasnik@example.com");
            user1.setFirstName("Ime");
            user1.setLastName("Prezime");
            user1.setRole(Role.CO_OWNER);
            repository.save(user1);

            coOwner user2 = new coOwner();
            user2.setEmail("predstavnik@example.com");
            user2.setFirstName("Ime");
            user2.setLastName("Prezimepredstavnik");
            user2.setRole(Role.PREDSTAVNIK);
            repository.save(user2);
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



    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(a -> a
                       // .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/", "index.html", "/error", "/webjars/**", "/h2-console/**","api/admin/**").permitAll()
                        .anyRequest().authenticated()
                )
                .csrf(c -> c.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                        .ignoringRequestMatchers("/logout", "/h2-console/**", "/api/admin/**","/admin")
                )
                .headers(h -> h.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable))
                .exceptionHandling(e -> e
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                )
                .oauth2Login(o -> {
                    o.failureHandler((request, response, exception) -> {
                        request.getSession().setAttribute("error", exception.getMessage());
                    });
                })
                .logout(l -> l.logoutSuccessUrl("/")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                        .permitAll()
                );
        return http.build();
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
