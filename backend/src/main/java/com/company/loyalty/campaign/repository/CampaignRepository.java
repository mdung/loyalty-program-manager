package com.company.loyalty.campaign.repository;

import com.company.loyalty.campaign.entity.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    @Query("SELECT c FROM Campaign c WHERE c.active = true AND " +
           "c.startDate <= :date AND c.endDate >= :date AND " +
           "(:tierId IS NULL OR c.conditions LIKE CONCAT('%', :tierId, '%'))")
    List<Campaign> findActiveCampaigns(@Param("date") LocalDate date, @Param("tierId") Long tierId);
}

