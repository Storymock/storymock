---
description: API reference for person() — names, ages, jobs, and biographical data.
---
# person()

People-related data. Every method returns a core faker — keep chaining constraints.

| Method | Returns | Description |
|---|---|---|
| `.firstName()` | `TextFaker` | First name |
| `.lastName()` | `TextFaker` | Last name |
| `.fullName()` | `TextFaker` | Full name |
| `.middleName()` | `TextFaker` | Middle name |
| `.prefix()` | `TextFaker` | Name prefix (Mr., Dr.) |
| `.suffix()` | `TextFaker` | Name suffix (Jr., III) |
| `.gender()` | `TextFaker` | Gender |
| `.sex()` | `TextFaker` | Biological sex |
| `.age()` | `NumericFaker` | Age (default: 0–120) |
| `.birthdate()` | `TemporalFaker` | Date of birth |
| `.jobTitle()` | `TextFaker` | Job title |
| `.jobArea()` | `TextFaker` | Job area/department |
| `.bio()` | `TextFaker` | Short biography |

```typescript
person().age().min(18).max(65).create()    // 34
person().fullName().create()                // 'Yuki Tanaka'
```

[← Back to Faker API](/reference/faker)
