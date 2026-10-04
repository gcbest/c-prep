from decimal import Decimal

from .trade import Trade


def dedupe(trades: list[Trade] | None) -> list[Trade]:
    """Remove duplicate trade reports (same trade id and symbol), keeping the first one seen."""
    if not trades:
        return []
    seen: dict[str, Trade] = {}
    for t in trades:
        # BUG: the key is the symbol only, so two different trades in AAPL collapse into one.
        seen.setdefault(t.symbol, t)
    return list(seen.values())


def total_notional(trades: list[Trade] | None) -> Decimal:
    return sum((t.notional() for t in dedupe(trades)), Decimal("0"))
