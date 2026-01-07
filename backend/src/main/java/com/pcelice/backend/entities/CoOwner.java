package com.pcelice.backend.entities;

import java.util.Set;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
//@Table(name = "CO_OWNER")
public class CoOwner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer coOwnerId;

    @Column(nullable = false, unique = true)
    private String passwd;

    private String firstName;
    private String lastName;

    @Column(unique = true, nullable = false)
    @NotNull
    private String email;

    @Enumerated(EnumType.STRING)
    @NotNull
    private RoleType roleType;

    @ManyToOne(optional = false)
    @JoinColumn(name = "building_id", nullable = true)
    private Building building;

    @ManyToMany
    @JoinTable(
        name = "participation",
        joinColumns = @JoinColumn(name = "co_owner_id"),
        inverseJoinColumns = @JoinColumn(name = "meeting_id")
    )
    private Set<Meeting> attendingMeetings;

    public Set<Meeting> getAttendingMeetings() {
        return attendingMeetings;
    }

    public void setAttendingMeetings(Set<Meeting> attendingMeetings) {
        this.attendingMeetings = attendingMeetings;
    }

    public Integer getCoOwnerId() {
        return coOwnerId;
    }

    public void setCoOwnerId(Integer coOwnerId) {
        this.coOwnerId = coOwnerId;
    }

    public String getPasswd() {
        return passwd;
    }

    public void setPasswd(String passwd) {
        this.passwd = passwd;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public RoleType getRole() {
        return roleType;
    }

    public void setRole(RoleType roleType) {
        this.roleType = roleType;
    }

    public Building getBuilding() {
        return building;
    }

    public void setBuilding(Building building) {
        this.building = building;
    }

    @Override
    public String toString() {
        return "coOwner{" +
                "id=" + coOwnerId +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", role=" + roleType +
                '}';
    }
}
