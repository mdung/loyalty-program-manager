package com.company.loyalty.common.util;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Component
public class ExportUtil {

    public byte[] exportToExcel(String sheetName, String[] headers, List<Object[]> data) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet(sheetName);

            // Create header row
            Row headerRow = sheet.createRow(0);
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Create data rows
            int rowNum = 1;
            for (Object[] rowData : data) {
                Row row = sheet.createRow(rowNum++);
                for (int i = 0; i < rowData.length; i++) {
                    Cell cell = row.createCell(i);
                    if (rowData[i] != null) {
                        if (rowData[i] instanceof Number) {
                            cell.setCellValue(((Number) rowData[i]).doubleValue());
                        } else {
                            cell.setCellValue(rowData[i].toString());
                        }
                    }
                }
            }

            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    public String exportToCsv(String[] headers, List<Object[]> data) {
        StringBuilder csv = new StringBuilder();
        
        // Add headers
        csv.append(String.join(",", headers)).append("\n");
        
        // Add data rows
        for (Object[] row : data) {
            for (int i = 0; i < row.length; i++) {
                if (i > 0) csv.append(",");
                if (row[i] != null) {
                    String value = row[i].toString();
                    // Escape commas and quotes
                    if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
                        value = "\"" + value.replace("\"", "\"\"") + "\"";
                    }
                    csv.append(value);
                }
            }
            csv.append("\n");
        }
        
        return csv.toString();
    }
}

