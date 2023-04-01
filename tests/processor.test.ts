import { MarkdownProcessor } from "../src/MarkdownProcessor"
import { DefaultRenderer, MultiSeriesRenderer, SeriesRegistry } from "../src/options";

const orig_md = `
# a
foolbar

## a-b
foolbar

## a-c
foolbar
foolbar

### a-c-d
foolbar

\`\`\`
# hash tag inside code block is skipped
### skipped
\`\`\`

`

const expected_md = `
# 1. a
foolbar

## 1.1. a-b
foolbar

## 1.2. a-c
foolbar
foolbar

### 1.2.1. a-c-d
foolbar

\`\`\`
# hash tag inside code block is skipped
### skipped
\`\`\`

`

const processor = new MarkdownProcessor(new DefaultRenderer())

test('processor should output indexed markdown', () => {
    expect(processor.addIndex(orig_md)).toBe(expected_md);
});

test('processor should output un-indexed markdown', () => {
    expect(processor.removeIndex(expected_md)).toBe(orig_md);
});

