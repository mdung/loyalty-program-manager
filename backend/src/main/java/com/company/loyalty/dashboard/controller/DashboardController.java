package com.company.loyalty.dashboard.controller;

import com.company.loyalty.common.dto.ApiResponse;
import com.company.loyalty.dashboard.dto.DashboardOverviewDto;
import com.company.loyalty.dashboard.dto.TopCustomerDto;
import com.company.loyalty.dashboard.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<DashboardOverviewDto>> getOverview() {
        DashboardOverviewDto overview = dashboardService.getOverview();
        return ResponseEntity.ok(ApiResponse.success(overview));
    }

    @GetMapping("/top-customers")
    public ResponseEntity<ApiResponse<List<TopCustomerDto>>> getTopCustomers(
            @RequestParam(defaultValue = "10") int limit) {
        List<TopCustomerDto> topCustomers = dashboardService.getTopCustomers(limit);
        return ResponseEntity.ok(ApiResponse.success(topCustomers));
    }
}

