import { execSync } from 'child_process';
import fs from 'fs';

try {
  console.log('Running vite build...');
  const res = execSync('node node_modules/vite/bin/vite.js build', { encoding: 'utf8', stdio: 'pipe' });
  console.log('OUTPUT:', res);
  fs.writeFileSync('build_result.txt', 'SUCCESS:\n' + res);
} catch (err) {
  const errMsg = 'ERROR:\n' + (err.stdout || '') + '\n' + (err.stderr || '') + '\n' + err.message;
  console.error(errMsg);
  fs.writeFileSync('build_result.txt', errMsg);
}
