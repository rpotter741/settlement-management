# To Do

## Features

## Debt

1. Create middleware that tracks when a new node is created.
   - It should monitor `Name` and `open` states. If either changes, intercept via the middleware and dispatch another action to get the SmartLink Sync running. Might also just ... open the thing initially. Doesn't have to be an exact clone of VS code.

## Not Debt but kind of

1. Create schemaless property assignment on entries, so they can individually track without doing a whole subtype change, which would be a huge point of friction. Allow modal to either A) link existing property, or B) define `temporary` property. Eventually, temp properties could be `saved` as real ones. Eventually, `schemaless` properties could be merged into a new version of the subtype the properties are technically being appended to. Add new column in `glossary_entry` table called `temp_properties`. **Possibly allow creation of new group if group count less than 5???** They'll have a shape like this:

```rust
pub struct TempProperty {
   pub id: String,
   pub group_id: String,
   pub clone_id: Option<String> // points to a normalized property, if there is one
   pub property: SubTypeProperty,
}

// extend glossary_entry like this...
pub struct GlossaryEntry {
   ...
   pub temp_properties: HashMap<String(group_id), Vec<TempProperty>>
   ...
}

```

This way, render order is determined by insertion order of the TempProperty vec. Eventually add a toggle to have temp properties be displayed before or after. Or even get absolutely unhinged and let both be composed, 1 by 1, into a list of ids for rendering. But that's more than I want to do right now! haha

2. Create `Projection` flag on compound property. Automatically forces the left-side of the compound to be a link to entry type. The right side can be whatever (no entry type dropdown). Then, outgoing links get the `projection` backlink type, which automatically turns on `target_ignore` so it does crowd the sync workspace. "Projected" properties appear as sort of 'statuses' on the entries they're linked to, and are easy to render via the backlink index.

3. Glossary Entry Integration State -- what is it? What's it used for? How do I express that cleanly? LEt's finger it out!
