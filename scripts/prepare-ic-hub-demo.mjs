import {mkdirSync,writeFileSync} from 'node:fs';
import {accountDemoSQL} from '../ic-hub/demo-accounts.mjs';
mkdirSync('work',{recursive:true});
writeFileSync('work/ic-hub-demo-accounts.sql',accountDemoSQL());
console.log('Prepared work/ic-hub-demo-accounts.sql. Existing records will not be overwritten.');
