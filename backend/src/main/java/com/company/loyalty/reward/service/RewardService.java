package com.company.loyalty.reward.service;

import com.company.loyalty.common.dto.PageResponse;
import com.company.loyalty.common.exception.ResourceNotFoundException;
import com.company.loyalty.common.enums.RedemptionStatus;
import com.company.loyalty.reward.dto.RedemptionDto;
import com.company.loyalty.reward.dto.RewardDto;
import com.company.loyalty.reward.entity.Reward;
import com.company.loyalty.reward.entity.RewardRedemption;
import com.company.loyalty.reward.repository.RewardRedemptionRepository;
import com.company.loyalty.reward.repository.RewardRepository;
import com.company.loyalty.user.entity.User;
import com.company.loyalty.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RewardService {

    @Autowired
    private RewardRepository rewardRepository;

    @Autowired
    private RewardRedemptionRepository redemptionRepository;

    @Autowired
    private UserRepository userRepository;

    public List<RewardDto> getAllRewards() {
        return rewardRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public RewardDto getRewardById(Long id) {
        Reward reward = rewardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reward not found with id: " + id));
        return toDto(reward);
    }

    @Transactional
    public RewardDto createReward(RewardDto dto) {
        Reward reward = Reward.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .requiredPoints(dto.getRequiredPoints())
                .type(dto.getType())
                .active(dto.getActive() != null ? dto.getActive() : true)
                .build();

        reward = rewardRepository.save(reward);
        return toDto(reward);
    }

    @Transactional
    public RewardDto updateReward(Long id, RewardDto dto) {
        Reward reward = rewardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reward not found with id: " + id));

        reward.setName(dto.getName());
        reward.setDescription(dto.getDescription());
        reward.setRequiredPoints(dto.getRequiredPoints());
        reward.setType(dto.getType());
        if (dto.getActive() != null) {
            reward.setActive(dto.getActive());
        }

        reward = rewardRepository.save(reward);
        return toDto(reward);
    }

    @Transactional
    public void deleteReward(Long id) {
        Reward reward = rewardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reward not found with id: " + id));
        reward.setActive(false);
        rewardRepository.save(reward);
    }

    public PageResponse<RedemptionDto> getAllRedemptions(int page, int size, RedemptionStatus status,
                                                         Long storeId, LocalDateTime fromDate, LocalDateTime toDate) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("redeemedAt").descending());
        Page<RewardRedemption> redemptionPage = redemptionRepository.findByFilters(
                status, storeId, fromDate, toDate, pageable);

        return PageResponse.<RedemptionDto>builder()
                .content(redemptionPage.getContent().stream().map(this::toRedemptionDto).toList())
                .page(redemptionPage.getNumber())
                .size(redemptionPage.getSize())
                .totalElements(redemptionPage.getTotalElements())
                .totalPages(redemptionPage.getTotalPages())
                .first(redemptionPage.isFirst())
                .last(redemptionPage.isLast())
                .build();
    }

    @Transactional
    public RedemptionDto approveRedemption(Long id) {
        RewardRedemption redemption = redemptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Redemption not found with id: " + id));
        redemption.setStatus(RedemptionStatus.APPROVED);
        redemption.setHandledBy(getCurrentUser());
        redemption = redemptionRepository.save(redemption);
        return toRedemptionDto(redemption);
    }

    @Transactional
    public RedemptionDto rejectRedemption(Long id) {
        RewardRedemption redemption = redemptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Redemption not found with id: " + id));
        redemption.setStatus(RedemptionStatus.REJECTED);
        redemption.setHandledBy(getCurrentUser());
        redemption = redemptionRepository.save(redemption);
        return toRedemptionDto(redemption);
    }

    @Transactional
    public RedemptionDto completeRedemption(Long id) {
        RewardRedemption redemption = redemptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Redemption not found with id: " + id));
        redemption.setStatus(RedemptionStatus.COMPLETED);
        redemption.setHandledBy(getCurrentUser());
        redemption = redemptionRepository.save(redemption);
        return toRedemptionDto(redemption);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private RewardDto toDto(Reward reward) {
        return RewardDto.builder()
                .id(reward.getId())
                .name(reward.getName())
                .description(reward.getDescription())
                .requiredPoints(reward.getRequiredPoints())
                .type(reward.getType())
                .active(reward.getActive())
                .createdAt(reward.getCreatedAt())
                .updatedAt(reward.getUpdatedAt())
                .build();
    }

    private RedemptionDto toRedemptionDto(RewardRedemption redemption) {
        return RedemptionDto.builder()
                .id(redemption.getId())
                .customerId(redemption.getCustomer().getId())
                .customerName(redemption.getCustomer().getFullName())
                .membershipCode(redemption.getCustomer().getMembershipCode())
                .rewardId(redemption.getReward().getId())
                .rewardName(redemption.getReward().getName())
                .pointsUsed(redemption.getPointsUsed())
                .status(redemption.getStatus())
                .storeId(redemption.getStore().getId())
                .storeName(redemption.getStore().getName())
                .handledBy(redemption.getHandledBy() != null ? redemption.getHandledBy().getUsername() : null)
                .redeemedAt(redemption.getRedeemedAt())
                .updatedAt(redemption.getUpdatedAt())
                .build();
    }
}

