package com.pcelice.backend.controller;

import com.pcelice.backend.entities.Meeting;
import com.pcelice.backend.service.MeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/meetings")
public class MeetingController {

    @Autowired
    private MeetingService meetingService;

    @PostMapping("/newMeeting")
    public ResponseEntity<Meeting> createMeeting(@RequestBody Meeting meeting) {
        return ResponseEntity.ok(meetingService.createMeeting(meeting));
    }
}
