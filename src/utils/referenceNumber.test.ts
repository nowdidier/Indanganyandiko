import test from 'node:test';
import assert from 'node:assert/strict';
import { generateReferenceNumber, validatePattern, previewPattern } from './referenceNumber';

test('generates standard government reference number pattern', () => {
  const pattern = 'RW-MINALOC/[DEPT]/[YEAR]/[SEQ:4]';
  const ref = generateReferenceNumber(pattern, {
    orgCode: 'MINALOC',
    deptCode: 'TERR',
    docType: 'incoming',
    sequence: 7,
    year: 2026,
  });
  assert.equal(ref, 'RW-MINALOC/TERR/2026/0007');
});

test('generates hospital health records reference number pattern', () => {
  const pattern = '[ORG]/[DEPT]/[CAT]/[YEAR]/[SEQ:5]';
  const ref = generateReferenceNumber(pattern, {
    orgCode: 'KFH',
    deptCode: 'MED',
    catCode: 'CLINIC',
    docType: 'outgoing',
    sequence: 128,
    year: 2026,
  });
  assert.equal(ref, 'KFH/MED/CLINIC/2026/00128');
});

test('supports [TYPE], [YY], and [MONTH] tokens', () => {
  const pattern = '[ORG]/[TYPE]/[YY][MONTH]/[SEQ:3]';
  const ref = generateReferenceNumber(pattern, {
    orgCode: 'OXFAM',
    deptCode: 'FIN',
    docType: 'internal',
    sequence: 5,
    year: 2026,
    month: 11,
  });
  assert.equal(ref, 'OXFAM/MEMO/2611/005');
});

test('pattern validation flags patterns without sequence token', () => {
  assert.equal(validatePattern('RW/MINALOC/DOC').valid, false);
  assert.equal(validatePattern('RW/[DEPT]/[SEQ:4]').valid, true);
  assert.equal(validatePattern('').valid, false);
});

test('preview helper returns deterministic preview', () => {
  const preview = previewPattern('[ORG]/[DEPT]/[YEAR]/[SEQ:4]', 'TEST', 'HR');
  assert.equal(preview, 'TEST/HR/2026/0042');
});
