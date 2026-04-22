const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'backend', 'CommunityWorkshopOrganizer');

function renameInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const newContent = content
        .replace(/Organiser/g, 'Organizer')
        .replace(/organiser/g, 'organizer');
    
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated content in ${filePath}`);
    }
}

function traverseAndProcess(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file === 'bin' || file === 'obj') continue;
            traverseAndProcess(fullPath);
        } else if (fullPath.endsWith('.cs')) {
            renameInFile(fullPath);
            
            // Rename file if necessary
            if (file.includes('Organiser') || file.includes('organiser')) {
                const newName = file.replace(/Organiser/g, 'Organizer').replace(/organiser/g, 'organizer');
                const newFullPath = path.join(dir, newName);
                fs.renameSync(fullPath, newFullPath);
                console.log(`Renamed file ${file} to ${newName}`);
            }
        }
    }
}

traverseAndProcess(directoryPath);
console.log('Done!');
