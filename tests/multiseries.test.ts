import { MarkdownProcessor } from "../src/MarkdownProcessor"
import { MultiSeriesRenderer, SeriesRegistry } from "../src/options"

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

# b

blabla

## bb

\`\`\`
# hash tag inside code block is skipped
### skipped
\`\`\`

`

const expected_cn_md = `
# 一、 a
foolbar

## 1.1. a-b
foolbar

## 1.2. a-c
foolbar
foolbar

### 1.2.1. a-c-d
foolbar

# 二、 b

blabla

## 2.1. bb

\`\`\`
# hash tag inside code block is skipped
### skipped
\`\`\`

`

const expected_cn_md2 = `
# 第一章 a
foolbar

## 1.1. a-b
foolbar

## 1.2. a-c
foolbar
foolbar

### 1.2.1. a-c-d
foolbar

# 第二章 b

blabla

## 2.1. bb

\`\`\`
# hash tag inside code block is skipped
### skipped
\`\`\`

`

const cn_renderer = new MultiSeriesRenderer(new SeriesRegistry(), new Map([
    [1, '{chinese}、']
]))
const cn_processor = new MarkdownProcessor(cn_renderer)

test('should output first level index in chinese', () => {
    expect(cn_processor.addIndex(orig_md)).toBe(expected_cn_md)
})

test('should remove the chinese index', () => {
    expect(cn_processor.removeIndex(expected_cn_md)).toBe(orig_md)
})

const chapterRenderer = new MultiSeriesRenderer(new SeriesRegistry(), new Map([
    [1, '第{chinese}章']
]))
const cn_processor2 = new MarkdownProcessor(chapterRenderer)

test('should output chapter number', () => {
    expect(cn_processor2.addIndex(orig_md)).toBe(expected_cn_md2)
})
test('should remove chapter number', () => {
    expect(cn_processor2.removeIndex(expected_cn_md2)).toBe(orig_md)
})