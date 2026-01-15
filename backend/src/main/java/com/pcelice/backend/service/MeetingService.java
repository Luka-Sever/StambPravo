package com.pcelice.backend.service;

import com.pcelice.backend.entities.Meeting;

import java.util.List;

public interface MeetingService {
    Meeting createMeeting(Meeting meeting);

    List<Meeting> findAll();
}
