package com.pcelice.backend;
import com.pcelice.backend.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CoOwnerRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByEmail(String email);
}