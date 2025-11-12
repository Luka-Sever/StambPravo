package com.pcelice.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import org.springframework.util.Assert;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
public class Building {
    @Id
    @GeneratedValue
    private Long id;

    @Column(unique=true, nullable=false)
    @Size(min=1, max=20)
    private String name;

    @OneToOne
    private CoOwner coOwnerRep;

    @OneToMany
    private Set<CoOwner> users;

    public Building() {}

    public Building(String name, CoOwner coOwnerRep) {
        Assert.hasText(name, "Name must not be empty");
        Assert.isTrue(name.length()<=20, "Name must not be longer than 20 characters");
        Assert.notNull(coOwnerRep, "coOwner must not be null");
        this.name = name;
        this.coOwnerRep = coOwnerRep;
        this.users = new HashSet<>(List.of(coOwnerRep));
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public CoOwner getCoOwnerRep() {
        return coOwnerRep;
    }

    public void setCoOwnerRep(CoOwner coOwnerRep) {
        this.coOwnerRep = coOwnerRep;
    }

    public Set<CoOwner> getCoOwners() {
        return users;
    }

    public void setCoOwners(Set<CoOwner> users) {
        this.users = users;
    }

    @Override
    public String toString() {
        return "Building{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", coOwnerRep=" + coOwnerRep +
                ", coOwners=" + users +
                '}';
    }
}
