package com.pcelice.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(
    uniqueConstraints = {
        @UniqueConstraint(
            name = "item_title",
            columnNames = {"meeting_id", "title"}
        )
    }
)
public class Item {
    
    @EmbeddedId
    private MeetingItemId id;

    @ManyToOne(optional = false)
    @MapsId("meetingId")
    @JoinColumn(name = "meeting_id", nullable = false)
    private Meeting meeting;
    
    @NotNull
    private String title;

    @NotNull
    private String summary;

    @NotNull
    private Integer legal;

    private String conclusion;

    @NotNull
    private ItemStatus status;

    public MeetingItemId getId() {
        return id;
    }

    public void setId(MeetingItemId id) {
        this.id = id;
    }

    public Meeting getMeeting() {
        return meeting;
    }

    public void setMeeting(Meeting meeting) {
        this.meeting = meeting;
    }

    public Integer getItemNumber() {
        return itemNumber;
    }

    public void setItemNumber(Integer itemNumber) {
        this.itemNumber = itemNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Integer getLegal() {
        return legal;
    }

    public void setLegal(Integer legal) {
        this.legal = legal;
    }

    public String getConclusion() {
        return conclusion;
    }

    public void setConclusion(String conclusion) {
        this.conclusion = conclusion;
    }

    public ItemStatus getStatus() {
        return status;
    }

    public void setStatus(ItemStatus status) {
        this.status = status;
    }
}
