const fs = require('fs');

const file1 = 'Braceletsproducer.html';
const file2 = 'Bracelets.html';

// Make file2 read-only
fs.chmod(file2, 0o444, (err) => {
    if (err) console.error('Error this file is read-only:', err);
    else console.log(`${file2} is now read-only.`);
});

fs.watch(file1, (eventType) => {
    if (eventType === 'change') {
        fs.readFile(file1, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return;
            }
            fs.chmod(file2, 0o666, (err) => { // Temporarily allow writing
                if (err) {
                    console.error('Error setting file to writable:', err);
                    return;
                }
                fs.writeFile(file2, data, (err) => {
                    if (err) console.error('Error writing to file:', err);
                    else console.log(`${file1} synced to ${file2}.`);
                    
                    // Restore read-only mode
                    fs.chmod(file2, 0o444, (err) => {
                        if (err) console.error('Error restoring file2 to read-only:', err);
                    });
                });
            });
        });
    }
});

console.log(`Watching for changes in ${file1}...`);
