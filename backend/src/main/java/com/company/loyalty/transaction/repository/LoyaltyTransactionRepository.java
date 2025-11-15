package com.company.loyalty.transaction.repository;

import com.company.loyalty.common.enums.TransactionType;
import com.company.loyalty.transaction.entity.LoyaltyTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LoyaltyTransactionRepository extends JpaRepository<LoyaltyTransaction, Long> {
    Page<LoyaltyTransaction> findByCustomerId(Long customerId, Pageable pageable);
    
    @Query("SELECT t FROM LoyaltyTransaction t WHERE " +
           "(:customerId IS NULL OR t.customer.id = :customerId) AND " +
           "(:storeId IS NULL OR t.store.id = :storeId) AND " +
           "(:type IS NULL OR t.type = :type) AND " +
           "(:fromDate IS NULL OR t.createdAt >= :fromDate) AND " +
           "(:toDate IS NULL OR t.createdAt <= :toDate)")
    Page<LoyaltyTransaction> findByFilters(@Param("customerId") Long customerId,
                                           @Param("storeId") Long storeId,
                                           @Param("type") TransactionType type,
                                           @Param("fromDate") LocalDateTime fromDate,
                                           @Param("toDate") LocalDateTime toDate,
                                           Pageable pageable);

    @Query("SELECT COALESCE(SUM(t.points), 0) FROM LoyaltyTransaction t WHERE t.customer.id = :customerId AND t.type = :type")
    Long sumPointsByCustomerAndType(@Param("customerId") Long customerId, @Param("type") TransactionType type);

    Long countByCustomerId(Long customerId);

    @Query("SELECT MAX(t.createdAt) FROM LoyaltyTransaction t WHERE t.customer.id = :customerId")
    LocalDateTime findLastTransactionDateByCustomerId(@Param("customerId") Long customerId);

    @Query("SELECT COALESCE(SUM(t.points), 0) FROM LoyaltyTransaction t WHERE t.type = :type")
    Long sumPointsByType(@Param("type") TransactionType type);

    @Query("SELECT NEW com.company.loyalty.dashboard.dto.PointsByStoreDto(" +
           "t.store.id, t.store.name, " +
           "COALESCE(SUM(CASE WHEN t.type = 'EARN' THEN t.points ELSE 0 END), 0), " +
           "COALESCE(SUM(CASE WHEN t.type = 'REDEEM' THEN t.points ELSE 0 END), 0), " +
           "COALESCE(SUM(CASE WHEN t.type = 'EARN' THEN t.points ELSE -t.points END), 0)) " +
           "FROM LoyaltyTransaction t " +
           "WHERE (:fromDate IS NULL OR t.createdAt >= :fromDate) AND " +
           "(:toDate IS NULL OR t.createdAt <= :toDate) " +
           "GROUP BY t.store.id, t.store.name")
    List<com.company.loyalty.dashboard.dto.PointsByStoreDto> findPointsByStore(
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate);

    @Query("SELECT NEW com.company.loyalty.dashboard.dto.PointsTrendDto(" +
           "CAST(t.createdAt AS date), " +
           "COALESCE(SUM(CASE WHEN t.type = 'EARN' THEN t.points ELSE 0 END), 0), " +
           "COALESCE(SUM(CASE WHEN t.type = 'REDEEM' THEN t.points ELSE 0 END), 0)) " +
           "FROM LoyaltyTransaction t " +
           "WHERE (:fromDate IS NULL OR t.createdAt >= :fromDate) AND " +
           "(:toDate IS NULL OR t.createdAt <= :toDate) " +
           "GROUP BY CAST(t.createdAt AS date) " +
           "ORDER BY CAST(t.createdAt AS date)")
    List<com.company.loyalty.dashboard.dto.PointsTrendDto> findPointsTrend(
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate);
}

