package com.company.loyalty.reward.dto;

import com.company.loyalty.common.enums.RewardType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RewardDto {
    private Long id;
    private String name;
    private String description;
    private Long requiredPoints;
    private RewardType type;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

