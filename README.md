This is a small library designed to integrate StarbaseDB with the Drizzle ORM.

## Usage

Install

```
npm install drizzle-starbase
```

Use

```typescript
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { drizzle } from "drizzle-orm/sqlite-proxy";
import { starbase } from "drizzle-starbase";

const db = drizzle(
  ...starbase("https://your-url-here.workers.dev", "api-token")
);

const user = sqliteTable("users", {
  id: int("id"),
  name: text("name"),
});

db.insert(user).values({ id: 1, name: "From StarbaseDB" }),
```
