#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const markerPrefixes = ['<<<<<<<', '=======', '>>>>>>>'];

const trackedFiles = execSync('git ls-files', { encoding: 'utf8' })
  .split('\n')
  .map((file) => file.trim())
  .filter(Boolean);

const conflicts = [];

for (const file of trackedFiles) {
  const content = readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (markerPrefixes.some((prefix) => line.startsWith(prefix))) {
      conflicts.push({ file, line: index + 1, marker: line.slice(0, 8).trim() });
    }
  });
}

if (conflicts.length > 0) {
  console.error('Merge conflict markers detected:');
  for (const conflict of conflicts) {
    console.error(`  ${conflict.file}:${conflict.line} -> ${conflict.marker}`);
  }
  process.exit(1);
}

console.log('No merge conflict markers found in tracked files.');
