package lab;

import java.math.BigDecimal;

/** One executed trade. A trade is identified by its id; symbol is the instrument. */
public record Trade(String id, String symbol, int quantity, BigDecimal price) {

    public BigDecimal notional() {
        return price.multiply(BigDecimal.valueOf(quantity));
    }
}
