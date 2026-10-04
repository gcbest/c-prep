# java-debug lab

A small TradeReconciler (JUnit 5, Java 17+, Maven). One test fails on purpose.

Run: `mvn test`

Failing test: `TradeReconcilerTest.keepsDistinctTradesInTheSameSymbol` (expected 3 but was 2), plus `totalNotionalSumsDistinctTrades`, which has the same root cause.

Goal: read the test, reproduce, inspect `TradeReconciler.dedupe`, make the smallest fix, rerun, and explain the root cause out loud. See lesson 17 in the site.
