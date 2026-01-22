const photoGalleryService = require('./services/photoGalleryService');

async function testGallery() {
    try {
        const result = await photoGalleryService.createPhotoGallery({
            Title: 'Test Gallery',
            MainImage: 'test.jpg',
            AdditionalImages: ['a.jpg', 'b.jpg']
        });
        console.log('Created:', JSON.stringify(result, null, 2));
    } catch (e) {
        console.error('Error:', e);
    }
}
testGallery();
