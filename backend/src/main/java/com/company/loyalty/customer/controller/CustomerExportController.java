package com.company.loyalty.customer.controller;

import com.company.loyalty.customer.service.CustomerExportService;
import com.company.loyalty.customer.service.CustomerImportService;
import com.company.loyalty.common.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/customers/export")
public class CustomerExportController {

    @Autowired
    private CustomerExportService exportService;

    @Autowired
    private CustomerImportService importService;

    @GetMapping("/excel")
    public ResponseEntity<byte[]> exportToExcel() throws IOException {
        byte[] excelData = exportService.exportToExcel();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "customers.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .body(excelData);
    }

    @GetMapping("/csv")
    public ResponseEntity<String> exportToCsv() {
        String csvData = exportService.exportToCsv();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.setContentDispositionFormData("attachment", "customers.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvData);
    }

    @PostMapping("/import")
    public ResponseEntity<ApiResponse<List<String>>> importFromCsv(@RequestParam("file") MultipartFile file) {
        try {
            List<String> errors = importService.importFromCsv(file);
            if (errors.isEmpty()) {
                return ResponseEntity.ok(ApiResponse.success("Customers imported successfully", null));
            } else {
                return ResponseEntity.ok(ApiResponse.error("Import completed with errors").data(errors));
            }
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Import failed: " + e.getMessage()));
        }
    }
}

