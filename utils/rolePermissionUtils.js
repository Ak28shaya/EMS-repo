const normalizePermissions = (value) => {
  if (!Array.isArray(value)) return [];

  const seen = new Set();
  const normalized = [];

  for (const permission of value) {
    if (permission === undefined || permission === null) continue;

    const raw = String(permission).trim();
    if (!raw) continue;

    const normalizedPermission = raw.replace(/\s+/g, "");
    const moduleName = normalizedPermission.includes(":")
      ? normalizedPermission.split(":")[0]
      : normalizedPermission;

    if (!seen.has(normalizedPermission)) {
      normalized.push(normalizedPermission);
      seen.add(normalizedPermission);
    }

    if (moduleName && !seen.has(moduleName)) {
      normalized.push(moduleName);
      seen.add(moduleName);
    }
  }

  return normalized;
};

const permissionMatchesModule = (permission, moduleName) => {
  if (!permission || !moduleName) return false;
  const value = String(permission).trim();
  const target = String(moduleName).trim().toLowerCase();
  if (!value || !target) return false;
  if (value.toLowerCase() === target) return true;
  return value.toLowerCase().startsWith(`${target}:`);
};

module.exports = {
  normalizePermissions,
  permissionMatchesModule,
};
