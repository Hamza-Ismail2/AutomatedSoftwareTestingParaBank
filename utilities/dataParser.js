import fs from 'fs';
import path from 'path';
import testData from '../data/testData.json';

export function loadTestData(filePath) {
  const resolvedPath = filePath ?? path.join(__dirname, '..', 'data', 'testData.json');
  const raw = fs.readFileSync(resolvedPath, 'utf-8');
  return JSON.parse(raw);
}

export const data = testData;

export function generateUniqueUsername(prefix = 'auto') {
  return `${prefix}_${Date.now()}`;
}

export function generateUniqueSsn() {
  const part1 = Math.floor(100 + Math.random() * 899);
  const part2 = Math.floor(10 + Math.random() * 89);
  const part3 = Math.floor(1000 + Math.random() * 8999);
  return `${part1}-${part2}-${part3}`;
}