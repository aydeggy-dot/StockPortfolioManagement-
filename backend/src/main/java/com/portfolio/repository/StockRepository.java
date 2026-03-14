package com.portfolio.repository;

import com.portfolio.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {

    Optional<Stock> findByTicker(String ticker);

    boolean existsByTicker(String ticker);

    @Query("SELECT s FROM Stock s WHERE LOWER(s.ticker) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.companyName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Stock> searchByTickerOrCompanyName(@Param("query") String query);

    @Query("SELECT s FROM Stock s WHERE s.alertThreshold IS NOT NULL AND s.currentPrice < s.alertThreshold")
    List<Stock> findStocksWithActiveAlerts();
}
