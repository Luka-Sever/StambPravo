package com.pcelice.backend.service;

import com.pcelice.backend.entities.Meeting;

import java.util.List;

public interface MeetingService {
        Meeting participateMeeting(Integer meetingId);
        void deleteMeeting(Integer meetingId);
        Meeting finishMeeting(Integer meetingId);
        Meeting updateItemConclusion(Integer meetingId, Integer itemNumber, String conclusion);
    Meeting createMeeting(Meeting meeting);

    List<Meeting> findAll();

    Meeting publishMeeting(Integer meetingId);
    Meeting archiveMeeting(Integer meetingId);
}
