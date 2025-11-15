package com.company.loyalty.campaign.service;

import com.company.loyalty.campaign.dto.CampaignDto;
import com.company.loyalty.campaign.entity.Campaign;
import com.company.loyalty.campaign.repository.CampaignRepository;
import com.company.loyalty.common.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CampaignService {

    @Autowired
    private CampaignRepository campaignRepository;

    public List<CampaignDto> getAllCampaigns() {
        return campaignRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public CampaignDto getCampaignById(Long id) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with id: " + id));
        return toDto(campaign);
    }

    @Transactional
    public CampaignDto createCampaign(CampaignDto dto) {
        Campaign campaign = Campaign.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .earningMultiplier(dto.getEarningMultiplier() != null ? dto.getEarningMultiplier() : 1.0)
                .conditions(dto.getConditions())
                .active(dto.getActive() != null ? dto.getActive() : true)
                .build();

        campaign = campaignRepository.save(campaign);
        return toDto(campaign);
    }

    @Transactional
    public CampaignDto updateCampaign(Long id, CampaignDto dto) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with id: " + id));

        campaign.setName(dto.getName());
        campaign.setDescription(dto.getDescription());
        campaign.setStartDate(dto.getStartDate());
        campaign.setEndDate(dto.getEndDate());
        campaign.setEarningMultiplier(dto.getEarningMultiplier());
        campaign.setConditions(dto.getConditions());
        if (dto.getActive() != null) {
            campaign.setActive(dto.getActive());
        }

        campaign = campaignRepository.save(campaign);
        return toDto(campaign);
    }

    @Transactional
    public void deleteCampaign(Long id) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with id: " + id));
        campaign.setActive(false);
        campaignRepository.save(campaign);
    }

    private CampaignDto toDto(Campaign campaign) {
        return CampaignDto.builder()
                .id(campaign.getId())
                .name(campaign.getName())
                .description(campaign.getDescription())
                .startDate(campaign.getStartDate())
                .endDate(campaign.getEndDate())
                .earningMultiplier(campaign.getEarningMultiplier())
                .conditions(campaign.getConditions())
                .active(campaign.getActive())
                .createdAt(campaign.getCreatedAt())
                .updatedAt(campaign.getUpdatedAt())
                .build();
    }
}

