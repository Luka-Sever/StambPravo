package com.pcelice.backend.entities;

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
