# python-debug lab

A small TradeReconciler (pytest, Python 3.10+). One test fails on purpose.

Run: `pip install -r requirements.txt` then `pytest`

Failing tests: `test_keeps_distinct_trades_in_the_same_symbol` (assert 2 == 3), plus `test_total_notional_sums_distinct_trades`, which has the same root cause.

Goal: read the test, reproduce, inspect `recon/reconciler.py`, make the smallest fix, rerun, and explain the root cause out loud. See lesson 17 in the site.
