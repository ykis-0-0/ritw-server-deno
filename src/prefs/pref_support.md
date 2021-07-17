# How to add pref support
1. Define its schema and default values (if any) in it's own directory e.g. `/src/[module | whatever/module | etc.]/prefs`
  - `schema.ts`
  - `defaults.ts`
2. Add entries to files in `/src/prefs/`:
  - `TheSchema` in `schemata.ts`
  - `import` to `const defaults` in `defaults.ts`
  - `const configs` in `config.ts`