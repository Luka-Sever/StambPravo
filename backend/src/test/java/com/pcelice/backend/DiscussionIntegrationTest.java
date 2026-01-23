package com.pcelice.backend;

import com.pcelice.backend.entities.Discussion;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class DiscussionIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void getDisccusionArray() {
        ResponseEntity<Discussion[]> response = restTemplate
                .getForEntity(
                        "/diskusije",
                        Discussion[].class);
        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        Discussion[] discussions = response.getBody();
        assertThat(discussions).isNotNull();
    }
}
