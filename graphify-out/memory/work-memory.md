
## 2026-07-27: Prettier 62 playground files

Prettier applied to 62 minified 9-line playground JSX files (grep pattern `^const App=`). 26 already multi-line files untouched. Files formatted in:
`/Users/yoga/Developer/Personal/Scratch/scratch-gui/scratch-gui/src/playground/*.jsx`

## 2026-07-27: Scratchblocks syntax untuk operator blocks

Agar operator (`and`, `or`) render sebagai **green diamond block** (bukan text block):
- `{<<> and <>>}` → green `and` operator with 2 empty diamond slots
- `{<<> or <>>}` → green `or` operator with 2 empty diamond slots
- `{<not <condition>>}` → green `not` operator wrapping condition
- Format: `<<condition1> and <condition2>>` untuk full usage

File referensi: `operator-logic-drawer-content.jsx:9`, `condition-drawer-content.jsx:15`

## 2026-07-27: Starter variable pattern (counter)

Template untuk starter variable:

```javascript
// 1. Variable definition → Stage (global variable, bukan sprite-local)
// di Stage target:
variables: {
    [id]: ["[displayName]", initialValue],
}

// 2. Monitor (biar visible di stage)
monitors: [
    {
        id: "[id]",         // same as variable ID
        opcode: "data_variable",
        params: { VARIABLE: "[id]" },
        mode: "default",
        value: "[initialValue]",
        x: 100,
        y: 100,
        visible: true,      // true = tampak sejak awal
    },
],

// 3. Block `set [variable] to (value)` di starter code
"block-X": {
    opcode: "data_setvariableto",
    next: null,
    parent: "block-X-1",
    inputs: { VALUE: [1, [4, initialValue]] },
    fields: { VARIABLE: ["[id]", "[id]"] },
    shadow: false,
    topLevel: false,
}

// 4. visibleCategories → tambah "variables" (kalo belum ada)
```
