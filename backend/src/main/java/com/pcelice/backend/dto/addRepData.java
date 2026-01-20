package com.pcelice.backend.dto;

import com.pcelice.backend.entities.Building;
import com.pcelice.backend.entities.CoOwner;

public class addRepData {

    private CoOwner rep;
    private Building building;

    public CoOwner getRep() {
        return rep;
    }

    public void setRep(CoOwner rep) {
        this.rep = rep;
    }

    public Building getBuilding() {
        return building;
    }

    public void setBuilding(Building building) {
        this.building = building;
    }
}
