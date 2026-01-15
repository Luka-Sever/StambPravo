package com.pcelice.backend.service.implementation;

import com.pcelice.backend.entities.Meeting;
import com.pcelice.backend.repositories.MeetingRepository;
import com.pcelice.backend.service.MeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MeetingServiceJpa implements MeetingService {

    @Autowired
    MeetingRepository meetingRepository;

    @Override
    public Meeting createMeeting(Meeting meeting) {
        return meetingRepository.save(meeting);
    }
}
