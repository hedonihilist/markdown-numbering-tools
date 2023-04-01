#!/usr/bin/env node
import * as fs from 'fs';
import * as commander from 'commander';
import { DefaultRenderer, MultiSeriesRenderer, SeriesRegistry } from './options';
import { MarkdownProcessor } from './MarkdownProcessor';

const program = new commander.Command()
program
    .argument('<input_file>', 'markdown file to convert')
    .argument('[output_file]', 'output file')
    .option("-s, --series_file <value>", "series file")
    .option("-p, --pattern_file <value>", "pattern_file")
    .parse(process.argv)
program.parse()

const opts = program.opts()
const args = program.args
const input_file = args[0]
const output_file = args[1]
const seriesRegistry = new SeriesRegistry()
const processor = new MarkdownProcessor(new DefaultRenderer())

let markdown = fs.readFileSync(input_file, 'utf8');
const output = processor.addIndex(markdown)
if (args[1]) {
    fs.writeFileSync(output_file, output)
} else {
    // write to console
    console.log(output)
}