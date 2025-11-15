package com.company.loyalty.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PointsTrendDto {
    private LocalDate date;
    private Long pointsEarned;
    private Long pointsRedeemed;
}

