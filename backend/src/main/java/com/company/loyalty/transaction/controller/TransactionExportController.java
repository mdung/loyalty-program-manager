package com.company.loyalty.transaction.controller;

import com.company.loyalty.common.enums.TransactionType;
import com.company.loyalty.transaction.service.TransactionExportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/transactions/export")
public class TransactionExportController {

    @Autowired
    private TransactionExportService exportService;

    @GetMapping("/excel")
    public ResponseEntity<byte[]> exportToExcel(
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long storeId,
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate) throws IOException {
        byte[] excelData = exportService.exportToExcel(customerId, storeId, type, fromDate, toDate);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "transactions.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .body(excelData);
    }

    @GetMapping("/csv")
    public ResponseEntity<String> exportToCsv(
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long storeId,
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate) {
        String csvData = exportService.exportToCsv(customerId, storeId, type, fromDate, toDate);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.setContentDispositionFormData("attachment", "transactions.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvData);
    }
}

