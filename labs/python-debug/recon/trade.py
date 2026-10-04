from dataclasses import dataclass
from decimal import Decimal


@dataclass(frozen=True)
class Trade:
    """One executed trade. A trade is identified by its id; symbol is the instrument."""

    id: str
    symbol: str
    quantity: int
    price: Decimal

    def notional(self) -> Decimal:
        return self.price * self.quantity
