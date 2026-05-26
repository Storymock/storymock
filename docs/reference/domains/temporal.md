---
description: API reference for temporal() — generate dates, timestamps, and formatted time strings.
---
# temporal()

Creates a `TemporalFaker`. Default: random date in `[10 years ago, 10 years from now]`.

**Mixins:** Bounded, Excludable, Nullable, Seedable

## Relative Methods

| Method | Description | Example |
|---|---|---|
| `.today()` | Today (time zeroed) | `temporal().today()` |
| `.yesterday()` | Yesterday | `temporal().yesterday()` |
| `.tomorrow()` | Tomorrow | `temporal().tomorrow()` |
| `.past(years?)` | Random past date (default: 1yr) | `temporal().past(5)` |
| `.future(years?)` | Random future date (default: 1yr) | `temporal().future(2)` |
| `.recent(days?)` | Recent past (default: 1 day) | `temporal().recent()` |
| `.soon(days?)` | Near future (default: 1 day) | `temporal().soon(3)` |
| `.daysAgo(n)` | Exactly N days ago | `temporal().daysAgo(7)` |
| `.daysFromNow(n)` | Exactly N days ahead | `temporal().daysFromNow(30)` |
| `.weeksAgo(n)` | N weeks ago | `temporal().weeksAgo(2)` |
| `.weeksFromNow(n)` | N weeks ahead | `temporal().weeksFromNow(1)` |
| `.monthsAgo(n)` | N months ago | `temporal().monthsAgo(6)` |
| `.monthsFromNow(n)` | N months ahead | `temporal().monthsFromNow(3)` |
| `.yearsAgo(n)` | N years ago | `temporal().yearsAgo(5)` |
| `.yearsFromNow(n)` | N years ahead | `temporal().yearsFromNow(2)` |

## Absolute Methods

| Method | Description | Example |
|---|---|---|
| `.year(y)` | Constrain year (accepts faker) | `temporal().year(2024)` |
| `.month(m)` | Constrain month (name or 1–12) | `temporal().month('january')` |
| `.day(d)` | Constrain day of month | `temporal().day(15)` |
| `.weekday(d)` | Constrain to weekday | `temporal().weekday('monday')` |
| `.hour(h)` | Constrain hour (0–23) | `temporal().hour(9)` |
| `.minute(m)` | Constrain minute (0–59) | `temporal().minute(30)` |
| `.second(s)` | Constrain second (0–59) | `temporal().second(0)` |

Absolute constraints compose: `temporal().year(2024).weekday('monday')` generates a random Monday in 2024.

Accepts fakers: `temporal().year(numeric().min(2020).max(2025))` picks a random year first, then a date in it.

## Range Methods

| Method | Description | Example |
|---|---|---|
| `.between(start, end)` | Date in range | `temporal().between('2020-01-01', '2024-12-31')` |
| `.before(d)` | Before a date | `temporal().before('2025-01-01')` |
| `.after(d)` | After a date | `temporal().after('2020-01-01')` |
| `.thisWeek()` | Within current week | `temporal().thisWeek()` |
| `.thisMonth()` | Within current month | `temporal().thisMonth()` |
| `.thisYear()` | Within current year | `temporal().thisYear()` |
| `.lastWeek()` | Previous week | `temporal().lastWeek()` |
| `.lastMonth()` | Previous month | `temporal().lastMonth()` |
| `.lastYear()` | Previous year | `temporal().lastYear()` |
| `.nextWeek()` | Next week | `temporal().nextWeek()` |
| `.nextMonth()` | Next month | `temporal().nextMonth()` |
| `.nextYear()` | Next year | `temporal().nextYear()` |

## Format (changes return type)

| Method | Returns | Example |
|---|---|---|
| `.iso()` | `Faker<string>` | `temporal().today().iso()` → `"2026-05-27T..."` |
| `.timestamp()` | `Faker<number>` | `temporal().today().timestamp()` |
| `.format(fmt)` | `Faker<string>` | `temporal().format('YYYY-MM-DD')` |

[← Back to Faker API](/reference/faker)
