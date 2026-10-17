// Explicit, repeatable import. Reads the source database without modifying it.
import {DatabaseSync} from 'node:sqlite';
import {writeFileSync,mkdirSync} from 'node:fs';
const db=new DatabaseSync(process.argv[2],{readOnly:true});
const tables=['contracts','facilities','contractors','operators','shifts','complaints','cpq_requests'];
const snapshot=Object.fromEntries(tables.map(t=>[t,db.prepare(`SELECT * FROM ${t}`).all()]));
// No personal identifiers, contact numbers, access PINs or old QR secrets enter Git.
for(const r of snapshot.operators){delete r.iin;delete r.kaspi_phone;delete r.balance;}
for(const r of snapshot.contractors){delete r.bin_iin;delete r.phone;delete r.balance;}
for(const r of snapshot.facilities){delete r.entry_pin;delete r.qr_code;delete r.nfc_uid;delete r.short_code;}
for(const r of snapshot.contracts){delete r.bin;r.notes=r.notes?.replace(' Скрытая инъекция на стр. 6.','');}
for(const r of snapshot.complaints)delete r.photo_url; // Stock images are not evidence.
mkdirSync('ic-hub/fixtures',{recursive:true});
writeFileSync('ic-hub/fixtures/legacy-demo.json',JSON.stringify(snapshot,null,2)+'\n');
console.log(Object.fromEntries(tables.map(t=>[t,snapshot[t].length])));
