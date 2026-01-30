const fs = require('fs');
const path = require('path');

const servicesToUpdate = [
    'holidayService.js',
    'groupService.js',
    'floorService.js',
    'eventService.js',
    'currencyMasterService.js',
    'claimService.js',
    'cityService.js',
    'choreiMessageService.js',
    'categoryService.js',
    'loginDetailService.js',
    'locationService.js',
    'meetingRequestService.js',
    'noticeService.js',
    'policyService.js',
    'priorityService.js',
    'newsService.js',
    'photoGalleryService.js',
    'popupImageService.js',
    'quoteService.js',
    'roomService.js',
    'salesPricePolicyService.js',
    'sliderImageService.js',
    'wallService.js'
];

const servicesDir = path.join(__dirname, 'services');

servicesToUpdate.forEach(fileName => {
    const filePath = path.join(servicesDir, fileName);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace the old pagination pattern with the new one
    const oldPattern = /const offset = limit \? \(page - 1\) \* limit : null;/g;
    const newPattern = `const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;`;

    content = content.replace(oldPattern, newPattern);

    // Replace limit/offset in findAndCountAll
    content = content.replace(
        /limit: limit \? parseInt\(limit\) : null,\s*offset: offset \? parseInt\(offset\) : null/g,
        ''
    );

    // Add conditional limit/offset logic before findAndCountAll
    content = content.replace(
        /(const queryOptions = \{[^}]+\};)/s,
        `$1\n\n    if (limitNumber) {\n        queryOptions.limit = limitNumber;\n        queryOptions.offset = (pageNumber - 1) * limitNumber;\n    }`
    );

    // Convert inline findAndCountAll to use queryOptions
    content = content.replace(
        /return (\w+)\.findAndCountAll\(\{/g,
        'const queryOptions = {\n'
    );

    content = content.replace(
        /\}\);$/gm,
        '};\n\n    if (limitNumber) {\n        queryOptions.limit = limitNumber;\n        queryOptions.offset = (pageNumber - 1) * limitNumber;\n    }\n\n    return Model.findAndCountAll(queryOptions);'
    );

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated ${fileName}`);
});

console.log('\nAll services updated successfully!');
