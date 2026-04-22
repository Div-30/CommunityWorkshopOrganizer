const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');

const filesToFix = [
  'pages/WorkshopReviewPage.jsx',
  'pages/WorkshopDetailsPage.jsx',
  'pages/UserManagementPage.jsx',
  'pages/NotificationsPage.jsx',
  'pages/ManagerDashboard.jsx',
  'pages/AttendeeManagementPage.jsx',
  'pages/AllWorkshopsPage.jsx',
  'components/shared/AttendeeRoster.jsx'
];

for (const relPath of filesToFix) {
  const fullPath = path.join(srcDir, relPath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Remove the import statement
    content = content.replace(/import\s+{([^}]+)}\s+from\s+['"](?:\.\.\/)+utils\/mockData['"];/g, '');
    
    // Replace MOCK_ constants with empty arrays or null
    content = content.replace(/MOCK_WORKSHOPS/g, '[]');
    content = content.replace(/MOCK_REGISTRATIONS/g, '[]');
    content = content.replace(/MOCK_USERS/g, '[]');
    content = content.replace(/MOCK_NOTIFICATIONS/g, '[]');
    content = content.replace(/MOCK_ACTIVITY/g, '[]');
    content = content.replace(/MOCK_ATTENDEES/g, '[]');
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Cleaned up ${relPath}`);
  }
}

// Finally delete mockData.js
const mockDataPath = path.join(srcDir, 'utils', 'mockData.js');
if (fs.existsSync(mockDataPath)) {
  fs.unlinkSync(mockDataPath);
  console.log('Deleted mockData.js');
}

console.log('Done!');
