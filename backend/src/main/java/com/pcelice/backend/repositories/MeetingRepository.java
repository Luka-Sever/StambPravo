package com.pcelice.backend.repositories;

import com.pcelice.backend.entities.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {
    Optional<Meeting> findByTitle(String title);
}
