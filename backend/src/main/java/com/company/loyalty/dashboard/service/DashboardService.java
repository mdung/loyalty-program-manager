package com.company.loyalty.dashboard.service;

import com.company.loyalty.common.enums.TransactionType;
import com.company.loyalty.customer.repository.CustomerRepository;
import com.company.loyalty.dashboard.dto.DashboardOverviewDto;
import com.company.loyalty.dashboard.dto.TopCustomerDto;
import com.company.loyalty.transaction.repository.LoyaltyTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private LoyaltyTransactionRepository transactionRepository;

    public DashboardOverviewDto getOverview() {
        Long totalCustomers = customerRepository.count();
        Long activeCustomers = customerRepository.count(); // You can add logic to determine active customers
        
        Long totalPointsIssued = transactionRepository.sumPointsByType(TransactionType.EARN);
        Long totalPointsRedeemed = transactionRepository.sumPointsByType(TransactionType.REDEEM);
        
        Long outstandingPointsBalance = (totalPointsIssued != null ? totalPointsIssued : 0L) - 
                                       (totalPointsRedeemed != null ? totalPointsRedeemed : 0L);

        return DashboardOverviewDto.builder()
                .totalCustomers(totalCustomers)
                .activeCustomers(activeCustomers)
                .totalPointsIssued(totalPointsIssued != null ? totalPointsIssued : 0L)
                .totalPointsRedeemed(totalPointsRedeemed != null ? totalPointsRedeemed : 0L)
                .outstandingPointsBalance(outstandingPointsBalance)
                .build();
    }

    public List<TopCustomerDto> getTopCustomers(int limit) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(0, limit);
        return customerRepository.findTopCustomersByPoints(pageable);
    }
}

