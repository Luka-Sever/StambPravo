package com.pcelice.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.springframework.util.Assert;

@Entity
@Table(
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "identify",
                        columnNames = {"city_id", "address"}
                )
        }
)
public class Building {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer buildingId;

    @OneToOne
    @JoinColumn(name = "rep_id", unique = true)
    private CoOwner rep;

    @Column(nullable = false, name = "postal_code")
    private Integer cityId;

    @NotNull
    private String address;

    public Building() {}

    public Building(CoOwner rep) {
        Assert.notNull(rep, "coOwner must not be null");
        this.rep = rep;
    }

    public Integer getBuildingId() {
        return buildingId;
    }

    public void setBuildingId(Integer buildingId) {
        this.buildingId = buildingId;
    }

    public CoOwner getRep() {
        return rep;
    }

    public void setRep(CoOwner rep) {
        this.rep = rep;
    }

    public Integer getCityId() {
        return cityId;
    }

    public void setCityId(Integer cityId) {
        this.cityId = cityId;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    @Override
    public String toString() {
        return "Building{" +
                "buildingId=" + buildingId +
                ", rep=" + rep +
                ", cityId=" + cityId +
                ", address='" + address + '\'' +
                '}';
    }
}
