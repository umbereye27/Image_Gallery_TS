interface PicsumImage {
    id: string;
    author: string;
    width: number;
    height: number;
    url: string;
    download_url: string;
}

interface GalleryImage {
    id: string;
    fullUrl: string;
    thumbUrl: string;
    author: string;
}

let images: GalleryImage[] = [];
let currentIndex: number = 0;


const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image') as HTMLImageElement;
const lightboxAuthor = document.getElementById('lightbox-author');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const closeBtn = document.getElementById('close-btn');

// Initialize the gallery
async function initGallery() {
    try {
        await fetchImages();
        renderGallery();
        setupEventListeners();
    } catch (error) {
        console.error('Failed to initialize gallery:', error);
        if (gallery) {
            gallery.innerHTML = '<p class="error">Failed to load images. Please try again later.</p>';
        }
    }
}

// Fetch images 
async function fetchImages() {
    try {
        const response = await fetch('https://picsum.photos/v2/list?page=1&limit=20');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: PicsumImage[] = await response.json();
        images = data.map(item => ({
            id: item.id,
            fullUrl: `https://picsum.photos/id/${item.id}/800/600`,
            thumbUrl: `https://picsum.photos/id/${item.id}/200/150`,
            author: `By: ${item.author}`
        }));
    } catch (error) {
        console.error('Error fetching images:', error);
        throw error;
    }
}

function renderGallery() {
    if (!gallery) return;
    
    images.forEach((image, index) => {
        const thumbnailElement = document.createElement('div');
        thumbnailElement.className = 'thumbnail';
        thumbnailElement.dataset.index = index.toString();
        
        const imgElement = document.createElement('img');
        imgElement.src = image.thumbUrl;
        thumbnailElement.appendChild(imgElement);
        gallery.appendChild(thumbnailElement);
    });
}

// Set up event listeners
function setupEventListeners() {
    gallery?.addEventListener('click', handleThumbnailClick); 
    prevBtn?.addEventListener('click', () => navigateImage(-1));
    nextBtn?.addEventListener('click', () => navigateImage(1));
    closeBtn?.addEventListener('click', closeLightbox);
    lightbox?.addEventListener('click', handleLightboxClick);
    document.addEventListener('keydown', handleKeyPress);
}
function handleThumbnailClick(event: Event) {
    const target = event.target as HTMLElement;
    const thumbnail = target.closest('.thumbnail') as HTMLElement;
    
    if (thumbnail) {
        const index = parseInt(thumbnail.dataset.index || '0', 10);
        openLightbox(index);
    }
}

function handleLightboxClick(event: Event) {
    if (event.target === lightbox) {
        closeLightbox();
    }
}
function handleKeyPress(event: KeyboardEvent) {
    if (!lightbox?.classList.contains('active')) return;
    
    switch (event.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            navigateImage(-1);
            break;
        case 'ArrowRight':
            navigateImage(1);
            break;
    }
}
function openLightbox(index: number) {
    currentIndex = index;
    updateLightboxContent();
    
    lightbox?.classList.add('active');
    document.body.classList.add('no-scroll');
    
    updateNavigationButtons();
}
function updateLightboxContent() {
    const image = images[currentIndex];
    
    if (lightboxImage) {
        lightboxImage.src = image.fullUrl;
    }
    
    if (lightboxAuthor) {
        lightboxAuthor.textContent = image.author;
    }
}

function updateNavigationButtons() {
    if (prevBtn) {
        prevBtn.classList.toggle('disabled', currentIndex === 0);
    }
    if (nextBtn) {
        nextBtn.classList.toggle('disabled', currentIndex === images.length - 1);
    }
}

function navigateImage(direction: number) {
    const newIndex = currentIndex + direction;
    
    if (newIndex >= 0 && newIndex < images.length) {
        currentIndex = newIndex;
        updateLightboxContent();
        updateNavigationButtons();
    }
}

function closeLightbox() {
    lightbox?.classList.remove('active');
    document.body.classList.remove('no-scroll');

    setTimeout(() => {
        if (!lightbox?.classList.contains('active') && lightboxImage) {
            lightboxImage.src = '';
        }
    }, 300);
}
document.addEventListener('DOMContentLoaded', initGallery);