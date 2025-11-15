package com.company.loyalty.campaign.repository;

import com.company.loyalty.campaign.entity.EarningRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EarningRuleRepository extends JpaRepository<EarningRule, Long> {
    @Query("SELECT r FROM EarningRule r WHERE r.active = true AND " +
           "(:tierId IS NULL OR r.tier.id = :tierId) AND " +
           "(:storeId IS NULL OR r.store.id = :storeId) " +
           "ORDER BY r.tier.priority DESC, r.store.id ASC")
    Optional<EarningRule> findActiveRuleForCustomerAndStore(@Param("tierId") Long tierId, @Param("storeId") Long storeId);

    @Query("SELECT r FROM EarningRule r WHERE r.active = true AND r.tier IS NULL AND r.store IS NULL")
    Optional<EarningRule> findDefaultRule();
}

