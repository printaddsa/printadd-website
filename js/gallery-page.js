document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('projectGallery');
    const config = window.projectGalleryConfig;

    if (!gallery || !config) return;

    function appendGalleryImage(src, alt, loading = 'lazy') {
        const link = document.createElement('a');
        link.href = src;
        link.className = 'hardcover-gallery-item';
        link.target = '_blank';
        link.rel = 'noopener';

        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.loading = loading;

        link.appendChild(img);
        gallery.appendChild(link);
    }

    config.groups.forEach((group) => {
        for (let index = 1; index <= group.count; index += 1) {
            const paddedIndex = String(index).padStart(group.pad || 3, '0');
            appendGalleryImage(
                `${group.path}/${group.prefix}-${paddedIndex}.${group.ext || 'jpg'}`,
                `${group.alt} - نموذج ${index}`,
                index <= 8 ? 'eager' : 'lazy'
            );
        }
    });
});
