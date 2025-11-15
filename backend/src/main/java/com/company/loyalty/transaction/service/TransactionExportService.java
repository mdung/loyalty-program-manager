package com.company.loyalty.transaction.service;

import com.company.loyalty.common.enums.TransactionType;
import com.company.loyalty.common.util.ExportUtil;
import com.company.loyalty.transaction.entity.LoyaltyTransaction;
import com.company.loyalty.transaction.repository.LoyaltyTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class TransactionExportService {

    @Autowired
    private LoyaltyTransactionRepository transactionRepository;

    @Autowired
    private ExportUtil exportUtil;

    public byte[] exportToExcel(Long customerId, Long storeId, TransactionType type,
                                LocalDateTime fromDate, LocalDateTime toDate) throws IOException {
        List<LoyaltyTransaction> transactions = transactionRepository.findByFilters(
                customerId, storeId, type, fromDate, toDate,
                org.springframework.data.domain.PageRequest.of(0, Integer.MAX_VALUE))
                .getContent();

        String[] headers = {"ID", "Date", "Customer", "Membership Code", "Store", "Type", "Points", "Amount", "Description", "Created By"};
        List<Object[]> data = new ArrayList<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        for (LoyaltyTransaction tx : transactions) {
            data.add(new Object[]{
                    tx.getId(),
                    tx.getCreatedAt().format(formatter),
                    tx.getCustomer().getFullName(),
                    tx.getCustomer().getMembershipCode(),
                    tx.getStore().getName(),
                    tx.getType().name(),
                    tx.getPoints(),
                    tx.getTransactionAmount() != null ? tx.getTransactionAmount() : "",
                    tx.getDescription() != null ? tx.getDescription() : "",
                    tx.getCreatedBy().getUsername()
            });
        }

        return exportUtil.exportToExcel("Transactions", headers, data);
    }

    public String exportToCsv(Long customerId, Long storeId, TransactionType type,
                              LocalDateTime fromDate, LocalDateTime toDate) {
        List<LoyaltyTransaction> transactions = transactionRepository.findByFilters(
                customerId, storeId, type, fromDate, toDate,
                org.springframework.data.domain.PageRequest.of(0, Integer.MAX_VALUE))
                .getContent();

        String[] headers = {"ID", "Date", "Customer", "Membership Code", "Store", "Type", "Points", "Amount", "Description", "Created By"};
        List<Object[]> data = new ArrayList<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        for (LoyaltyTransaction tx : transactions) {
            data.add(new Object[]{
                    tx.getId(),
                    tx.getCreatedAt().format(formatter),
                    tx.getCustomer().getFullName(),
                    tx.getCustomer().getMembershipCode(),
                    tx.getStore().getName(),
                    tx.getType().name(),
                    tx.getPoints(),
                    tx.getTransactionAmount() != null ? tx.getTransactionAmount() : "",
                    tx.getDescription() != null ? tx.getDescription() : "",
                    tx.getCreatedBy().getUsername()
            });
        }

        return exportUtil.exportToCsv(headers, data);
    }
}

