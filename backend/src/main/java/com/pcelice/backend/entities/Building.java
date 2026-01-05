package com.pcelice.backend.entities;

import jakarta.persistence.*;
import org.springframework.util.Assert;

@Entity
public class Building {
    @Id
    @GeneratedValue
    private int buildingId;

    @OneToOne
    @JoinColumn(name = "rep_id", unique = true)
    private CoOwner rep;

    public Building() {}

    public Building(CoOwner rep) {
        Assert.notNull(rep, "coOwner must not be null");
        this.rep = rep;
    }

    public int getBuildingId() {
        return buildingId;
    }

    public void setBuildingId(int id) {
        this.buildingId = id;
    }

    public CoOwner getRep() {
        return rep;
    }

    public void setRep(CoOwner coOwnerRep) {
        this.rep = coOwnerRep;
    }

    @Override
    public String toString() {
        return "Building{" +
                "id=" + buildingId +
                ", coOwnerRep=" + rep +
                '}';
    }
}
