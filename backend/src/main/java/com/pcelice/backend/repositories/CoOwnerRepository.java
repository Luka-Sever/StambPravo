package com.pcelice.backend.repositories;
import com.pcelice.backend.entities.CoOwner;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface CoOwnerRepository extends JpaRepository<CoOwner, Long> {

    Optional<CoOwner> findByEmail(String email);

    Optional<CoOwner> findByUsername(String username);

    Optional<CoOwner> findByCoOwnerId(Integer coOwnerId);

    List<CoOwner> findByBuilding_BuildingId(Integer buildingId);
}