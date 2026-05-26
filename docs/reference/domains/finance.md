---
description: API reference for finance() — currencies, credit cards, IBANs, and monetary amounts.
---
# finance()

Financial data.

| Method | Returns | Description |
|---|---|---|
| `.creditCard()` | `TextFaker` | Credit card number |
| `.creditCardCVV()` | `TextFaker` | CVV code |
| `.iban()` | `TextFaker` | IBAN |
| `.bic()` | `TextFaker` | BIC/SWIFT code |
| `.bitcoinAddress()` | `TextFaker` | Bitcoin address |
| `.ethereumAddress()` | `TextFaker` | Ethereum address |
| `.currencyCode()` | `TextFaker` | Currency code (USD, EUR) |
| `.currencyName()` | `TextFaker` | Currency name |
| `.accountNumber()` | `TextFaker` | Bank account number |
| `.amount()` | `NumericFaker` | Monetary amount |

```typescript
finance().amount().min(10).max(500).precision(2).create()  // 129.99
finance().currencyCode().create()                           // 'EUR'
```

[← Back to Faker API](/reference/faker)
