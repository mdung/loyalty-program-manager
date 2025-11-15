package com.company.loyalty.campaign.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EarningRuleDto {
    private Long id;
    private String name;
    private Double basePointsPerCurrencyUnit;
    private BigDecimal minAmount;
    private BigDecimal maxAmount;
    private Long storeId;
    private String storeName;
    private Long tierId;
    private String tierName;
    private Long campaignId;
    private String campaignName;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

