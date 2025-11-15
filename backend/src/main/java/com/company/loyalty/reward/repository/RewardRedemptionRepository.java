package com.company.loyalty.reward.repository;

import com.company.loyalty.common.enums.RedemptionStatus;
import com.company.loyalty.reward.entity.RewardRedemption;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface RewardRedemptionRepository extends JpaRepository<RewardRedemption, Long> {
    @Query("SELECT r FROM RewardRedemption r WHERE " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:storeId IS NULL OR r.store.id = :storeId) AND " +
           "(:fromDate IS NULL OR r.redeemedAt >= :fromDate) AND " +
           "(:toDate IS NULL OR r.redeemedAt <= :toDate)")
    Page<RewardRedemption> findByFilters(@Param("status") RedemptionStatus status,
                                         @Param("storeId") Long storeId,
                                         @Param("fromDate") LocalDateTime fromDate,
                                         @Param("toDate") LocalDateTime toDate,
                                         Pageable pageable);
}

