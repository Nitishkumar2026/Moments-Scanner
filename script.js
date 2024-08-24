document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('gallery');
    const storedItems = JSON.parse(localStorage.getItem('galleryItems')) || [];
    const welcomeMessageElement = document.getElementById('welcomeMessage');

    function typeWelcomeMessage(message, index = 0) {
        if (index <= message.length) {
            welcomeMessageElement.textContent = message.substring(0, index);
            setTimeout(() => typeWelcomeMessage(message, index + 1), 100);
        } else {
            setTimeout(() => deleteWelcomeMessage(message), 2000);
        }
    }

    function deleteWelcomeMessage(message, index = message.length) {
        if (index >= 0) {
            welcomeMessageElement.textContent = message.substring(0, index);
            setTimeout(() => deleteWelcomeMessage(message, index - 1), 50);
        } else {
            setTimeout(() => typeWelcomeMessage(message), 1000);
        }
    }

    typeWelcomeMessage('WELCOME TO MY WEBSITE');

    storedItems.forEach(item => addGalleryItem(item));

    document.getElementById('fileInput').addEventListener('change', function(event) {
        const files = event.target.files;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = function(e) {
                const fileUrl = e.target.result;
                const item = { type: file.type, src: fileUrl, date: new Date().toLocaleDateString() };
                storedItems.push(item);
                localStorage.setItem('galleryItems', JSON.stringify(storedItems));
                addGalleryItem(item, true);
            };

            reader.readAsDataURL(file);
        }
    });

    document.getElementById('logo').onclick = function() {
        const fullscreenContainer = document.getElementById('fullscreen-container');
        const fullscreenImage = document.getElementById('fullscreen-image');
        fullscreenImage.src = this.src;
        fullscreenContainer.style.display = 'flex';
    };

    document.getElementById('close-fullscreen').onclick = function() {
        document.getElementById('fullscreen-container').style.display = 'none';
    };

    document.getElementById('download-pdf').onclick = function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        let images = storedItems.filter(item => item.type.startsWith('image/'));

        if (images.length === 0) {
            alert('No images to download.');
            return;
        }

        images.forEach((item, index) => {
            doc.addImage(item.src, 'JPEG', 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height);
            if (index < images.length - 1) {
                doc.addPage();
            }
        });

        doc.save('gallery.pdf');
    };

    function addGalleryItem(item, prepend = false) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';

        if (item.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = item.src;
            galleryItem.appendChild(img);
        } else if (item.type.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = item.src;
            video.controls = true;
            galleryItem.appendChild(video);
        }

        const dateLabel = document.createElement('div');
        dateLabel.className = 'upload-date';
        dateLabel.textContent = item.date;
        galleryItem.appendChild(dateLabel);

        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-btn';
        downloadBtn.textContent = 'Download';
        downloadBtn.onclick = () => downloadItem(item);
        galleryItem.appendChild(downloadBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteGalleryItem(galleryItem, item);
        galleryItem.appendChild(deleteBtn);

        if (prepend) {
            gallery.insertBefore(galleryItem, gallery.firstChild);
        } else {
            gallery.appendChild(galleryItem);
        }
    }

    function deleteGalleryItem(element, item) {
        const index = storedItems.indexOf(item);
        if (index > -1) {
            storedItems.splice(index, 1);
            localStorage.setItem('galleryItems', JSON.stringify(storedItems));
            element.remove();
        }
    }

    function downloadItem(item) {
        const link = document.createElement('a');
        link.href = item.src;
        link.download = item.src.split('/').pop();
        link.click();
    }

    /* SCROLL ABOUT */
srtop.reveal('.about .content h3', { delay: 200 });
srtop.reveal('.about .content .tag', { delay: 200 });
srtop.reveal('.about .content p', { delay: 200 });
srtop.reveal('.about .content .box-container', { delay: 200 });
srtop.reveal('.about .content .resumebtn', { delay: 200 });

});













document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('gallery');
    const storedItems = JSON.parse(localStorage.getItem('galleryItems')) || [];

    // Limit display to a maximum of 130 items
    if (storedItems.length > 130) {
        storedItems.splice(0, storedItems.length - 130);
        localStorage.setItem('galleryItems', JSON.stringify(storedItems));
    }

    storedItems.forEach(item => addGalleryItem(item));

    document.getElementById('fileInput').addEventListener('change', function(event) {
        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (storedItems.length < 130) { // Ensure no more than 130 items are added
                const reader = new FileReader();

                reader.onload = function(e) {
                    const fileUrl = e.target.result;
                    const item = { type: file.type, src: fileUrl, date: new Date().toLocaleDateString() };
                    storedItems.push(item);
                    localStorage.setItem('galleryItems', JSON.stringify(storedItems));
                    addGalleryItem(item);
                };

                reader.readAsDataURL(file);
            } else {
                alert("You have reached the maximum limit of 130 items.");
                break;
            }
        }
    });

    function addGalleryItem(item) {
        const galleryItem = document.createElement('div');
        galleryItem.classList.add('gallery-item');

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = function() {
            gallery.removeChild(galleryItem);
            const index = storedItems.findIndex(storedItem => storedItem.src === item.src);
            if (index > -1) {
                storedItems.splice(index, 1);
                localStorage.setItem('galleryItems', JSON.stringify(storedItems));
            }
        };

        const downloadBtn = document.createElement('button');
        downloadBtn.classList.add('download-btn');
        downloadBtn.textContent = 'Download';
        downloadBtn.onclick = function() {
            const a = document.createElement('a');
            a.href = item.src;
            a.download = `download.${item.type.split('/')[1]}`;
            a.click();
        };

        const uploadDate = document.createElement('div');
        uploadDate.classList.add('upload-date');
        uploadDate.textContent = `Uploaded on: ${item.date}`;

        if (item.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = item.src;
            img.onclick = function() {
                const fullscreenContainer = document.getElementById('fullscreen-container');
                const fullscreenImage = document.getElementById('fullscreen-image');
                fullscreenImage.src = item.src;
                fullscreenContainer.style.display = 'flex';
            };
            galleryItem.appendChild(img);
        } else if (item.type.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = item.src;
            video.controls = true;
            galleryItem.appendChild(video);
        }

        galleryItem.appendChild(uploadDate);
        galleryItem.appendChild(downloadBtn);
        gallery.appendChild(galleryItem);
    }

    document.getElementById('logo').onclick = function() {
        const fullscreenContainer = document.getElementById('fullscreen-container');
        const fullscreenImage = document.getElementById('fullscreen-image');
        fullscreenImage.src = this.src;
        fullscreenContainer.style.display = 'flex';
    };

    document.getElementById('close-fullscreen').onclick = function() {
        document.getElementById('fullscreen-container').style.display = 'none';
    };
});
 




document.addEventListener('DOMContentLoaded', function () {
    const updates = [
        {
            version: "v2.0",
            date: "August 20, 2024",
            features: [
                "Added support for 130 images/videos in the gallery.",
                "Introduced full-screen view for images.",
                "Implemented PDF download functionality for images."
            ]
        },
        {
            version: "v1.1",
            date: "August 1, 2024",
            features: [
                "Improved welcome message typing animation.",
                "Enhanced gallery responsiveness for mobile devices.",
                "Optimized image loading performance."
            ]
        },
        {
            version: "v1.0",
            date: "July 5, 2024",
            features: [
                "Initial release with image and video upload support.",
                "Basic gallery functionality with delete and download options."
            ]
        }
    ];

    const updatesContainer = document.getElementById('updates-container');

    updates.forEach((update, index) => {
        const updateItem = document.createElement('div');
        updateItem.className = `update-item ${index === 0 ? 'latest' : ''}`;
        updateItem.innerHTML = `
            <div class="update-item-header">
                <h3>${update.version}</h3>
                <span class="update-date">${update.date}</span>
            </div>
            <div class="update-item-content">
                <ul>
                    ${update.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
        `;

        // Toggle content visibility when clicking the header
        updateItem.addEventListener('click', function () {
            this.classList.toggle('active');
        });

        updatesContainer.appendChild(updateItem);
    });
});
