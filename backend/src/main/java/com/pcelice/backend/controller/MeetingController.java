package com.pcelice.backend.controller;
import com.pcelice.backend.dto.ConclusionRequest;

import com.pcelice.backend.entities.Item;
import com.pcelice.backend.entities.ItemStatus;
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
import java.util.Objects;

@RestController
@RequestMapping("/api/meetings")
public class MeetingController {
    @PostMapping("/{id}/participate")
    public ResponseEntity<?> participateMeeting(@PathVariable Integer id) {
        try {
            Meeting meeting = meetingService.participateMeeting(id);
            return ResponseEntity.ok(meeting);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/delete")
    public ResponseEntity<?> deleteMeeting(@PathVariable Integer id) {
        try {
            meetingService.deleteMeeting(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/finish")
    public ResponseEntity<?> finishMeeting(@PathVariable Integer id) {
        try {
            Meeting meeting = meetingService.finishMeeting(id);
            return ResponseEntity.ok(meeting);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{mId}/items/{itemNum}/conclusion")
    public ResponseEntity<?> updateItemConclusion(@PathVariable Integer mId, @PathVariable Integer itemNum, @RequestBody(required = true) ConclusionRequest conclusionRequest) {
        try {
            Meeting meeting = meetingService.updateItemConclusion(mId, itemNum, conclusionRequest.getConclusion());
            return ResponseEntity.ok(meeting);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

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
            int nextItemNumber = meeting.getItems() == null || meeting.getItems().isEmpty()
                    ? 1
                    : meeting.getItems().stream()
                    .map(Item::getItemNumber)
                    .filter(Objects::nonNull)
                    .max(Integer::compareTo)
                    .orElse(0) + 1;
            meetingItemId.setItemNumber(nextItemNumber);

            // defaults
            if (item.getStatus() == null) item.setStatus(ItemStatus.Pending);
            if (item.getLegal() == null) item.setLegal(0);

            item.setMeeting(meeting);
            item.setId(meetingItemId);
            meeting.getItems().add(item);
            return ResponseEntity.ok(meetingRepository.save(meeting));
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
