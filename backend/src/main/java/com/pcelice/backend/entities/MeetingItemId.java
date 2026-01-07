package com.pcelice.backend.entities;

import java.io.Serializable;

import jakarta.persistence.*;

@Embeddable
public class MeetingItemId implements Serializable {
    
    private Integer meetingId;
    private Integer itemNumber;

    public Integer getMeetingId() {
        return meetingId;
    }
    public void setMeetingId(Integer meetingId) {
        this.meetingId = meetingId;
    }
    public Integer getItemNumber() {
        return itemNumber;
    }
    public void setItemNumber(Integer itemNumber) {
        this.itemNumber = itemNumber;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((meetingId == null) ? 0 : meetingId.hashCode());
        result = prime * result + ((itemNumber == null) ? 0 : itemNumber.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        MeetingItemId other = (MeetingItemId) obj;
        if (meetingId == null) {
            if (other.meetingId != null)
                return false;
        } else if (!meetingId.equals(other.meetingId))
            return false;
        if (itemNumber == null) {
            if (other.itemNumber != null)
                return false;
        } else if (!itemNumber.equals(other.itemNumber))
            return false;
        return true;
    }
}
