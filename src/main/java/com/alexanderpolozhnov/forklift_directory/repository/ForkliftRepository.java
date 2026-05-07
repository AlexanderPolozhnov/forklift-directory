package com.alexanderpolozhnov.forklift_directory.repository;

import com.alexanderpolozhnov.forklift_directory.entity.Forklift;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ForkliftRepository extends JpaRepository<Forklift, Long> {

    @Query("SELECT f FROM Forklift f WHERE (:number IS NULL OR LOWER(f.number) LIKE LOWER(CONCAT('%', :number, '%')))")
    Page<Forklift> findByNumberContainingIgnoreCase(@Param("number") String number, Pageable pageable);

    boolean existsByNumberIgnoreCase(String number);

    boolean existsByNumberIgnoreCaseAndIdNot(String number, Long id);
}
