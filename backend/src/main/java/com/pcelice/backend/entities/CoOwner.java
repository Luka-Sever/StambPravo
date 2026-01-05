package com.pcelice.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
public class CoOwner {

    @Id
    @GeneratedValue
    private Long id;

    private String firstName;
    private String lastName;

    @Column(unique = true, nullable = false)
    @NotNull
    private String email;

    @Column(nullable = true)
    private String password;

    @Column(nullable = true)
    private String username;

    @Enumerated(EnumType.STRING)
    @NotNull
    private RoleType roleType;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "coOwner{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", role=" + roleType +
                '}';
    }
}
