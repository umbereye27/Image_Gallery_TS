"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let images = [];
let currentIndex = 0;
const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxAuthor = document.getElementById('lightbox-author');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const closeBtn = document.getElementById('close-btn');
// Initialize the gallery
function initGallery() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fetchImages();
            renderGallery();
            setupEventListeners();
        }
        catch (error) {
            console.error('Failed to initialize gallery:', error);
            if (gallery) {
                gallery.innerHTML = '<p class="error">Failed to load images. Please try again later.</p>';
            }
        }
    });
}
// Fetch images 
function fetchImages() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('https://picsum.photos/v2/list?page=1&limit=20');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = yield response.json();
            images = data.map(item => ({
                id: item.id,
                fullUrl: `https://picsum.photos/id/${item.id}/800/600`,
                thumbUrl: `https://picsum.photos/id/${item.id}/200/150`,
                author: `By: ${item.author}`
            }));
        }
        catch (error) {
            console.error('Error fetching images:', error);
            throw error;
        }
    });
}
function renderGallery() {
    if (!gallery)
        return;
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
    gallery === null || gallery === void 0 ? void 0 : gallery.addEventListener('click', handleThumbnailClick);
    prevBtn === null || prevBtn === void 0 ? void 0 : prevBtn.addEventListener('click', () => navigateImage(-1));
    nextBtn === null || nextBtn === void 0 ? void 0 : nextBtn.addEventListener('click', () => navigateImage(1));
    closeBtn === null || closeBtn === void 0 ? void 0 : closeBtn.addEventListener('click', closeLightbox);
    lightbox === null || lightbox === void 0 ? void 0 : lightbox.addEventListener('click', handleLightboxClick);
    document.addEventListener('keydown', handleKeyPress);
}
function handleThumbnailClick(event) {
    const target = event.target;
    const thumbnail = target.closest('.thumbnail');
    if (thumbnail) {
        const index = parseInt(thumbnail.dataset.index || '0', 10);
        openLightbox(index);
    }
}
function handleLightboxClick(event) {
    if (event.target === lightbox) {
        closeLightbox();
    }
}
function handleKeyPress(event) {
    if (!(lightbox === null || lightbox === void 0 ? void 0 : lightbox.classList.contains('active')))
        return;
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
function openLightbox(index) {
    currentIndex = index;
    updateLightboxContent();
    lightbox === null || lightbox === void 0 ? void 0 : lightbox.classList.add('active');
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
function navigateImage(direction) {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < images.length) {
        currentIndex = newIndex;
        updateLightboxContent();
        updateNavigationButtons();
    }
}
function closeLightbox() {
    lightbox === null || lightbox === void 0 ? void 0 : lightbox.classList.remove('active');
    document.body.classList.remove('no-scroll');
    setTimeout(() => {
        if (!(lightbox === null || lightbox === void 0 ? void 0 : lightbox.classList.contains('active')) && lightboxImage) {
            lightboxImage.src = '';
        }
    }, 300);
}
document.addEventListener('DOMContentLoaded', initGallery);
