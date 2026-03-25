/**
 * db.js — Simple JSON file database
 * Reads/writes to data/*.json files
 * Atomic writes prevent corruption on crash
 */

const fs   = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Get the file path for a collection
 */
function filePath(collection) {
  return path.join(DATA_DIR, `${collection}.json`);
}

/**
 * Read all records from a collection
 * Returns [] if collection doesn't exist yet
 */
function readAll(collection) {
  const fp = filePath(collection);
  if (!fs.existsSync(fp)) return [];
  try {
    const raw = fs.readFileSync(fp, 'utf8');
    return JSON.parse(raw);
  } catch (_) {
    return [];
  }
}

/**
 * Write all records to a collection (atomic — writes to temp then renames)
 */
function writeAll(collection, records) {
  const fp  = filePath(collection);
  const tmp = fp + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(records, null, 2), 'utf8');
  fs.renameSync(tmp, fp);
}

/**
 * Find one record by id
 */
function findById(collection, id) {
  return readAll(collection).find(r => r.id === id) || null;
}

/**
 * Insert a record — id must already be set
 */
function insert(collection, record) {
  const records = readAll(collection);
  records.unshift(record); // newest first
  writeAll(collection, records);
  return record;
}

/**
 * Update a record by id — merges fields
 */
function update(collection, id, fields) {
  const records = readAll(collection);
  const idx     = records.findIndex(r => r.id === id);
  if (idx === -1) return null;
  records[idx] = { ...records[idx], ...fields, id, updated_at: new Date().toISOString() };
  writeAll(collection, records);
  return records[idx];
}

/**
 * Delete a record by id
 */
function remove(collection, id) {
  const records = readAll(collection);
  const exists  = records.some(r => r.id === id);
  if (!exists) return false;
  writeAll(collection, records.filter(r => r.id !== id));
  return true;
}

/**
 * Count records in a collection
 */
function count(collection) {
  return readAll(collection).length;
}

module.exports = { readAll, writeAll, findById, insert, update, remove, count };