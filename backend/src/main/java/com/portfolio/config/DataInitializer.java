package com.portfolio.config;

import com.portfolio.model.Stock;
import com.portfolio.repository.StockRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final StockRepository stockRepository;

    public DataInitializer(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    @Override
    public void run(String... args) {
        if (stockRepository.count() > 0) {
            return;
        }

        stockRepository.save(new Stock("AAPL", "Apple Inc.", 50.0, 150.0, 178.50, 140.0));
        stockRepository.save(new Stock("GOOGL", "Alphabet Inc.", 20.0, 2800.0, 2950.0, 2700.0));
        stockRepository.save(new Stock("MSFT", "Microsoft Corporation", 30.0, 310.0, 375.20, 300.0));
        stockRepository.save(new Stock("TSLA", "Tesla Inc.", 15.0, 250.0, 215.80, 220.0));
        stockRepository.save(new Stock("AMZN", "Amazon.com Inc.", 25.0, 3300.0, 3450.0, null));
    }
}
