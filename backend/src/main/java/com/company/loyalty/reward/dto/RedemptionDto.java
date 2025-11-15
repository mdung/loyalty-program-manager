package com.company.loyalty.reward.dto;

import com.company.loyalty.common.enums.RedemptionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RedemptionDto {
    private Long id;
    private Long customerId;
    private String customerName;
    private String membershipCode;
    private Long rewardId;
    private String rewardName;
    private Long pointsUsed;
    private RedemptionStatus status;
    private Long storeId;
    private String storeName;
    private String handledBy;
    private LocalDateTime redeemedAt;
    private LocalDateTime updatedAt;
}

