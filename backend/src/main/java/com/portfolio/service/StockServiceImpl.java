package com.portfolio.service;

import com.portfolio.dto.PriceUpdateDTO;
import com.portfolio.dto.StockRequestDTO;
import com.portfolio.dto.StockResponseDTO;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.model.Stock;
import com.portfolio.repository.StockRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockServiceImpl implements StockService {

    private final StockRepository stockRepository;

    public StockServiceImpl(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    @Override
    public List<StockResponseDTO> getAllStocks() {
        return stockRepository.findAll().stream()
                .map(StockResponseDTO::fromEntity)
                .toList();
    }

    @Override
    public StockResponseDTO getStockById(Long id) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stock not found with id: " + id));
        return StockResponseDTO.fromEntity(stock);
    }

    @Override
    public StockResponseDTO createStock(StockRequestDTO dto) {
        if (stockRepository.existsByTicker(dto.getTicker().toUpperCase())) {
            throw new IllegalArgumentException("Stock with ticker " + dto.getTicker() + " already exists");
        }

        Stock stock = new Stock();
        stock.setTicker(dto.getTicker().toUpperCase());
        stock.setCompanyName(dto.getCompanyName());
        stock.setQuantity(dto.getQuantity());
        stock.setAverageBuyPrice(dto.getAverageBuyPrice());
        stock.setCurrentPrice(dto.getCurrentPrice());
        stock.setAlertThreshold(dto.getAlertThreshold());

        return StockResponseDTO.fromEntity(stockRepository.save(stock));
    }

    @Override
    public StockResponseDTO updateStock(Long id, StockRequestDTO dto) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stock not found with id: " + id));

        stock.setTicker(dto.getTicker().toUpperCase());
        stock.setCompanyName(dto.getCompanyName());
        stock.setQuantity(dto.getQuantity());
        stock.setAverageBuyPrice(dto.getAverageBuyPrice());
        stock.setCurrentPrice(dto.getCurrentPrice());
        stock.setAlertThreshold(dto.getAlertThreshold());

        return StockResponseDTO.fromEntity(stockRepository.save(stock));
    }

    @Override
    public void deleteStock(Long id) {
        if (!stockRepository.existsById(id)) {
            throw new ResourceNotFoundException("Stock not found with id: " + id);
        }
        stockRepository.deleteById(id);
    }

    @Override
    public List<StockResponseDTO> searchStocks(String query) {
        return stockRepository.searchByTickerOrCompanyName(query).stream()
                .map(StockResponseDTO::fromEntity)
                .toList();
    }

    @Override
    public List<StockResponseDTO> getAlerts() {
        return stockRepository.findStocksWithActiveAlerts().stream()
                .map(StockResponseDTO::fromEntity)
                .toList();
    }

    @Override
    public StockResponseDTO updatePrice(Long id, PriceUpdateDTO dto) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stock not found with id: " + id));

        stock.setCurrentPrice(dto.getCurrentPrice());
        return StockResponseDTO.fromEntity(stockRepository.save(stock));
    }
}
