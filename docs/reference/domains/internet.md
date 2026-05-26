---
description: API reference for internet() — emails, URLs, IPs, and usernames.
---
# internet()

Internet-related data.

| Method | Returns | Description |
|---|---|---|
| `.email()` | `TextFaker` | Email address |
| `.username()` | `TextFaker` | Username |
| `.password(len?)` | `TextFaker` | Password |
| `.url()` | `TextFaker` | Full URL |
| `.domainName()` | `TextFaker` | Domain name |
| `.port()` | `NumericFaker` | Port number |
| `.ip()` | `TextFaker` | IP address (v4 or v6) |
| `.ipv4()` | `TextFaker` | IPv4 address |
| `.ipv6()` | `TextFaker` | IPv6 address |
| `.mac()` | `TextFaker` | MAC address |
| `.userAgent()` | `TextFaker` | User agent string |
| `.emoji()` | `TextFaker` | Random emoji |

```typescript
internet().email().create()    // 'niko.alvarado@example.com'
internet().port().min(3000).max(9000).create()  // 4200
```

[← Back to Faker API](/reference/faker)
