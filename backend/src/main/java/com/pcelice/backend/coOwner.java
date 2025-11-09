package com.pcelice.backend;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;

@Entity
public class coOwner {

    @Id
    @GeneratedValue
    private Long id;

    private String firstName;
    private String lastName;

    @Column(unique = true, nullable = false)
    @NotNull
    private String email;

    private boolean Rep;

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

    public boolean isRep() {
        return Rep;
    }

    public void setRep(boolean rep) {
        Rep = rep;
    }

    @Override
    public String toString() {
        return "coOwner{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", Rep=" + Rep +
                '}';
    }
}
