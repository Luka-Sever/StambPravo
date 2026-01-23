package com.pcelice.backend.service;

import com.pcelice.backend.entities.Discussion;
import org.springframework.boot.autoconfigure.graphql.GraphQlProperties;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Service
public class StanBlogService {

    private final RestTemplate restTemplate;

    public StanBlogService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Cacheable("stanDiscussions")
    public List<Discussion> getDiscussions() {
        String url = "https://progistanblog.azurewebsites.net/api/stanplan/discussions/positive";

        HttpHeaders headers = new HttpHeaders();
        headers.set("x-api-key", "Tajn1KljucZaStanBl0g");
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<Discussion[]> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, Discussion[].class
        );
        if (response.getBody() != null)
            return Arrays.asList(response.getBody());
        else return List.of();
    }
}
