package com.portfolio.service;

import com.portfolio.dto.PriceUpdateDTO;
import com.portfolio.dto.StockRequestDTO;
import com.portfolio.dto.StockResponseDTO;

import java.util.List;

public interface StockService {
    List<StockResponseDTO> getAllStocks();
    StockResponseDTO getStockById(Long id);
    StockResponseDTO createStock(StockRequestDTO dto);
    StockResponseDTO updateStock(Long id, StockRequestDTO dto);
    void deleteStock(Long id);
    List<StockResponseDTO> searchStocks(String query);
    List<StockResponseDTO> getAlerts();
    StockResponseDTO updatePrice(Long id, PriceUpdateDTO dto);
}
