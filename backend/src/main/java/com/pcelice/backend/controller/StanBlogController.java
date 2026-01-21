package com.pcelice.backend.controller;

import com.pcelice.backend.entities.Discussion;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@RestController
public class StanBlogController {


    @RequestMapping("/diskusije")
    public List<Object> getDiscussions() {
        String url = "https://progistanblog.azurewebsites.net/api/stanplan/discussions/positive";
        RestTemplate restTemplate = new RestTemplate();

        // TODO: staviti key u .env
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-api-key", "Tajn1KljucZaStanBl0g");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<Discussion[]> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                Discussion[].class
        );

        Discussion[] discussions = response.getBody();

        if (discussions != null) {
            return Arrays.asList(discussions);
        }
        return List.of();
    }
}
