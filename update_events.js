const fs = require('fs');

const path = '/Users/saiprasadrao/Desktop/phoenix3.0/data/events.js';
let content = fs.readFileSync(path, 'utf8');

// I will just do a string replacement to add the property.
// Adding it after the sheetId line seems simple.

content = content.replace(/sheetId: "([^"]+)"\n}/g, `sheetId: "$1",\n  coordinator: {\n    name: "Jane Doe",\n    phone: "919000000000"\n  }\n}`);

fs.writeFileSync(path, content, 'utf8');
