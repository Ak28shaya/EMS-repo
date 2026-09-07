const test = require('node:test');
const assert = require('node:assert/strict');

const {
  normalizePermissions,
  permissionMatchesModule,
} = require('../utils/rolePermissionUtils');

test('normalizePermissions keeps action strings and module keys together', () => {
  const result = normalizePermissions([
    'employee:view',
    'dashboard',
    'employee:edit',
    'role',
    'role:delete',
    'dashboard',
  ]);

  assert.deepEqual(result, ['employee:view', 'employee', 'dashboard', 'employee:edit', 'role', 'role:delete']);
});

test('permissionMatchesModule treats action strings as the module they belong to', () => {
  assert.equal(permissionMatchesModule('employee:view', 'employee'), true);
  assert.equal(permissionMatchesModule('role:delete', 'role'), true);
  assert.equal(permissionMatchesModule('employee:view', 'dashboard'), false);
});
