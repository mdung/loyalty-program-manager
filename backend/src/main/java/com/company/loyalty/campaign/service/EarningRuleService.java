package com.company.loyalty.campaign.service;

import com.company.loyalty.campaign.dto.EarningRuleDto;
import com.company.loyalty.campaign.entity.Campaign;
import com.company.loyalty.campaign.entity.EarningRule;
import com.company.loyalty.campaign.repository.CampaignRepository;
import com.company.loyalty.campaign.repository.EarningRuleRepository;
import com.company.loyalty.common.exception.ResourceNotFoundException;
import com.company.loyalty.store.entity.Store;
import com.company.loyalty.store.repository.StoreRepository;
import com.company.loyalty.tier.entity.Tier;
import com.company.loyalty.tier.repository.TierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EarningRuleService {

    @Autowired
    private EarningRuleRepository earningRuleRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private TierRepository tierRepository;

    @Autowired
    private CampaignRepository campaignRepository;

    public List<EarningRuleDto> getAllEarningRules() {
        return earningRuleRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public EarningRuleDto getEarningRuleById(Long id) {
        EarningRule rule = earningRuleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Earning rule not found with id: " + id));
        return toDto(rule);
    }

    @Transactional
    public EarningRuleDto createEarningRule(EarningRuleDto dto) {
        EarningRule rule = EarningRule.builder()
                .name(dto.getName())
                .basePointsPerCurrencyUnit(dto.getBasePointsPerCurrencyUnit())
                .minAmount(dto.getMinAmount())
                .maxAmount(dto.getMaxAmount())
                .active(dto.getActive() != null ? dto.getActive() : true)
                .build();

        if (dto.getStoreId() != null) {
            Store store = storeRepository.findById(dto.getStoreId())
                    .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + dto.getStoreId()));
            rule.setStore(store);
        }

        if (dto.getTierId() != null) {
            Tier tier = tierRepository.findById(dto.getTierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Tier not found with id: " + dto.getTierId()));
            rule.setTier(tier);
        }

        if (dto.getCampaignId() != null) {
            Campaign campaign = campaignRepository.findById(dto.getCampaignId())
                    .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with id: " + dto.getCampaignId()));
            rule.setCampaign(campaign);
        }

        rule = earningRuleRepository.save(rule);
        return toDto(rule);
    }

    @Transactional
    public EarningRuleDto updateEarningRule(Long id, EarningRuleDto dto) {
        EarningRule rule = earningRuleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Earning rule not found with id: " + id));

        rule.setName(dto.getName());
        rule.setBasePointsPerCurrencyUnit(dto.getBasePointsPerCurrencyUnit());
        rule.setMinAmount(dto.getMinAmount());
        rule.setMaxAmount(dto.getMaxAmount());
        if (dto.getActive() != null) {
            rule.setActive(dto.getActive());
        }

        if (dto.getStoreId() != null) {
            Store store = storeRepository.findById(dto.getStoreId())
                    .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + dto.getStoreId()));
            rule.setStore(store);
        } else {
            rule.setStore(null);
        }

        if (dto.getTierId() != null) {
            Tier tier = tierRepository.findById(dto.getTierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Tier not found with id: " + dto.getTierId()));
            rule.setTier(tier);
        } else {
            rule.setTier(null);
        }

        if (dto.getCampaignId() != null) {
            Campaign campaign = campaignRepository.findById(dto.getCampaignId())
                    .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with id: " + dto.getCampaignId()));
            rule.setCampaign(campaign);
        } else {
            rule.setCampaign(null);
        }

        rule = earningRuleRepository.save(rule);
        return toDto(rule);
    }

    @Transactional
    public void deleteEarningRule(Long id) {
        EarningRule rule = earningRuleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Earning rule not found with id: " + id));
        rule.setActive(false);
        earningRuleRepository.save(rule);
    }

    private EarningRuleDto toDto(EarningRule rule) {
        return EarningRuleDto.builder()
                .id(rule.getId())
                .name(rule.getName())
                .basePointsPerCurrencyUnit(rule.getBasePointsPerCurrencyUnit())
                .minAmount(rule.getMinAmount())
                .maxAmount(rule.getMaxAmount())
                .storeId(rule.getStore() != null ? rule.getStore().getId() : null)
                .storeName(rule.getStore() != null ? rule.getStore().getName() : null)
                .tierId(rule.getTier() != null ? rule.getTier().getId() : null)
                .tierName(rule.getTier() != null ? rule.getTier().getName() : null)
                .campaignId(rule.getCampaign() != null ? rule.getCampaign().getId() : null)
                .campaignName(rule.getCampaign() != null ? rule.getCampaign().getName() : null)
                .active(rule.getActive())
                .createdAt(rule.getCreatedAt())
                .updatedAt(rule.getUpdatedAt())
                .build();
    }
}

