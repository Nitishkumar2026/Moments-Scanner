// Moments Scanner Professional JS
// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    const icon = themeToggle.querySelector('i');
    if (isDark) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
      themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
      themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
  });
}
// Gallery search
const gallerySearch = document.getElementById('gallery-search');
const galleryGrid = document.getElementById('gallery');
function filterGallery() {
  const query = gallerySearch.value.toLowerCase();
  const items = galleryGrid.querySelectorAll('.gallery-item');
  let anyVisible = false;
  items.forEach(item => {
    const alt = item.querySelector('img,video')?.alt || '';
    if (alt.toLowerCase().includes(query)) {
      item.style.display = '';
      anyVisible = true;
    } else {
      item.style.display = 'none';
    }
  });
  const emptyState = galleryGrid.querySelector('.gallery-empty-state');
  if (emptyState) emptyState.style.display = anyVisible ? 'none' : '';
}
if (gallerySearch && galleryGrid) {
  gallerySearch.addEventListener('input', filterGallery);
}
// Gallery upload (basic demo)
// You can extend this to use localStorage or backend
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*,video/*';
fileInput.multiple = true;
const uploadBtn = document.createElement('button');
uploadBtn.textContent = 'Upload';
uploadBtn.className = 'download-btn';
uploadBtn.style.margin = '1rem 0';
galleryGrid.parentElement.insertBefore(uploadBtn, galleryGrid);
uploadBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', e => {
  const files = Array.from(e.target.files);
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = ev => {
      const div = document.createElement('div');
      div.className = 'gallery-item';
      if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = ev.target.result;
        img.alt = file.name;
        div.appendChild(img);
      } else if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.src = ev.target.result;
        video.controls = true;
        video.alt = file.name;
        div.appendChild(video);
      }
      const date = document.createElement('div');
      date.className = 'upload-date';
      date.textContent = 'Uploaded on: ' + new Date().toLocaleDateString();
      div.appendChild(date);
      const delBtn = document.createElement('button');
      delBtn.className = 'delete-btn';
      delBtn.textContent = 'Delete';
      delBtn.onclick = () => div.remove();
      div.appendChild(delBtn);
      galleryGrid.appendChild(div);
      filterGallery();
    };
    reader.readAsDataURL(file);
  });
});
// Download PDF (active)
const downloadPdfBtn = document.getElementById('download-pdf');
if (downloadPdfBtn) {
  downloadPdfBtn.addEventListener('click', () => {
    const galleryItems = document.querySelectorAll('.gallery-item img, .gallery-item video');
    if (galleryItems.length === 0) {
      alert('No images or videos to export!');
      return;
    }
    // Use jsPDF and html2canvas for images
    const jsPDFScript = document.createElement('script');
    jsPDFScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    jsPDFScript.onload = () => {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF();
      let added = 0;
      const addImageToPDF = (img, idx, total, cb) => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        let ratio = Math.min(pageWidth / img.naturalWidth, pageHeight / img.naturalHeight, 1);
        let w = img.naturalWidth * ratio;
        let h = img.naturalHeight * ratio;
        let x = (pageWidth - w) / 2;
        let y = (pageHeight - h) / 2;
        pdf.addImage(imgData, 'JPEG', x, y, w, h);
        if (idx < total - 1) pdf.addPage();
        cb();
      };
      const images = Array.from(galleryItems).filter(el => el.tagName === 'IMG');
      if (images.length === 0) {
        alert('Only images can be exported to PDF.');
        return;
      }
      const processNext = () => {
        if (added >= images.length) {
          pdf.save('gallery.pdf');
          return;
        }
        addImageToPDF(images[added], added, images.length, () => {
          added++;
          processNext();
        });
      };
      processNext();
    };
    document.body.appendChild(jsPDFScript);
  });
}