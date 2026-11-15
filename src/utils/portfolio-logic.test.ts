import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterProjects,
  validateContactForm,
  formatAcademicStatus,
  calculateMagneticOffset,
  calculateCardTilt,
  PROJECTS_DATA,
} from './portfolio-logic';

test('filterProjects returns all projects when category is all and search is empty', () => {
  const result = filterProjects(PROJECTS_DATA, 'all', '');
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'medconsults');
});

test('filterProjects filters by specific category', () => {
  const fullstackProjects = filterProjects(PROJECTS_DATA, 'fullstack', '');
  assert.equal(fullstackProjects.length, 1);
  assert.equal(fullstackProjects[0].id, 'medconsults');
});

test('filterProjects searches technology and title accurately', () => {
  const nodeMatches = filterProjects(PROJECTS_DATA, 'all', 'Node.js');
  assert.equal(nodeMatches.length, 1);
  assert.equal(nodeMatches[0].id, 'medconsults');

  const reactMatches = filterProjects(PROJECTS_DATA, 'all', 'React');
  assert.equal(reactMatches.length, 1);
});

test('validateContactForm rejects empty inputs', () => {
  const result = validateContactForm({ name: '', email: '', message: '' });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.name);
  assert.ok(result.errors.email);
  assert.ok(result.errors.message);
});

test('validateContactForm accepts valid submission', () => {
  const result = validateContactForm({
    name: 'Recruiter or Collaborator',
    email: 'recruiter@techcompany.com',
    message: 'Hello Tapas, we are interested in discussing your software engineering journey!',
  });
  assert.equal(result.isValid, true);
  assert.equal(Object.keys(result.errors).length, 0);
});

test('formatAcademicStatus formats university and CGPA accurately', () => {
  const status = formatAcademicStatus(2026, 6.95);
  assert.equal(
    status,
    'BSc Information Technology · University of Mumbai · CGPA 6.95'
  );
});

test('calculateMagneticOffset returns zero offset when cursor is at exact center', () => {
  const rect = { left: 100, top: 50, width: 80, height: 40 };
  // Center is (140, 70)
  const offset = calculateMagneticOffset(140, 70, rect, 0.4);
  assert.equal(offset.x, 0);
  assert.equal(offset.y, 0);
});

test('calculateMagneticOffset pulls towards cursor direction and clamps to maxOffset', () => {
  const rect = { left: 100, top: 50, width: 80, height: 40 };
  // Cursor to the right and down: (160, 80) => diff (+20, +10) * 0.4 => (8, 4)
  const offset = calculateMagneticOffset(160, 80, rect, 0.4, 15);
  assert.equal(offset.x, 8);
  assert.equal(offset.y, 4);

  // Far away cursor clamps to maxOffset
  const farOffset = calculateMagneticOffset(300, 200, rect, 0.5, 12);
  assert.equal(farOffset.x, 12);
  assert.equal(farOffset.y, 12);
});

test('calculateCardTilt computes correct directional tilt', () => {
  const rect = { left: 100, top: 100, width: 200, height: 200 };
  // Center (200, 200) -> 0 tilt
  const centerTilt = calculateCardTilt(200, 200, rect, 10);
  assert.equal(centerTilt.rotateX, 0);
  assert.equal(centerTilt.rotateY, 0);

  // Top-left corner (100, 100) -> positive rotateX, negative rotateY
  const topLeftTilt = calculateCardTilt(100, 100, rect, 10);
  assert.equal(topLeftTilt.rotateX, 10);
  assert.equal(topLeftTilt.rotateY, -10);
});
