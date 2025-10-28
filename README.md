# Groups Board

A realtime shared inbox dashboard built with Next.js App Router, Tailwind CSS, and Supabase.

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables by creating a `.env.local` file:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

   The app is available at http://localhost:3000.

## Testing

Run the Vitest suite:

```bash
npm test
```

## Manual QA checklist

- Seed the `groups_board_v1` view in Supabase with sample data and verify the board renders cards sorted by `last_message_at`.
- Toggle status filters and ensure the board reflects the selection instantly.
- Use the search field to filter conversations by subject.
- Confirm new rows inserted into the `groups` table appear in realtime without a page refresh.
- Click **Mark complete** to update a conversation; failures should revert optimistically and surface an alert.
- Validate that the UI remains usable with `prefers-reduced-motion` enabled.
