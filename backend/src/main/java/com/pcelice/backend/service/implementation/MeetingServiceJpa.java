package com.pcelice.backend.service.implementation;

import com.pcelice.backend.entities.Item;
import com.pcelice.backend.entities.Meeting;
import com.pcelice.backend.entities.MeetingItemId;
import com.pcelice.backend.repositories.MeetingRepository;
import com.pcelice.backend.service.MeetingService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MeetingServiceJpa implements MeetingService {

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
}
