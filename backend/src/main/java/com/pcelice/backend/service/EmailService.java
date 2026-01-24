package com.pcelice.backend.service;

import com.pcelice.backend.entities.Meeting;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    @Value("${MAILTRAP_API_TOKEN}")
    private String apiToken;

    @Value("${MAILTRAP_FROM_EMAIL}")
    private String fromEmail;

    private final OkHttpClient client = new OkHttpClient();

    @Async
    public void sendMeetingPublishedNotification(String toEmail, Meeting meeting) {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");
        String formattedTime = meeting.getMeetingStartTime().format(formatter);

        String bodyText =
                "Poštovani,\n\n" +
                        "Objavljen je novi sastanak:\n\n" +
                        "Naslov: " + meeting.getTitle() + "\n" +
                        "Vrijeme: " + formattedTime + "\n" +
                        "Mjesto: " + meeting.getMeetingLocation() + "\n" +
                        "Sažetak: " + meeting.getSummary() + "\n\n" +
                        "Molimo potvrdite sudjelovanje u aplikaciji.\n\n" +
                        "Lijep pozdrav,\nStanPlan";

        String json = "{"
                + "\"from\": \"" + fromEmail + "\","
                + "\"to\": [\"" + toEmail + "\"],"
                + "\"subject\": \"Novi sastanak objavljen: " + meeting.getTitle() + "\","
                + "\"text\": \"" + bodyText.replace("\n", "\\n") + "\""
                + "}";

        Request request = new Request.Builder()
                .url("https://send.api.mailtrap.io/api/send")
                .post(RequestBody.create(json, MediaType.parse("application/json")))
                .addHeader("Authorization", "Bearer " + apiToken)
                .addHeader("Content-Type", "application/json")
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful()) {
                System.out.println("Email sent successfully to: " + toEmail);
            } else {
                System.err.println("Failed to send email: " + response.code() + " - " + response.body().string());
            }
        } catch (IOException e) {
            System.err.println("Error sending email: " + e.getMessage());
        }
    }
}
