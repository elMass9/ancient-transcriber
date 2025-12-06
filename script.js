const images = [
    "Mk1.9.png", "Mk1.15.png", "Mk1.19.png", "Mk1.20.png", "Mk1.26.png", "Mk1.31.png", "Mk1.37.png",
    "Mk2.8.png", "Mk2.12.png", "Mk2.16.png",
    "Mk3.5.png", "Mk3.10.png", "Mk3.17.png", "Mk3.22.png", "Mk3.28.png", "Mk3.35.png",
    "Mk4.5.png", "Mk4.11.png", "Mk4.16.png", "Mk4.21.png", "Mk4.27.png", "Mk4.32.png", "Mk4.38.png",
    "Mk5.2.png", "Mk5.7.png", "Mk5.13.png", "Mk5.18.png", "Mk5.23.png", "Mk5.30.png", "Mk5.35.png", "Mk5.40.png",
    "Mk6.2.png", "Mk6.5.png", "Mk6.11.png", "Mk6.15.png", "Mk6.20.png", "Mk6.24.png", "Mk6.34.png", "Mk6.38.png", "Mk6.44.png", "Mk6.49.png", "Mk6.55.png",
    "Mk7.3.png", "Mk7.7.png", "Mk7.13.png", "Mk7.18.png", "Mk7.24.png", "Mk7.28.png",
    "Mk8.2.png", "Mk8.7.png", "Mk8.13.png", "Mk8.25.png", "Mk8.29.png",
    "Mk9.14.png", "Mk9.25.png", "Mk9.35.png", "Mk9.39.png", "Mk9.43.png", "Mk9.49.png",
    "Mk10.5.png", "Mk10.18.png", "Mk10.23.png", "Mk10.28.png", "Mk10.32.png", "Mk10.36.png", "Mk10.42.png", "Mk10.47.png",
    "Mk11.1.png", "Mk11.26.png", "Mk11.31.png",
    "Mk12.3.png", "Mk12.8.png", "Mk12.13.png", "Mk12.18.png", "Mk12.22.png", "Mk12.28.png"
];

let currentImage = null;

function init() {
    const thumbnailsContainer = document.getElementById('thumbnails');
    images.forEach(img => {
        const div = document.createElement('div');
        div.className = 'thumbnail';
        div.textContent = img.replace('.png', '');
        div.onclick = () => loadImage(img);
        thumbnailsContainer.appendChild(div);
    });
    
    document.querySelectorAll('.tab').forEach(tab => {
        tab.onclick = () => switchTab(tab.dataset.tab);
    });
    
    document.getElementById('download-image').onclick = downloadImage;
    document.getElementById('download-chars').onclick = downloadChars;
    document.getElementById('download-docs').onclick = downloadDocs;
    
    if (images.length > 0) loadImage(images[0]);
}

function loadImage(imageName) {
    currentImage = imageName;
    document.getElementById('main-image').src = `DataParchments/${imageName}`;
    
    document.querySelectorAll('.thumbnail').forEach(t => {
        t.classList.toggle('active', t.textContent === imageName.replace('.png', ''));
    });
    
    loadGroundTruth();
}

async function loadGroundTruth() {
    const baseName = currentImage.replace('.png', '');
    
    const charsPath = `GroundTruth/GroundTruthChars/${baseName}_gt.txt`;
    try {
        const response = await fetch(charsPath);
        document.getElementById('chars-text').textContent = response.ok ? await response.text() : 'No ground truth characters available';
        document.getElementById('download-chars').disabled = !response.ok;
    } catch {
        document.getElementById('chars-text').textContent = 'No ground truth characters available';
        document.getElementById('download-chars').disabled = true;
    }
    
    const docsPath = `GroundTruth/GroundTruthDocuments/`;
    try {
        const response = await fetch(docsPath);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = Array.from(doc.querySelectorAll('a')).map(a => a.getAttribute('href')).filter(h => h && h.endsWith('.txt'));
        
        const matchingDoc = links.find(link => {
            const linkBase = link.replace('.txt', '').toLowerCase().replace('mark', 'mk').replace(/_/g, '.');
            return baseName.toLowerCase().includes(linkBase) || linkBase.includes(baseName.toLowerCase());
        });
        
        if (matchingDoc) {
            const docResponse = await fetch(`${docsPath}${matchingDoc}`);
            document.getElementById('docs-text').textContent = await docResponse.text();
            document.getElementById('download-docs').disabled = false;
        } else {
            document.getElementById('docs-text').textContent = 'No matching ground truth document available';
            document.getElementById('download-docs').disabled = true;
        }
    } catch {
        document.getElementById('docs-text').textContent = 'No ground truth document available';
        document.getElementById('download-docs').disabled = true;
    }
}

function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

function download(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
}

function downloadImage() {
    download(`DataParchments/${currentImage}`, currentImage);
}

function downloadChars() {
    const baseName = currentImage.replace('.png', '');
    download(`GroundTruth/GroundTruthChars/${baseName}_gt.txt`, `${baseName}_gt.txt`);
}

function downloadDocs() {
    const text = document.getElementById('docs-text').textContent;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    download(url, `${currentImage.replace('.png', '')}_doc.txt`);
    URL.revokeObjectURL(url);
}

init();
