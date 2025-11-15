package com.company.loyalty.tier.repository;

import com.company.loyalty.tier.entity.Tier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TierRepository extends JpaRepository<Tier, Long> {
    Optional<Tier> findFirstByOrderByPriorityAsc();
    
    @Query("SELECT t FROM Tier t WHERE t.minPoints <= :points AND t.maxPoints >= :points")
    Optional<Tier> findByMinPointsLessThanEqualAndMaxPointsGreaterThanEqual(
            @Param("points") Long points, 
            @Param("points") Long points2);
}

