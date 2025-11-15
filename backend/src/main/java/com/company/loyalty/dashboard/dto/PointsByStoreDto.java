package com.company.loyalty.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PointsByStoreDto {
    private Long storeId;
    private String storeName;
    private Long pointsIssued;
    private Long pointsRedeemed;
    private Long netPoints;
}

