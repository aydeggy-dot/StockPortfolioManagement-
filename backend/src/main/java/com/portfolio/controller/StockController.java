package com.portfolio.controller;

import com.portfolio.dto.ApiResponse;
import com.portfolio.dto.PriceUpdateDTO;
import com.portfolio.dto.StockRequestDTO;
import com.portfolio.dto.StockResponseDTO;
import com.portfolio.service.StockService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StockResponseDTO>>> getAllStocks() {
        return ResponseEntity.ok(ApiResponse.success(stockService.getAllStocks()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StockResponseDTO>> getStockById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(stockService.getStockById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StockResponseDTO>> createStock(@Valid @RequestBody StockRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(stockService.createStock(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StockResponseDTO>> updateStock(@PathVariable Long id, @Valid @RequestBody StockRequestDTO dto) {
        return ResponseEntity.ok(ApiResponse.success(stockService.updateStock(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStock(@PathVariable Long id) {
        stockService.deleteStock(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<StockResponseDTO>>> searchStocks(@RequestParam String q) {
        return ResponseEntity.ok(ApiResponse.success(stockService.searchStocks(q)));
    }

    @GetMapping("/alerts")
    public ResponseEntity<ApiResponse<List<StockResponseDTO>>> getAlerts() {
        return ResponseEntity.ok(ApiResponse.success(stockService.getAlerts()));
    }

    @PatchMapping("/{id}/price")
    public ResponseEntity<ApiResponse<StockResponseDTO>> updatePrice(@PathVariable Long id, @Valid @RequestBody PriceUpdateDTO dto) {
        return ResponseEntity.ok(ApiResponse.success(stockService.updatePrice(id, dto)));
    }
}
