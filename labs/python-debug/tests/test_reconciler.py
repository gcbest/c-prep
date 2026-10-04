from decimal import Decimal

from recon.reconciler import dedupe, total_notional
from recon.trade import Trade


def trade(id, symbol, qty, price):
    return Trade(id, symbol, qty, Decimal(price))


def test_removes_exact_duplicate_reports():
    trades = [trade("T1", "AAPL", 10, "5.00"), trade("T1", "AAPL", 10, "5.00")]
    assert len(dedupe(trades)) == 1


def test_none_and_empty_give_empty_result():
    assert dedupe(None) == []
    assert dedupe([]) == []


# FAILS until the dedupe key is fixed: assert 2 == 3
def test_keeps_distinct_trades_in_the_same_symbol():
    trades = [
        trade("T1", "AAPL", 10, "5.00"),
        trade("T2", "AAPL", 20, "5.50"),
        trade("T3", "MSFT", 5, "10.00"),
    ]
    assert len(dedupe(trades)) == 3


def test_total_notional_sums_distinct_trades():
    trades = [
        trade("T1", "AAPL", 10, "5.00"),
        trade("T2", "AAPL", 20, "5.50"),
        trade("T2", "AAPL", 20, "5.50"),
    ]
    assert total_notional(trades) == Decimal("160.00")
