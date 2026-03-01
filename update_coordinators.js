const fs = require('fs');

const path = '/Users/saiprasadrao/Desktop/phoenix3.0/data/events.js';
let content = fs.readFileSync(path, 'utf8');

// The user may have updated one coordinator, let's just replace all coordinator: { ... } blocks with coordinator: [{ ... }]
// Wait, the structural replacement is easier with a regex.
// Regex to find `coordinator: {\n    name: "...",\n    phone: "..."\n  }`
// We will replace it with `coordinators: [\n    {\n      name: "...",\n      phone: "..."\n    }\n  ]`

content = content.replace(/coordinator:\s*\{\s*name:\s*"([^"]+)",\s*phone:\s*"([^"]+)"\s*\}/g, `coordinators: [\n    {\n      name: "$1",\n      phone: "$2"\n    }\n  ]`);

fs.writeFileSync(path, content, 'utf8');
