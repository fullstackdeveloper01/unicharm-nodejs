const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'wallService.js',
    'sliderImageService.js',
    'salesPricePolicyService.js',
    'quoteService.js',
    'policyService.js',
    'popupImageService.js',
    'photoGalleryService.js',
    'noticeService.js',
    'newsService.js',
    'holidayService.js',
    'eventService.js',
    'choreiMessageService.js'
];

const servicesDir = path.join(__dirname, 'services');

console.log('Starting pagination refactoring...\n');

filesToUpdate.forEach(fileName => {
    const filePath = path.join(servicesDir, fileName);

    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Step 1: Replace the offset calculation
        content = content.replace(
            /const offset = limit \? \(page - 1\) \* limit : null;/g,
            `const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;`
        );

        // Step 2: Find and replace the findAndCountAll pattern
        // This regex captures the entire findAndCountAll call
        const findAndCountAllRegex = /(return (?:await )?[\w.]+\.findAndCountAll\(\{[\s\S]*?)(limit: limit \? parseInt\(limit\) : null,\s*offset: offset \? parseInt\(offset\) : null)([\s\S]*?\}\);)/g;

        content = content.replace(findAndCountAllRegex, (match, before, limitOffset, after) => {
            // Remove the limit/offset lines and restructure
            const cleaned = before.trim();
            const afterCleaned = after.trim();

            // Extract the content between { and }
            const optionsMatch = cleaned.match(/findAndCountAll\(\{([\s\S]*)/);
            if (!optionsMatch) return match;

            const options = optionsMatch[1].trim();

            return `const queryOptions = {
        ${options}${afterCleaned.replace(/\}\);$/, '')}
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return await Model.findAndCountAll(queryOptions);`;
        });

        // Step 3: Fix the Model name (replace generic Model with actual model)
        // This is a bit tricky, we need to find the actual model name from the file
        const modelMatch = content.match(/const \{ (\w+)(?:,|\s|\})/) || content.match(/require\('\.\.\/models'\);\s*const \{ (\w+)/);
        if (modelMatch) {
            const actualModel = modelMatch[1];
            content = content.replace(/return await Model\.findAndCountAll/g, `return await ${actualModel}.findAndCountAll`);
        }

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated ${fileName}`);
    } catch (error) {
        console.error(`❌ Error updating ${fileName}:`, error.message);
    }
});

console.log('\n✨ Pagination refactoring complete!');
