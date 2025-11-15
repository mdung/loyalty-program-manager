package com.company.loyalty.campaign.controller;

import com.company.loyalty.campaign.dto.CampaignDto;
import com.company.loyalty.campaign.service.CampaignService;
import com.company.loyalty.common.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/campaigns")
public class CampaignController {

    @Autowired
    private CampaignService campaignService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CampaignDto>>> getAllCampaigns() {
        List<CampaignDto> campaigns = campaignService.getAllCampaigns();
        return ResponseEntity.ok(ApiResponse.success(campaigns));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CampaignDto>> getCampaignById(@PathVariable Long id) {
        CampaignDto campaign = campaignService.getCampaignById(id);
        return ResponseEntity.ok(ApiResponse.success(campaign));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CampaignDto>> createCampaign(@Valid @RequestBody CampaignDto request) {
        CampaignDto campaign = campaignService.createCampaign(request);
        return ResponseEntity.ok(ApiResponse.success("Campaign created successfully", campaign));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CampaignDto>> updateCampaign(
            @PathVariable Long id,
            @Valid @RequestBody CampaignDto request) {
        CampaignDto campaign = campaignService.updateCampaign(id, request);
        return ResponseEntity.ok(ApiResponse.success("Campaign updated successfully", campaign));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteCampaign(@PathVariable Long id) {
        campaignService.deleteCampaign(id);
        return ResponseEntity.ok(ApiResponse.success("Campaign deleted successfully", null));
    }
}

