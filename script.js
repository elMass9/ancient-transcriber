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

const docMapping = {
    "Mk1.9": "Mark1_9-15.txt", "Mk1.15": "Mark1_15-20.txt", "Mk1.19": "Mark1_19-23.txt", "Mk1.20": "Mark1_20-26.txt",
    "Mk1.26": "Mark1_26-31.txt", "Mk1.31": "Mark1_31-37.txt", "Mk1.37": "Mark1_37-42.txt",
    "Mk2.8": "Mark2_8-12.txt", "Mk2.12": "Mark2_12-16.txt", "Mk2.16": "Mark2_16-19.txt",
    "Mk3.5": "Mark3_5-9.txt", "Mk3.10": "Mark3_10-17.txt", "Mk3.17": "Mark3_17-22.txt",
    "Mk3.22": "Mark3_22-28.txt", "Mk3.28": "Mark3_28-35.txt", "Mk3.35": "Mark3_35-4_5.txt",
    "Mk4.5": "Mark4_5-11.txt", "Mk4.11": "Mark4_11-16.txt", "Mk4.16": "Mark4_16-21.txt",
    "Mk4.21": "Mark4_21-27.txt", "Mk4.27": "Mark4_27-32.txt", "Mk4.32": "Mark4_32-38.txt",
    "Mk4.38": "Mark4_38-5_2.txt", "Mk5.2": "Mark5_2-7.txt", "Mk5.7": "Mark5_7-13.txt",
    "Mk5.13": "Mark5_13-18.txt", "Mk5.18": "Mark5_18-23.txt", "Mk5.23": "Mark5_23-30.txt",
    "Mk5.30": "Mark5_30-35.txt", "Mk5.35": "Mark5_35-40.txt", "Mk5.40": "Mark5_40-6_2.txt",
    "Mk6.2": "Mark6_2-5.txt", "Mk6.5": "Mark6_5-11.txt", "Mk6.11": "Mark6_11-15.txt",
    "Mk6.15": "Mark6_15-20.txt", "Mk6.20": "Mark6_20-24.txt", "Mk6.24": "Mark6_24-29.txt",
    "Mk6.34": "Mark6_34-38.txt", "Mk6.38": "Mark6_38-44.txt", "Mk6.44": "Mark6_44-49.txt",
    "Mk6.49": "Mark6_49-55.txt", "Mk6.55": "Mark6_55-7_3.txt", "Mk7.3": "Mark7_3-7.txt",
    "Mk7.7": "Mark7_7-12.txt", "Mk7.13": "Mark7_13-18.txt", "Mk7.18": "Mark7_18-24.txt",
    "Mk7.24": "Mark7_24-28.txt", "Mk7.28": "Mark7_28-33.txt", "Mk8.2": "Mark8_2-6.txt",
    "Mk8.7": "Mark8_7-13.txt", "Mk8.13": "Mark8_13-19.txt", "Mk8.25": "Mark8_25-29.txt",
    "Mk8.29": "Mark8_29-33.txt", "Mk9.14": "Mark9_14-19.txt", "Mk9.25": "Mark9_25-29.txt",
    "Mk9.35": "Mark9_35-39.txt", "Mk9.39": "Mark9_39-43.txt", "Mk9.43": "Mark9_43-49.txt",
    "Mk9.49": "Mark9_49-10_5.txt", "Mk10.5": "Mark10_5-12.txt", "Mk10.18": "Mark10_18-23.txt",
    "Mk10.23": "Mark10_23-28.txt", "Mk10.28": "Mark10_28-32.txt", "Mk10.32": "Mark10_32-36.txt",
    "Mk10.36": "Mark10_36-42.txt", "Mk10.42": "Mark10_42-46.txt", "Mk10.47": "Mark10_47-11_1.txt",
    "Mk11.1": "Mark11_1-6.txt", "Mk11.26": "Mark11_26-31.txt", "Mk11.31": "Mark11_31-12_3.txt",
    "Mk12.3": "Mark12_3-8.txt", "Mk12.8": "Mark12_8-13.txt", "Mk12.13": "Mark12_13-17.txt",
    "Mk12.18": "Mark12_18-22.txt", "Mk12.22": "Mark12_22-27.txt", "Mk12.28": "Mark12_28-32.txt"
};

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
    
    const docFile = docMapping[baseName];
    if (docFile) {
        try {
            const response = await fetch(`GroundTruth/GroundTruthDocuments/${docFile}`);
            if (response.ok) {
                document.getElementById('docs-text').textContent = await response.text();
                document.getElementById('download-docs').disabled = false;
            } else {
                document.getElementById('docs-text').textContent = 'No ground truth document available';
                document.getElementById('download-docs').disabled = true;
            }
        } catch {
            document.getElementById('docs-text').textContent = 'No ground truth document available';
            document.getElementById('download-docs').disabled = true;
        }
    } else {
        document.getElementById('docs-text').textContent = 'No matching ground truth document available';
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
