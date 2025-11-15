package com.company.loyalty.tier.service;

import com.company.loyalty.common.exception.ResourceNotFoundException;
import com.company.loyalty.tier.dto.TierDto;
import com.company.loyalty.tier.entity.Tier;
import com.company.loyalty.tier.repository.TierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TierService {

    @Autowired
    private TierRepository tierRepository;

    public List<TierDto> getAllTiers() {
        return tierRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public TierDto getTierById(Long id) {
        Tier tier = tierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tier not found with id: " + id));
        return toDto(tier);
    }

    @Transactional
    public TierDto createTier(TierDto dto) {
        Tier tier = Tier.builder()
                .name(dto.getName())
                .minPoints(dto.getMinPoints())
                .maxPoints(dto.getMaxPoints())
                .benefitsDescription(dto.getBenefitsDescription())
                .priority(dto.getPriority())
                .build();

        tier = tierRepository.save(tier);
        return toDto(tier);
    }

    @Transactional
    public TierDto updateTier(Long id, TierDto dto) {
        Tier tier = tierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tier not found with id: " + id));

        tier.setName(dto.getName());
        tier.setMinPoints(dto.getMinPoints());
        tier.setMaxPoints(dto.getMaxPoints());
        tier.setBenefitsDescription(dto.getBenefitsDescription());
        tier.setPriority(dto.getPriority());

        tier = tierRepository.save(tier);
        return toDto(tier);
    }

    @Transactional
    public void deleteTier(Long id) {
        Tier tier = tierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tier not found with id: " + id));
        // Check if tier is used by customers
        // For now, we'll allow deletion but in production you might want to prevent it
        tierRepository.delete(tier);
    }

    private TierDto toDto(Tier tier) {
        return TierDto.builder()
                .id(tier.getId())
                .name(tier.getName())
                .minPoints(tier.getMinPoints())
                .maxPoints(tier.getMaxPoints())
                .benefitsDescription(tier.getBenefitsDescription())
                .priority(tier.getPriority())
                .createdAt(tier.getCreatedAt())
                .updatedAt(tier.getUpdatedAt())
                .build();
    }
}

