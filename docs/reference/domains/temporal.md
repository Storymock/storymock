---
description: API reference for temporal() — generate dates, timestamps, and formatted time strings.
---
# temporal()

Creates a `TemporalFaker`. Default: random `Date` in `[10 years ago, 10 years from now]`.

**Mixins:** `Bounded<Date>`, `Excludable<Date>`, `Nullable`, `Seedable`

```typescript
import { temporal } from 'storymock';

temporal().create();          // random Date within ±10 years
temporal().create(5);         // [Date, Date, Date, Date, Date]
```

---

## Unit Type

Several methods accept a `unit` parameter:

```typescript
type TemporalUnit = 'days' | 'weeks' | 'months' | 'years';
```

Units are always **explicit** — no method has a hard-coded or default unit.

---

## Relative — Range

Generate a **random** date within a window around now. Every call to `.create()` produces a different date somewhere inside the range.

```typescript
.past(n: number | Faker<number>, unit: TemporalUnit): TemporalFaker
.future(n: number | Faker<number>, unit: TemporalUnit): TemporalFaker
```

| Method | Range | Example | Output |
|---|---|---|---|
| `.past(1, 'years')` | `[now − 1y, now]` | `temporal().past(1, 'years').create()` | `2025-09-14T08:23:41Z` |
| `.past(7, 'days')` | `[now − 7d, now]` | `temporal().past(7, 'days').create()` | `2026-05-22T14:07:33Z` |
| `.past(3, 'months')` | `[now − 3m, now]` | `temporal().past(3, 'months').create()` | `2026-03-11T19:42:08Z` |
| `.future(2, 'years')` | `[now, now + 2y]` | `temporal().future(2, 'years').create()` | `2027-11-22T14:05:47Z` |
| `.future(30, 'days')` | `[now, now + 30d]` | `temporal().future(30, 'days').create()` | `2026-06-18T03:28:55Z` |
| `.future(6, 'weeks')` | `[now, now + 6w]` | `temporal().future(6, 'weeks').create()` | `2026-07-01T11:44:29Z` |

Both arguments are required — no implicit defaults:

```typescript
// ✅ Always explicit
temporal().past(1, 'years')
temporal().future(14, 'days')

// ❌ Does not compile — unit is required
temporal().past(5)
temporal().future()
```

**Accepts fakers for `n`:**

```typescript
// Random date within 1–5 years ago
temporal().past(numeric().min(1).max(5), 'years').create();
```

---

## Relative — Exact

Generate a date at a **specific offset** from now. The result is a single point in time, not a range.

```typescript
.ago(n: number | Faker<number>, unit: TemporalUnit): TemporalFaker
.fromNow(n: number | Faker<number>, unit: TemporalUnit): TemporalFaker
```

| Method | Result | Example | Output |
|---|---|---|---|
| `.ago(7, 'days')` | now − 7 days | `temporal().ago(7, 'days').create()` | `2026-05-20T10:33:14Z` |
| `.ago(2, 'weeks')` | now − 2 weeks | `temporal().ago(2, 'weeks').create()` | `2026-05-13T16:08:51Z` |
| `.ago(3, 'months')` | now − 3 months | `temporal().ago(3, 'months').create()` | `2026-02-27T04:55:29Z` |
| `.ago(1, 'years')` | now − 1 year | `temporal().ago(1, 'years').create()` | `2025-05-27T22:41:07Z` |
| `.fromNow(30, 'days')` | now + 30 days | `temporal().fromNow(30, 'days').create()` | `2026-06-26T13:19:44Z` |
| `.fromNow(6, 'months')` | now + 6 months | `temporal().fromNow(6, 'months').create()` | `2026-11-27T08:22:11Z` |

Both arguments are required.

**Accepts fakers for `n`:**

```typescript
// Birthdate exactly 18–80 years ago
temporal().ago(numeric().min(18).max(80), 'years').create();
```

---

## Calendar

Fixed calendar dates with time zeroed to `00:00:00.000`.

```typescript
.today(): TemporalFaker
.yesterday(): TemporalFaker
.tomorrow(): TemporalFaker
```

| Method | Result | Example |
|---|---|---|
| `.today()` | Today at midnight | `temporal().today().create()` → `2026-05-27T00:00:00Z` |
| `.yesterday()` | Yesterday at midnight | `temporal().yesterday().create()` → `2026-05-26T00:00:00Z` |
| `.tomorrow()` | Tomorrow at midnight | `temporal().tomorrow().create()` → `2026-05-28T00:00:00Z` |

---

## Convenience

Zero-argument shorthands for "near" dates. The window size is configurable via [`configure()`](/guide/configuration#defaults-reference) — default is **2 days**.

```typescript
.recent(): TemporalFaker    // random date in [now − recentWindow, now]
.soon(): TemporalFaker      // random date in [now, now + soonWindow]
```

| Method | Default range | Example | Output |
|---|---|---|---|
| `.recent()` | `[now − 2d, now]` | `temporal().recent().create()` | `2026-05-25T21:17:33Z` |
| `.soon()` | `[now, now + 2d]` | `temporal().soon().create()` | `2026-05-29T03:42:18Z` |

These take **no arguments**. To control the window per-call, use `.past(n, unit)` / `.future(n, unit)` instead. To change the default window globally:

```typescript
configure({
  defaults: {
    temporal: { recent: 5, soon: 5 },  // 5 days each
  },
});
```

---

## Absolute

Constrain to specific calendar components. These compose — each narrows the range further. The remaining components are randomized within the constraint.

```typescript
.year(y: number | Faker<number>): TemporalFaker
.month(m: MonthName | number): TemporalFaker     // 'january'–'december' or 1–12
.day(d: number): TemporalFaker                    // 1–31
.weekday(d: WeekdayName): TemporalFaker           // 'monday'–'sunday'
.hour(h: number): TemporalFaker                   // 0–23
.minute(m: number): TemporalFaker                 // 0–59
.second(s: number): TemporalFaker                 // 0–59
```

```typescript
temporal().year(2024).create();
// 2024-09-14T07:33:21Z — random date in 2024

temporal().year(2024).month('march').create();
// 2024-03-17T15:42:19Z — random day in March 2024

temporal().year(2024).weekday('monday').create();
// 2024-03-04T11:28:04Z — a random Monday in 2024

temporal().month('december').day(25).create();
// 2031-12-25T03:17:44Z — a random Christmas
```

**Accepts fakers for `.year()`:**

```typescript
temporal().year(numeric().min(2020).max(2025)).create();
// picks a random year in [2020, 2025], then a random date within it
```

### Throws

- `ContradictoryConstraintError` — when constraints are unsatisfiable:
  ```typescript
  // February 31st doesn't exist
  temporal().month('february').day(31).create();
  // → ContradictoryConstraintError: No valid date exists for month 'february', day 31

  // 2024-02-30 doesn't exist
  temporal().year(2024).month('february').day(30).create();
  // → ContradictoryConstraintError
  ```

---

## Range

Constrain to a specific date range. The result is a random date within the range.

```typescript
.between(start: string | Date, end: string | Date): TemporalFaker
.before(d: string | Date): TemporalFaker
.after(d: string | Date): TemporalFaker
.thisWeek(): TemporalFaker
.thisMonth(): TemporalFaker
.thisYear(): TemporalFaker
.lastWeek(): TemporalFaker
.lastMonth(): TemporalFaker
.lastYear(): TemporalFaker
.nextWeek(): TemporalFaker
.nextMonth(): TemporalFaker
.nextYear(): TemporalFaker
```

| Method | Range |
|---|---|
| `.between('2020-01-01', '2024-12-31')` | Explicit start/end |
| `.before('2023-06-15')` | `[default min, 2023-06-15)` |
| `.after('2022-01-01')` | `(2022-01-01, default max]` |
| `.thisWeek()` | Monday 00:00 → Sunday 23:59 of current week |
| `.thisMonth()` | 1st → last day of current month |
| `.thisYear()` | Jan 1 → Dec 31 of current year |
| `.lastWeek()` | Previous week (Mon–Sun) |
| `.lastMonth()` | Previous calendar month |
| `.lastYear()` | Previous calendar year |
| `.nextWeek()` | Next week (Mon–Sun) |
| `.nextMonth()` | Next calendar month |
| `.nextYear()` | Next calendar year |

### Composing with other constraints

Range methods compose with relative and absolute methods. The intersection is used:

```typescript
temporal().thisYear().before('2026-07-01').create();
temporal().lastYear().month('march').create();
```

### Throws

- `ContradictoryConstraintError` — when the range is empty:
  ```typescript
  // Start is after end
  temporal().between('2025-01-01', '2020-01-01').create();
  // → ContradictoryConstraintError: Cannot generate date — start (2025-01-01) is after end (2020-01-01)

  // .after() + .before() with no overlap
  temporal().after('2025-01-01').before('2020-01-01').create();
  // → ContradictoryConstraintError: Cannot generate date — after (2025-01-01) is later than before (2020-01-01)
  ```

---

## Format (changes return type)

Format methods transform the output type. Like `numeric().hex()`, they return a new faker with a different output type, so temporal-specific methods are no longer available after them.

```typescript
.iso(): Faker<string>
.timestamp(): Faker<number>
.format(fmt: string): Faker<string>
```

| Method | Returns | Example | Output |
|---|---|---|---|
| `.iso()` | ISO 8601 string | `temporal().today().iso().create()` | `'2026-05-27T00:00:00.000Z'` |
| `.timestamp()` | Unix ms | `temporal().today().timestamp().create()` | `1748304000000` |
| `.format(fmt)` | Custom string | `temporal().format('YYYY-MM-DD').create()` | `'2025-03-14'` |

### Format tokens

| Token | Meaning | Example |
|---|---|---|
| `YYYY` | 4-digit year | `2026` |
| `YY` | 2-digit year | `26` |
| `MM` | Month (01–12) | `05` |
| `DD` | Day (01–31) | `27` |
| `HH` | Hour (00–23) | `14` |
| `mm` | Minute (00–59) | `33` |
| `ss` | Second (00–59) | `07` |
| `SSS` | Milliseconds (000–999) | `042` |

```typescript
temporal().format('YYYY/MM/DD HH:mm').create();   // '2024/09/14 07:33'
temporal().format('DD-MM-YYYY').create();           // '14-09-2024'
```

::: warning Order matters
Format methods return `Faker<string>` or `Faker<number>`, so temporal methods (`.year()`, `.past()`, etc.) are no longer available after them:

```typescript
// ✅ Correct — constrain first, format last
temporal().past(1, 'years').iso()

// ❌ Type error — .past() doesn't exist on Faker<string>
temporal().iso().past(1, 'years')
```
:::

---

## Mixins

### Bounded

```typescript
temporal().min(new Date('2020-01-01')).max(new Date('2025-12-31')).create();
temporal().between('2020-01-01', '2025-12-31').create();  // equivalent shorthand
```

### Excludable

```typescript
temporal().thisMonth().not(new Date('2026-05-01')).create();
```

### Nullable / Optional

```typescript
temporal().past(1, 'years').nullable().create();        // Date or null
temporal().future(30, 'days').optional().create();       // Date or undefined
temporal().past(1, 'years').nullable(0.3).create();     // 30% chance of null
```

### Seedable

```typescript
temporal().past(1, 'years').seed(42).create();   // always the same Date
```

---

## Errors

All temporal errors extend `StorymockError`. See [Errors](/guide/errors) for the full list.

| Error | When |
|---|---|
| `ContradictoryConstraintError` | `.min()` > `.max()`, `.between()` with start > end, impossible calendar constraint (Feb 31), `.after()` later than `.before()` |

[← Back to Faker API](/reference/faker)
