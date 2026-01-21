package com.pcelice.backend.controller;

import com.pcelice.backend.entities.Item;
import com.pcelice.backend.entities.Meeting;
import com.pcelice.backend.entities.MeetingItemId;
import com.pcelice.backend.repositories.MeetingRepository;
import com.pcelice.backend.service.MeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@RestController
@RequestMapping("/api/meetings")
public class MeetingController {

    @Autowired
    private MeetingService meetingService;
    @Autowired
    private MeetingRepository meetingRepository;

    @GetMapping
    public List<Meeting> getAllMeetings() {
        return meetingService.findAll();
    }

    @PostMapping("/newMeeting")
    public ResponseEntity<Meeting> createMeeting(@RequestBody Meeting meeting) {
        return ResponseEntity.ok(meetingService.createMeeting(meeting));
    }

    @PostMapping("/{meetingId}/items")
    public ResponseEntity<Meeting> addItem(
            @PathVariable Integer meetingId,
            @RequestBody Item item)
    {
        Meeting meeting = meetingRepository.findByMeetingId(meetingId).orElse(null);

        if (meeting != null) {
            MeetingItemId meetingItemId = new MeetingItemId();
            meetingItemId.setMeetingId(meetingId);
            meetingItemId.setItemNumber(meeting.getItems().getLast().getItemNumber() + 1);
            item.setMeeting(meeting);
            item.setId(meetingItemId);
            meeting.getItems().add(item);
            return ResponseEntity.ok(meeting);
        }
        else  {
            return ResponseEntity.notFound().build();
        }
    }
    @PostMapping("/{id}/publish")
    @PreAuthorize("hasAnyRole('ADMIN', 'REP')")
        public ResponseEntity<?> publishMeeting(@PathVariable Integer id) {
        try {
          Meeting published = meetingService.publishMeeting(id);
            return ResponseEntity.ok(published);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
}
        @PostMapping("/{id}/archive")
        @PreAuthorize("hasAnyRole('ADMIN', 'REP')")
        public ResponseEntity<?> archiveMeeting(@PathVariable Integer id) {
            try {
                Meeting archived = meetingService.archiveMeeting(id);
                return ResponseEntity.ok(archived);
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }
}
