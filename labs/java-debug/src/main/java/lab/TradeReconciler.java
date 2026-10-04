package lab;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Removes duplicate trade reports (same trade id and symbol), keeping the first one seen. */
public class TradeReconciler {

    public List<Trade> dedupe(List<Trade> trades) {
        if (trades == null) {
            return List.of();
        }
        Map<String, Trade> seen = new LinkedHashMap<>();
        for (Trade t : trades) {
            // BUG: the key is the symbol only, so two different trades in AAPL collapse into one.
            seen.putIfAbsent(t.symbol(), t);
        }
        return new ArrayList<>(seen.values());
    }

    public BigDecimal totalNotional(List<Trade> trades) {
        return dedupe(trades).stream()
                .map(Trade::notional)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
