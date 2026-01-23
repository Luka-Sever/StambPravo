package com.pcelice.backend;

import com.pcelice.backend.entities.Building;
import com.pcelice.backend.entities.CoOwner;
import com.pcelice.backend.entities.Meeting;
import com.pcelice.backend.entities.RoleType;
import com.pcelice.backend.repositories.BuildingRepository;
import com.pcelice.backend.repositories.CoOwnerRepository;
import com.pcelice.backend.repositories.MeetingRepository;
import com.pcelice.backend.service.EmailService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class MeetingIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private BuildingRepository buildingRepository;

    @Autowired
    private CoOwnerRepository coOwnerRepository;

    @Autowired
    private MeetingRepository meetingRepository;

    @SpyBean
    private EmailService emailService;

    @AfterEach
    void cleanup() {
        meetingRepository.deleteAll();
        coOwnerRepository.deleteAll();
        buildingRepository.deleteAll();
    }

    @Test
    void createMeeting_assignsBuildingFromAuthenticatedRep() {
        Building b1 = new Building();
        b1.setAddress("Murterska 17");
        b1.setCityId(10000);
        b1 = buildingRepository.save(b1);

        String repEmail = "rep1@test.com";
        String repPass = "password123";
        CoOwner rep = new CoOwner();
        rep.setEmail(repEmail);
        rep.setUsername("rep1");
        rep.setFirstName("Rep");
        rep.setLastName("One");
        rep.setPassword(passwordEncoder.encode(repPass));
        rep.setRole(RoleType.REP);
        rep.setBuilding(b1);
        coOwnerRepository.save(rep);

        Map<String, Object> payload = new HashMap<>();
        payload.put("title", "Sastanak 1");
        payload.put("summary", "Opis");
        payload.put("meetingLocation", "Dvorana");
        payload.put("meetingStartTime", "2026-01-23T07:07:00");
        payload.put("meetingEndTime", "2026-01-23T08:07:00");
        payload.put("status", "Pending");
        payload.put("items", List.of());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> req = new HttpEntity<>(payload, headers);

        ResponseEntity<Meeting> res = restTemplate
                .withBasicAuth(repEmail, repPass)
                .postForEntity(url("/api/meetings/newMeeting"), req, Meeting.class);

        assertThat(res.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(res.getBody()).isNotNull();
        assertThat(res.getBody().getMeetingId()).isNotNull();
        assertThat(res.getBody().getBuilding()).isNotNull();
        assertThat(res.getBody().getBuilding().getBuildingId()).isEqualTo(b1.getBuildingId());
    }

    @Test
    void addItem_firstItemGetsNumber1_andDefaultsAreApplied() {
        Building b1 = new Building();
        b1.setAddress("Test 1");
        b1.setCityId(10000);
        b1 = buildingRepository.save(b1);

        String repEmail = "rep2@test.com";
        String repPass = "password123";
        CoOwner rep = new CoOwner();
        rep.setEmail(repEmail);
        rep.setUsername("rep2");
        rep.setFirstName("Rep");
        rep.setLastName("Two");
        rep.setPassword(passwordEncoder.encode(repPass));
        rep.setRole(RoleType.REP);
        rep.setBuilding(b1);
        coOwnerRepository.save(rep);

        Meeting m = new Meeting();
        m.setTitle("M");
        m.setSummary("S");
        m.setMeetingLocation("L");
        m.setStatus(com.pcelice.backend.entities.MeetingStatus.Pending);
        m.setBuilding(b1);
        m = meetingRepository.save(m);

        Map<String, Object> itemPayload = new HashMap<>();
        itemPayload.put("title", "Tocka 1");
        itemPayload.put("summary", "Opis 1");
        // intentionally omit legal/status so defaults apply

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> req = new HttpEntity<>(itemPayload, headers);

        ResponseEntity<Meeting> res = restTemplate
                .withBasicAuth(repEmail, repPass)
                .postForEntity(url("/api/meetings/" + m.getMeetingId() + "/items"), req, Meeting.class);

        assertThat(res.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(res.getBody()).isNotNull();
        assertThat(res.getBody().getItems()).isNotNull();
        assertThat(res.getBody().getItems()).hasSize(1);
        assertThat(res.getBody().getItems().get(0).getItemNumber()).isEqualTo(1);
        assertThat(res.getBody().getItems().get(0).getLegal()).isEqualTo(0);
        assertThat(res.getBody().getItems().get(0).getStatus()).isEqualTo(com.pcelice.backend.entities.ItemStatus.Pending);
    }

    @Test
    void publishMeeting_sendsEmailsOnlyToSameBuilding() {
        Building b1 = new Building();
        b1.setAddress("B1");
        b1.setCityId(10000);
        b1 = buildingRepository.save(b1);

        Building b2 = new Building();
        b2.setAddress("B2");
        b2.setCityId(10000);
        b2 = buildingRepository.save(b2);

        String repEmail = "rep3@test.com";
        String repPass = "password123";
        CoOwner rep = new CoOwner();
        rep.setEmail(repEmail);
        rep.setUsername("rep3");
        rep.setFirstName("Rep");
        rep.setLastName("Three");
        rep.setPassword(passwordEncoder.encode(repPass));
        rep.setRole(RoleType.REP);
        rep.setBuilding(b1);
        coOwnerRepository.save(rep);

        CoOwner coOwnerSame = new CoOwner();
        coOwnerSame.setEmail("co1@test.com");
        coOwnerSame.setUsername("co1");
        coOwnerSame.setFirstName("Co");
        coOwnerSame.setLastName("One");
        coOwnerSame.setPassword(passwordEncoder.encode("password123"));
        coOwnerSame.setRole(RoleType.CO_OWNER);
        coOwnerSame.setBuilding(b1);
        coOwnerRepository.save(coOwnerSame);

        CoOwner coOwnerOther = new CoOwner();
        coOwnerOther.setEmail("co2@test.com");
        coOwnerOther.setUsername("co2");
        coOwnerOther.setFirstName("Co");
        coOwnerOther.setLastName("Two");
        coOwnerOther.setPassword(passwordEncoder.encode("password123"));
        coOwnerOther.setRole(RoleType.CO_OWNER);
        coOwnerOther.setBuilding(b2);
        coOwnerRepository.save(coOwnerOther);

        Meeting meeting = new Meeting();
        meeting.setTitle("M");
        meeting.setSummary("S");
        meeting.setMeetingLocation("L");
        meeting.setStatus(com.pcelice.backend.entities.MeetingStatus.Pending);
        meeting.setBuilding(b1);
        meeting = meetingRepository.save(meeting);

        ResponseEntity<Meeting> res = restTemplate
                .withBasicAuth(repEmail, repPass)
                .postForEntity(url("/api/meetings/" + meeting.getMeetingId() + "/publish"), new HttpEntity<>(new HashMap<>(), jsonHeaders()), Meeting.class);

        assertThat(res.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(res.getBody()).isNotNull();
        assertThat(res.getBody().getStatus()).isEqualTo(com.pcelice.backend.entities.MeetingStatus.Public);

        verify(emailService, atLeastOnce()).sendMeetingPublishedNotification(eq(repEmail), any(Meeting.class));
        verify(emailService, atLeastOnce()).sendMeetingPublishedNotification(eq("co1@test.com"), any(Meeting.class));
        verify(emailService, never()).sendMeetingPublishedNotification(eq("co2@test.com"), any(Meeting.class));
    }

    @Test
    void archiveMeeting_requiresConclusionsForLegalItems() {
        Building b1 = new Building();
        b1.setAddress("B1");
        b1.setCityId(10000);
        b1 = buildingRepository.save(b1);

        String repEmail = "rep4@test.com";
        String repPass = "password123";
        CoOwner rep = new CoOwner();
        rep.setEmail(repEmail);
        rep.setUsername("rep4");
        rep.setFirstName("Rep");
        rep.setLastName("Four");
        rep.setPassword(passwordEncoder.encode(repPass));
        rep.setRole(RoleType.REP);
        rep.setBuilding(b1);
        coOwnerRepository.save(rep);

        Meeting meeting = new Meeting();
        meeting.setTitle("M");
        meeting.setSummary("S");
        meeting.setMeetingLocation("L");
        meeting.setStatus(com.pcelice.backend.entities.MeetingStatus.Obavljen);
        meeting.setBuilding(b1);
        meeting = meetingRepository.save(meeting);

        // add a legal item without conclusion
        Map<String, Object> itemPayload = new HashMap<>();
        itemPayload.put("title", "Pravna tocka");
        itemPayload.put("summary", "Opis");
        itemPayload.put("legal", 1);
        restTemplate
                .withBasicAuth(repEmail, repPass)
                .postForEntity(url("/api/meetings/" + meeting.getMeetingId() + "/items"), new HttpEntity<>(itemPayload, jsonHeaders()), Meeting.class);

        ResponseEntity<String> archiveFail = restTemplate
                .withBasicAuth(repEmail, repPass)
                .postForEntity(url("/api/meetings/" + meeting.getMeetingId() + "/archive"), new HttpEntity<>(new HashMap<>(), jsonHeaders()), String.class);
        assertThat(archiveFail.getStatusCode().is4xxClientError()).isTrue();

        // add conclusion for item #1
        Map<String, Object> conc = new HashMap<>();
        conc.put("conclusion", "Izglasan");
        ResponseEntity<Meeting> concRes = restTemplate
                .withBasicAuth(repEmail, repPass)
                .postForEntity(url("/api/meetings/" + meeting.getMeetingId() + "/items/1/conclusion"), new HttpEntity<>(conc, jsonHeaders()), Meeting.class);
        assertThat(concRes.getStatusCode().is2xxSuccessful()).isTrue();

        ResponseEntity<Meeting> archiveOk = restTemplate
                .withBasicAuth(repEmail, repPass)
                .postForEntity(url("/api/meetings/" + meeting.getMeetingId() + "/archive"), new HttpEntity<>(new HashMap<>(), jsonHeaders()), Meeting.class);
        assertThat(archiveOk.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(archiveOk.getBody()).isNotNull();
        assertThat(archiveOk.getBody().getStatus()).isEqualTo(com.pcelice.backend.entities.MeetingStatus.Archived);
    }

    private String url(String path) {
        return "http://localhost:" + port + path;
    }

    private HttpHeaders jsonHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }
}

