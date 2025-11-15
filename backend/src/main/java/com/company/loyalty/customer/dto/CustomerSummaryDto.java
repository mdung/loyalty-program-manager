package com.company.loyalty.customer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerSummaryDto {
    private Long totalPointsEarned;
    private Long totalPointsRedeemed;
    private Long currentPointsBalance;
    private String currentTierName;
    private LocalDateTime lastTransactionDate;
    private Long totalTransactions;
}

