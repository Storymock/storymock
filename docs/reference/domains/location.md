---
description: API reference for location() — cities, countries, coordinates, and addresses.
---
# location()

Geographic and address data.

| Method | Returns | Description |
|---|---|---|
| `.city()` | `TextFaker` | City name |
| `.country()` | `TextFaker` | Country name |
| `.countryCode()` | `TextFaker` | ISO country code |
| `.state()` | `TextFaker` | State/province |
| `.street()` | `TextFaker` | Street name |
| `.streetAddress()` | `TextFaker` | Full street address |
| `.zipCode()` | `TextFaker` | Postal code |
| `.latitude()` | `NumericFaker` | Latitude (-90 to 90) |
| `.longitude()` | `NumericFaker` | Longitude (-180 to 180) |
| `.timezone()` | `TextFaker` | IANA timezone |

```typescript
location().city().create()                      // 'San Francisco'
location().latitude().precision(4).create()     // 44.8271
```

[← Back to Faker API](/reference/faker)
