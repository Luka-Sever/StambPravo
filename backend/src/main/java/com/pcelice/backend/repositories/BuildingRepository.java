package com.pcelice.backend.repositories;

import com.pcelice.backend.entities.Building;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BuildingRepository extends JpaRepository<Building, Integer> {

    Optional<Building> findByBuildingId(Integer buildingId);

    Optional<Building> findByCityIdAndAddress(Integer cityId, String address);
}
