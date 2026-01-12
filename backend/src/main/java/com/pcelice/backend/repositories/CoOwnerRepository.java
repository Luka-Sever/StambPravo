package com.pcelice.backend.repositories;
import com.pcelice.backend.entities.CoOwner;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CoOwnerRepository extends JpaRepository<CoOwner, Long> {

    Optional<CoOwner> findByEmail(String email);

    Optional<CoOwner> findByUsername(String username);

}