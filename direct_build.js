import * as vite from 'vite';
import fs from 'fs';

console.log('Starting JS API Vite build...');
try {
  const result = await vite.build();
  fs.writeFileSync('build_result.txt', 'BUILD SUCCESSFUL!');
  console.log('BUILD SUCCESSFUL!');
} catch (err) {
  const errMsg = 'BUILD ERROR: ' + (err.stack || err.message || err);
  fs.writeFileSync('build_result.txt', errMsg);
  console.error(errMsg);
}
