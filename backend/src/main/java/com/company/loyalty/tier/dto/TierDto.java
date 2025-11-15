package com.company.loyalty.tier.dto;

import com.company.loyalty.common.validation.ValidTierPoints;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ValidTierPoints
public class TierDto {
    private Long id;
    private String name;
    private Long minPoints;
    private Long maxPoints;
    private String benefitsDescription;
    private Integer priority;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

