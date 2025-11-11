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
    private Users usersRep;

    @OneToMany
    private Set<Users> users;

    public Building() {}

    public Building(String name, Users usersRep) {
        Assert.hasText(name, "Name must not be empty");
        Assert.isTrue(name.length()<=20, "Name must not be longer than 20 characters");
        Assert.notNull(usersRep, "coOwner must not be null");
        this.name = name;
        this.usersRep = usersRep;
        this.users = new HashSet<>(List.of(usersRep));
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

    public Users getCoOwnerRep() {
        return usersRep;
    }

    public void setCoOwnerRep(Users usersRep) {
        this.usersRep = usersRep;
    }

    public Set<Users> getCoOwners() {
        return users;
    }

    public void setCoOwners(Set<Users> users) {
        this.users = users;
    }

    @Override
    public String toString() {
        return "Building{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", coOwnerRep=" + usersRep +
                ", coOwners=" + users +
                '}';
    }
}
