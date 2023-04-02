#!/usr/bin/env node
import * as fs from 'fs';
import getStdin from 'get-stdin';
import * as commander from 'commander';
import { ArraySeries, DefaultRenderer, IndexRenderer, MultiSeriesRenderer, Series, SeriesRegistry, ShiftedIndexRender } from './options.js';
import { MarkdownProcessor } from './MarkdownProcessor.js';

const program = new commander.Command()
program
    .argument('<input_file>', 'markdown file to convert')
    .argument('[output_file]', 'output file')
    .option("-s, --series_file <value>", "series file")
    .option("-p, --pattern_file <value>", "pattern_file")
    .option("-k, --skip <value>", "skip first k headers")
    .option("-r, --remove", "remove index")
    .parse(process.argv)
program.parse()

function readJsonFile(filePath: string): any {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading JSON file ${filePath}: ${err}`);
        throw new Error(`error reading ${filePath} as a json file`)
    }
}

function loadPatterns(patternFile: string): Map<number, string> {
    let json = readJsonFile(patternFile)
    let pattern = new Map<number, string>()
    for (let level in json) {
        if (typeof level === "number" || !isNaN(parseInt(level))) {
            if (typeof json[level] === "string") {
                pattern.set(Number(level), json[level])
            }
        }
    }
    return pattern
}

function loadSeries(seriesFile: string): Map<string, Series> {
    let json = readJsonFile(seriesFile)
    let seriesMap: Map<string, Series> = new Map()
    for (let name in json) {
        seriesMap.set(name, new ArraySeries(json[name]))
    }
    return seriesMap
}

const opts = program.opts()
const args = program.args
const input_file = args[0]
const output_file = args[1]
const seriesRegistry = new SeriesRegistry()
let renderer: IndexRenderer = new DefaultRenderer();

// load series and add to registry
if (opts.series_file) {
    const seriesMap = loadSeries(opts.series_file)
    seriesMap.forEach((v, k) => {
        seriesRegistry.addSeries(k, v)
    })
}

// load patterns
if (opts.pattern_file) {
    const patterns = loadPatterns(opts.pattern_file)
    console.log(patterns)
    renderer = new MultiSeriesRenderer(seriesRegistry, patterns)
}

// whether to skip the h1
if (opts.skip) {
    renderer = new ShiftedIndexRender(opts.skip, renderer)
}

const processor = new MarkdownProcessor(renderer)

async function main() {
    let markdown: string;

    if (input_file === '-') {
        markdown = await getStdin()
    } else {
        markdown = fs.readFileSync(input_file, 'utf8');
    }

    let output: string;
    if (opts.remove) {
        output = processor.removeIndex(markdown)
    } else {
        output = processor.addIndex(markdown)
    }
    if (args[1]) {
        fs.writeFileSync(output_file, output)
    } else {
        // write to console
        console.log(output)
    }
}

main()