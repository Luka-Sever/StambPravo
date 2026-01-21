package com.pcelice.backend.service.implementation;

import com.pcelice.backend.entities.Building;
import com.pcelice.backend.entities.CoOwner;
import com.pcelice.backend.entities.Item;
import com.pcelice.backend.entities.Meeting;
import com.pcelice.backend.entities.MeetingItemId;
import com.pcelice.backend.entities.MeetingStatus;
import com.pcelice.backend.repositories.CoOwnerRepository;
import com.pcelice.backend.repositories.MeetingRepository;
import com.pcelice.backend.service.EmailService;
import com.pcelice.backend.service.MeetingService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MeetingServiceJpa implements MeetingService {
        @Override
        @Transactional
        public Meeting archiveMeeting(Integer meetingId) {
            Meeting meeting = meetingRepository.findByMeetingId(meetingId)
               .orElseThrow(() -> new RuntimeException("Meeting not found"));

            meeting.setStatus(MeetingStatus.Archived);
            Meeting savedMeeting = meetingRepository.save(meeting);

            // Slanje emaila svim suvlasnicima zgrade
            Building building = meeting.getBuilding();
            if (building != null) {
                List<CoOwner> buildingCoOwners = coOwnerRepository.findByBuilding_BuildingId(building.getBuildingId());
                System.out.println("Sending archive emails to " + buildingCoOwners.size() + " co-owners in building " + building.getBuildingId());
                for (CoOwner coOwner : buildingCoOwners) {
                    emailService.sendMeetingPublishedNotification(coOwner.getEmail(), savedMeeting); // možeš napraviti posebnu metodu za arhivu
                }
            }
            return savedMeeting;
        }
    @Autowired
    private EmailService emailService;

    @Autowired
    private CoOwnerRepository coOwnerRepository;

    @Autowired
    MeetingRepository meetingRepository;

    @Override
    public List<Meeting> findAll() {
        return meetingRepository.findAll();
    }

    @Override
    @Transactional
    public Meeting createMeeting(Meeting meeting) {

        int itemNumber = 1;

        for (Item item : meeting.getItems()) {

            MeetingItemId meetingItemId = new MeetingItemId();
            meetingItemId.setItemNumber(itemNumber++);
            meetingItemId.setMeetingId(meeting.getMeetingId());
            item.setMeeting(meeting);
            item.setId(meetingItemId);
        }

        return meetingRepository.save(meeting);
    }
    @Override
    @Transactional
    public Meeting publishMeeting(Integer meetingId) {
        Meeting meeting = meetingRepository.findByMeetingId(meetingId)
           .orElseThrow(() -> new RuntimeException("Meeting not found"));
    
        meeting.setStatus(MeetingStatus.Public);
        Meeting savedMeeting = meetingRepository.save(meeting);
        
        // Send email only to co-owners in the same building
        Building building = meeting.getBuilding();
        if (building != null) {
            List<CoOwner> buildingCoOwners = coOwnerRepository.findByBuilding_BuildingId(building.getBuildingId());
            System.out.println("Sending emails to " + buildingCoOwners.size() + " co-owners in building " + building.getBuildingId());
        
        for (CoOwner coOwner : buildingCoOwners) {
            emailService.sendMeetingPublishedNotification(coOwner.getEmail(), savedMeeting);
        }
    }
        
        return savedMeeting;
    }
}
