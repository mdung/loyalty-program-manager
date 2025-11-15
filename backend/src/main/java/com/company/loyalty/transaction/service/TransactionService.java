package com.company.loyalty.transaction.service;

import com.company.loyalty.common.dto.PageResponse;
import com.company.loyalty.common.enums.TransactionType;
import com.company.loyalty.common.exception.ResourceNotFoundException;
import com.company.loyalty.campaign.entity.Campaign;
import com.company.loyalty.campaign.entity.EarningRule;
import com.company.loyalty.campaign.repository.CampaignRepository;
import com.company.loyalty.campaign.repository.EarningRuleRepository;
import com.company.loyalty.customer.entity.Customer;
import com.company.loyalty.customer.repository.CustomerRepository;
import com.company.loyalty.customer.service.CustomerService;
import com.company.loyalty.reward.entity.Reward;
import com.company.loyalty.reward.entity.RewardRedemption;
import com.company.loyalty.reward.repository.RewardRepository;
import com.company.loyalty.reward.repository.RewardRedemptionRepository;
import com.company.loyalty.store.entity.Store;
import com.company.loyalty.store.repository.StoreRepository;
import com.company.loyalty.transaction.dto.AdjustPointsRequest;
import com.company.loyalty.transaction.dto.EarnPointsRequest;
import com.company.loyalty.transaction.dto.RedeemPointsRequest;
import com.company.loyalty.transaction.dto.TransactionDto;
import com.company.loyalty.transaction.entity.LoyaltyTransaction;
import com.company.loyalty.transaction.repository.LoyaltyTransactionRepository;
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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private LoyaltyTransactionRepository transactionRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RewardRepository rewardRepository;

    @Autowired
    private RewardRedemptionRepository redemptionRepository;

    @Autowired
    private EarningRuleRepository earningRuleRepository;

    @Autowired
    private CampaignRepository campaignRepository;

    @Autowired
    private CustomerService customerService;

    @Transactional
    public TransactionDto earnPoints(EarnPointsRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        Store store = storeRepository.findById(request.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found"));
        User user = getCurrentUser();

        // Calculate points based on earning rules and campaigns
        Long points = calculatePoints(request.getTransactionAmount(), customer, store);

        // Update customer balance
        customer.setCurrentPointsBalance(customer.getCurrentPointsBalance() + points);
        customer = customerRepository.save(customer);

        // Update tier if needed
        customerService.updateCustomerTier(customer);

        // Create transaction
        LoyaltyTransaction transaction = LoyaltyTransaction.builder()
                .customer(customer)
                .store(store)
                .type(TransactionType.EARN)
                .points(points)
                .transactionAmount(request.getTransactionAmount())
                .description(request.getDescription())
                .createdBy(user)
                .build();

        transaction = transactionRepository.save(transaction);
        return toDto(transaction);
    }

    @Transactional
    public TransactionDto redeemPoints(RedeemPointsRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        Store store = storeRepository.findById(request.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found"));
        Reward reward = rewardRepository.findById(request.getRewardId())
                .orElseThrow(() -> new ResourceNotFoundException("Reward not found"));
        User user = getCurrentUser();

        if (!reward.getActive()) {
            throw new IllegalArgumentException("Reward is not active");
        }

        if (customer.getCurrentPointsBalance() < request.getPointsUsed()) {
            throw new IllegalArgumentException("Insufficient points balance");
        }

        if (!request.getPointsUsed().equals(reward.getRequiredPoints())) {
            throw new IllegalArgumentException("Points used must match reward required points");
        }

        // Deduct points
        customer.setCurrentPointsBalance(customer.getCurrentPointsBalance() - request.getPointsUsed());
        customer = customerRepository.save(customer);

        // Create redemption
        RewardRedemption redemption = RewardRedemption.builder()
                .customer(customer)
                .reward(reward)
                .pointsUsed(request.getPointsUsed())
                .status(com.company.loyalty.common.enums.RedemptionStatus.PENDING)
                .store(store)
                .handledBy(user)
                .build();

        redemption = redemptionRepository.save(redemption);

        // Create transaction
        LoyaltyTransaction transaction = LoyaltyTransaction.builder()
                .customer(customer)
                .store(store)
                .type(TransactionType.REDEEM)
                .points(request.getPointsUsed())
                .description(request.getDescription() != null ? request.getDescription() : "Redeemed: " + reward.getName())
                .createdBy(user)
                .build();

        transaction = transactionRepository.save(transaction);
        return toDto(transaction);
    }

    @Transactional
    public TransactionDto adjustPoints(AdjustPointsRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        Store store = storeRepository.findById(request.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found"));
        User user = getCurrentUser();

        // Update customer balance
        customer.setCurrentPointsBalance(customer.getCurrentPointsBalance() + request.getPoints());
        if (customer.getCurrentPointsBalance() < 0) {
            customer.setCurrentPointsBalance(0L);
        }
        customer = customerRepository.save(customer);

        // Update tier if needed
        customerService.updateCustomerTier(customer);

        // Create transaction
        LoyaltyTransaction transaction = LoyaltyTransaction.builder()
                .customer(customer)
                .store(store)
                .type(TransactionType.ADJUSTMENT)
                .points(request.getPoints())
                .description(request.getDescription())
                .createdBy(user)
                .build();

        transaction = transactionRepository.save(transaction);
        return toDto(transaction);
    }

    public PageResponse<TransactionDto> getAllTransactions(int page, int size, Long customerId, Long storeId,
                                                           TransactionType type, LocalDateTime fromDate,
                                                           LocalDateTime toDate) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<LoyaltyTransaction> transactionPage = transactionRepository.findByFilters(
                customerId, storeId, type, fromDate, toDate, pageable);

        return PageResponse.<TransactionDto>builder()
                .content(transactionPage.getContent().stream().map(this::toDto).toList())
                .page(transactionPage.getNumber())
                .size(transactionPage.getSize())
                .totalElements(transactionPage.getTotalElements())
                .totalPages(transactionPage.getTotalPages())
                .first(transactionPage.isFirst())
                .last(transactionPage.isLast())
                .build();
    }

    public List<TransactionDto> getCustomerTransactions(Long customerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<LoyaltyTransaction> transactions = transactionRepository.findByCustomerId(customerId, pageable);
        return transactions.getContent().stream().map(this::toDto).toList();
    }

    private Long calculatePoints(BigDecimal amount, Customer customer, Store store) {
        // Get applicable earning rule
        EarningRule rule = earningRuleRepository.findActiveRuleForCustomerAndStore(
                customer.getCurrentTier() != null ? customer.getCurrentTier().getId() : null,
                store.getId())
                .orElse(earningRuleRepository.findDefaultRule()
                        .orElseThrow(() -> new ResourceNotFoundException("No earning rule found")));

        // Calculate base points
        double basePoints = amount.doubleValue() * rule.getBasePointsPerCurrencyUnit();

        // Check for active campaigns
        List<Campaign> activeCampaigns = campaignRepository.findActiveCampaigns(
                LocalDate.now(), customer.getCurrentTier() != null ? customer.getCurrentTier().getId() : null);

        double multiplier = 1.0;
        for (Campaign campaign : activeCampaigns) {
            multiplier *= campaign.getEarningMultiplier();
        }

        return (long) (basePoints * multiplier);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private TransactionDto toDto(LoyaltyTransaction transaction) {
        return TransactionDto.builder()
                .id(transaction.getId())
                .customerId(transaction.getCustomer().getId())
                .customerName(transaction.getCustomer().getFullName())
                .membershipCode(transaction.getCustomer().getMembershipCode())
                .storeId(transaction.getStore().getId())
                .storeName(transaction.getStore().getName())
                .type(transaction.getType())
                .points(transaction.getPoints())
                .transactionAmount(transaction.getTransactionAmount())
                .description(transaction.getDescription())
                .createdBy(transaction.getCreatedBy().getUsername())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}

