import { DefaultRenderer, IndexRenderer, SeriesRegistry } from "./options"

export class MarkdownProcessor {
    renderer: IndexRenderer

    constructor(renderer: IndexRenderer) {
        this.renderer = renderer
    }

    private processHeaders(markdown: string, process: (line: string) => string): string {
        const indexedMarkdown = []
        let insideCodeBlock = false
        for (let line of markdown.split("\n")) {
            if (this.isCodeBlock(line)) {
                insideCodeBlock = !insideCodeBlock
                indexedMarkdown.push(line)
                continue
            }

            // skip headers inside code block and nonheader
            if (insideCodeBlock) {
                indexedMarkdown.push(line)
                continue
            }

            if (!this.isHeader(line)) {
                indexedMarkdown.push(line)
                continue
            }
            
            // header
            indexedMarkdown.push(process(line))
        }
        return indexedMarkdown.join("\n")
    }

    private isHeader(line: string): boolean {
        return /^#+\s/.test(line);
    }

    private isCodeBlock(line: string): boolean {
        return line.startsWith('```')
    }

    private parseHeader(header: string): [number, string] {
        if (!this.isHeader(header)) {
            return [undefined, undefined]
        }
        let level = 0
        while (level < header.length && header[level] == '#') {
            level++
        }
        const headerText = header.slice(level + 1, header.length).trim()
        return [level, headerText]
    }

    private renderHeaderIndex(index: number[]): string {
        return index.map((x) => x + '.').join("")
    }

    public addIndex(markdown: string): string {
        const generator = new IndexGenerator()
        return this.processHeaders(markdown, (line: string) => {
            const [level, header] = this.parseHeader(line)
            generator.updateIndex(level)

            const prefix = this.renderer.render(generator.currentIndex())
            if (prefix && !header.startsWith(prefix)) {
                return `${'#'.repeat(level)} ${prefix} ${header}`
            }

            // prefix already exists
            return line
        })
    }

    public removeIndex(markdown: string): string {
        const generator = new IndexGenerator()
        return this.processHeaders(markdown, (line: string) => {
            const [level, header] = this.parseHeader(line)
            generator.updateIndex(level)

            const prefix = this.renderer.render(generator.currentIndex())
            if (prefix && header.startsWith(prefix)) {
                // remove it
                return `${'#'.repeat(level)} ${header.slice(prefix.length, header.length).trim()}`
            }

            // no prefix
            return line
        })
    }

}

export class IndexGenerator {
    private index: number[]
    constructor() {
        this.index = new Array(12).fill(0)
    }

    public currentIndex(): number[] {
        for (let i = this.index.length - 1; i >= 0; i--) {
            if (this.index[i] !== 0) {
                return this.index.slice(0, i + 1)
            }
        }
        return [0]
    }

    public updateIndex(level: number): number[] {
        //console.log(`before update: [${level}] ${this.currentIndex()}`)
        this.index[level - 1]++
        this.index.fill(0, level, this.index.length)
        //console.log(`after update: [${level}] ${this.currentIndex()}`)
        return this.index.slice(0, level)
    }
}

