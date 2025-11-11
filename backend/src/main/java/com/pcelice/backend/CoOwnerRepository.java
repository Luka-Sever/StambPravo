package com.pcelice.backend;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CoOwnerRepository extends JpaRepository<coOwner, Long> {
    Optional<coOwner> findByEmail(String email);
}