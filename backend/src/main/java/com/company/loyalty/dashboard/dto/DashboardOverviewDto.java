package com.company.loyalty.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardOverviewDto {
    private Long totalCustomers;
    private Long activeCustomers;
    private Long totalPointsIssued;
    private Long totalPointsRedeemed;
    private Long outstandingPointsBalance;
}

