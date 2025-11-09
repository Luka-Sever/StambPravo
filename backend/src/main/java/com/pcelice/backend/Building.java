package com.pcelice.backend;

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
    private coOwner coOwnerRep;

    @OneToMany
    private Set<coOwner> coOwners;

    public Building() {}

    public Building(String name, coOwner coOwnerRep) {
        Assert.hasText(name, "Name must not be empty");
        Assert.isTrue(name.length()<=20, "Name must not be longer than 20 characters");
        Assert.notNull(coOwnerRep, "coOwner must not be null");
        this.name = name;
        this.coOwnerRep = coOwnerRep;
        this.coOwners = new HashSet<>(List.of(coOwnerRep));
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

    public coOwner getCoOwnerRep() {
        return coOwnerRep;
    }

    public void setCoOwnerRep(coOwner coOwnerRep) {
        this.coOwnerRep = coOwnerRep;
    }

    public Set<coOwner> getCoOwners() {
        return coOwners;
    }

    public void setCoOwners(Set<coOwner> coOwners) {
        this.coOwners = coOwners;
    }

    @Override
    public String toString() {
        return "Building{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", coOwnerRep=" + coOwnerRep +
                ", coOwners=" + coOwners +
                '}';
    }
}
