package com.pcelice.backend.service;

import com.pcelice.backend.entities.Meeting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Async;

import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    @Autowired(required = false)  // Make it optional
    private JavaMailSender mailSender;

    @Async
    public void sendMeetingPublishedNotification(String toEmail, Meeting meeting) {
        // Check if mail sender is available
        if (mailSender == null) {
            System.out.println("MOCK EMAIL TO: " + toEmail);
            System.out.println("Subject: Novi sastanak objavljen: " + meeting.getTitle());
            System.out.println("Meeting time: " + meeting.getMeetingStartTime());
            System.out.println("---");
            return;
        }
        
        // Real email sending
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Novi sastanak objavljen: " + meeting.getTitle());
            
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");
            String formattedTime = meeting.getMeetingStartTime().format(formatter);
            
            message.setText(
                "Poštovani,\n\n" +
                "Objavljen je novi sastanak:\n\n" +
                "Naslov: " + meeting.getTitle() + "\n" +
                "Vrijeme: " + formattedTime + "\n" +
                "Mjesto: " + meeting.getMeetingLocation() + "\n" +
                "Sažetak: " + meeting.getSummary() + "\n\n" +
                "Molimo potvrdite sudjelovanje u aplikaciji.\n\n" +
                "Lijep pozdrav,\nStanPlan"
            );
            
            mailSender.send(message);
            System.out.println("Email sent successfully to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + toEmail + ": " + e.getMessage());
        }
    }
}