package com.pcelice.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
//@Table(name = "CO_OWNER")
public class CoOwner {

    @Id
    @GeneratedValue
    private int coOwnerId;

    @Column(nullable = false, unique = true)
    private String username;

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
    @JoinColumn(name = "building_id")
    private Building building;

    public int getCoOwnerId() {
        return coOwnerId;
    }

    public void setCoOwnerId(int id) {
        this.coOwnerId = id;
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
