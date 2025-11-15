package com.company.loyalty.customer.repository;

import com.company.loyalty.customer.entity.Customer;
import com.company.loyalty.dashboard.dto.TopCustomerDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByMembershipCode(String membershipCode);
    boolean existsByMembershipCode(String membershipCode);
    
    @Query("SELECT c FROM Customer c WHERE " +
           "(:name IS NULL OR LOWER(c.fullName) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:phone IS NULL OR c.phone LIKE CONCAT('%', :phone, '%')) AND " +
           "(:tierId IS NULL OR c.currentTier.id = :tierId)")
    Page<Customer> findByFilters(@Param("name") String name, 
                                  @Param("phone") String phone, 
                                  @Param("tierId") Long tierId, 
                                  Pageable pageable);

    @Query("SELECT NEW com.company.loyalty.dashboard.dto.TopCustomerDto(" +
           "c.id, c.fullName, c.membershipCode, " +
           "COALESCE(SUM(CASE WHEN t.type = 'EARN' THEN t.points ELSE 0 END), 0), " +
           "c.currentPointsBalance, " +
           "COALESCE(c.currentTier.name, '')) " +
           "FROM Customer c " +
           "LEFT JOIN com.company.loyalty.transaction.entity.LoyaltyTransaction t ON t.customer.id = c.id " +
           "GROUP BY c.id, c.fullName, c.membershipCode, c.currentPointsBalance, c.currentTier.name " +
           "ORDER BY c.currentPointsBalance DESC")
    List<TopCustomerDto> findTopCustomersByPoints(Pageable pageable);
}

