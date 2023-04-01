import * as roman from "roman-numbers"
import * as nzhcn from "nzh/cn"


interface Series {
    get(num: number): string;
}

export class NumberSeries implements Series {
    get(num: number): string {
        return num.toString()
    }
}

export class ChineseSeries implements Series {
    get(num: number): string {
        return nzhcn.encodeS(num)
    }
}

export class CircleNumberSeries implements Series {
    get(num: number): string {
        const symbols = ['⓪', '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳']
        if (num >= 0 && num <= 20) {
            return symbols[num]
        }
        const s = num.toString()
        return num.toString().split("").map((n) => symbols[n]).join("")
    }
}

export class RomanSeries implements Series {
    get(num: number): string {
        if (num == 0) {
            console.log('there is no zero in roman digits')
            return '0'
        }
        return roman.arabToRoman(num)
    }

}

export class SeriesRegistry {
    readonly registry: Map<string, Series> = new Map()

    constructor() {
        this.addSeries('num', new NumberSeries())
        this.addSeries('roman', new RomanSeries())
        this.addSeries('chinese', new ChineseSeries())
        this.addSeries('circle_num', new CircleNumberSeries())
    }

    public addSeries(name: string, series: Series) {
        this.registry[name] = series
    }

    public isPatternValid(pattern: string): boolean {
        const seriesRegex = /\{\w+\}/g
        let match
        while ((match = seriesRegex.exec(pattern)) !== null) {
            if (!(match[1].trim() in this.registry)) {
                return false
            }
        }
        return true
    }
}

export interface IndexRenderer {
    patterns: Map<number, string>
    render(index: number[]): string;
}

export class DefaultRenderer implements IndexRenderer {
    public patterns: Map<number, string>;
    public render(index: number[]): string {
        return index.join('.') + '.'
    }
}

function replaceString(str: string, start: number, end: number, replacement: string): string {
    return str.slice(0, start) + replacement + str.slice(end);
}

export class MultiSeriesRenderer implements IndexRenderer {
    patterns: Map<number, string>;
    seriesRegistry: SeriesRegistry;
    constructor(seriesRegistry: SeriesRegistry, headerPatterns: Map<number, string>) {
        this.patterns = headerPatterns
        this.seriesRegistry = seriesRegistry
    }
    render(index: number[]): string {
        const pattern = this.patterns.get(index.length)
        if (!pattern) {
            return new DefaultRenderer().render(index)
        }
        const seriesRegex = /\{\s*(\w+)\s*\}/g
        let match
        let level = 1
        let rendered = ""
        let idxToProcess = 0    // last unprocessed string index in pattern
        while ((match = seriesRegex.exec(pattern)) !== null) {
            const seriesName = match[1]
            const seriesStart = match.index
            const seriesEnd = seriesStart + match[0].length
            if (level-1 >= index.length) {
                // TODO throw something
            }
            
            const number = this.seriesRegistry.registry[seriesName].get(index[level-1])
            // put the digit in pattern
            rendered += pattern.slice(idxToProcess, seriesStart) + number
            idxToProcess = seriesEnd
            level++
        }
        if (idxToProcess < pattern.length) {
            rendered += pattern.slice(idxToProcess)
        }
        return rendered
    }

}