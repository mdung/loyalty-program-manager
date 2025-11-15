package com.company.loyalty.dashboard.controller;

import com.company.loyalty.common.dto.ApiResponse;
import com.company.loyalty.dashboard.dto.DashboardOverviewDto;
import com.company.loyalty.dashboard.dto.NewCustomersDto;
import com.company.loyalty.dashboard.dto.PointsByStoreDto;
import com.company.loyalty.dashboard.dto.PointsTrendDto;
import com.company.loyalty.dashboard.dto.TopCustomerDto;
import com.company.loyalty.dashboard.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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

    @GetMapping("/points-by-store")
    public ResponseEntity<ApiResponse<List<PointsByStoreDto>>> getPointsByStore(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate) {
        List<PointsByStoreDto> pointsByStore = dashboardService.getPointsByStore(fromDate, toDate);
        return ResponseEntity.ok(ApiResponse.success(pointsByStore));
    }

    @GetMapping("/new-customers")
    public ResponseEntity<ApiResponse<List<NewCustomersDto>>> getNewCustomers(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate) {
        List<NewCustomersDto> newCustomers = dashboardService.getNewCustomers(fromDate, toDate);
        return ResponseEntity.ok(ApiResponse.success(newCustomers));
    }

    @GetMapping("/points-trend")
    public ResponseEntity<ApiResponse<List<PointsTrendDto>>> getPointsTrend(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate) {
        List<PointsTrendDto> pointsTrend = dashboardService.getPointsTrend(fromDate, toDate);
        return ResponseEntity.ok(ApiResponse.success(pointsTrend));
    }
}

