package lab;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;

class TradeReconcilerTest {

    private final TradeReconciler reconciler = new TradeReconciler();

    private static Trade trade(String id, String symbol, int qty, String price) {
        return new Trade(id, symbol, qty, new BigDecimal(price));
    }

    @Test
    void removesExactDuplicateReports() {
        List<Trade> in = List.of(trade("T1", "AAPL", 10, "5.00"), trade("T1", "AAPL", 10, "5.00"));
        assertEquals(1, reconciler.dedupe(in).size());
    }

    @Test
    void nullAndEmptyInputGiveEmptyResult() {
        assertTrue(reconciler.dedupe(null).isEmpty());
        assertTrue(reconciler.dedupe(List.of()).isEmpty());
    }

    // FAILS until the dedupe key is fixed: expected 3 but was 2.
    @Test
    void keepsDistinctTradesInTheSameSymbol() {
        List<Trade> in = List.of(
                trade("T1", "AAPL", 10, "5.00"),
                trade("T2", "AAPL", 20, "5.50"),
                trade("T3", "MSFT", 5, "10.00"));
        assertEquals(3, reconciler.dedupe(in).size());
    }

    @Test
    void totalNotionalSumsDistinctTrades() {
        List<Trade> in = List.of(
                trade("T1", "AAPL", 10, "5.00"),
                trade("T2", "AAPL", 20, "5.50"),
                trade("T2", "AAPL", 20, "5.50"));
        assertEquals(0, new BigDecimal("160.00").compareTo(reconciler.totalNotional(in)));
    }
}
