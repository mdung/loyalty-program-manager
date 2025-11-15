package com.company.loyalty.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopCustomerDto {
    private Long customerId;
    private String customerName;
    private String membershipCode;
    private Long totalPointsEarned;
    private Long currentPointsBalance;
    private String tierName;
}

