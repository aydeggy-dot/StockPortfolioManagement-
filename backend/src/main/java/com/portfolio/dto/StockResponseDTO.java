package com.portfolio.dto;

import com.portfolio.model.Stock;
import java.time.LocalDateTime;

public class StockResponseDTO {
    private Long id;
    private String ticker;
    private String companyName;
    private Double quantity;
    private Double averageBuyPrice;
    private Double currentPrice;
    private Double alertThreshold;
    private Double marketValue;
    private Double gainLossPercent;
    private boolean alertActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static StockResponseDTO fromEntity(Stock stock) {
        StockResponseDTO dto = new StockResponseDTO();
        dto.id = stock.getId();
        dto.ticker = stock.getTicker();
        dto.companyName = stock.getCompanyName();
        dto.quantity = stock.getQuantity();
        dto.averageBuyPrice = stock.getAverageBuyPrice();
        dto.currentPrice = stock.getCurrentPrice();
        dto.alertThreshold = stock.getAlertThreshold();
        dto.marketValue = stock.getQuantity() * stock.getCurrentPrice();
        dto.gainLossPercent = ((stock.getCurrentPrice() - stock.getAverageBuyPrice()) / stock.getAverageBuyPrice()) * 100;
        dto.alertActive = stock.getAlertThreshold() != null && stock.getCurrentPrice() < stock.getAlertThreshold();
        dto.createdAt = stock.getCreatedAt();
        dto.updatedAt = stock.getUpdatedAt();
        return dto;
    }

    public Long getId() { return id; }
    public String getTicker() { return ticker; }
    public String getCompanyName() { return companyName; }
    public Double getQuantity() { return quantity; }
    public Double getAverageBuyPrice() { return averageBuyPrice; }
    public Double getCurrentPrice() { return currentPrice; }
    public Double getAlertThreshold() { return alertThreshold; }
    public Double getMarketValue() { return marketValue; }
    public Double getGainLossPercent() { return gainLossPercent; }
    public boolean isAlertActive() { return alertActive; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
