package com.pcelice.backend.entities;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "CO_OWNER")
public class CoOwner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer coOwnerId;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String passwd;

    private String firstName;
    private String lastName;

    @Column(unique = true, nullable = false)
    @NotNull
    private String email;

    @Enumerated(EnumType.STRING)
    @NotNull
    private RoleType roleType;

    /// treba biti false u pravoj bazi
    @ManyToOne(optional = true, fetch = FetchType.EAGER)
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
        if (this.attendingMeetings == null) {
            this.attendingMeetings = new HashSet<>();
        }
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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasswd() {
        return passwd;
    }

    public void setPasswd(String password) {
        this.passwd = password;
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
