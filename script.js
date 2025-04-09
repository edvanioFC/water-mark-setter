document.addEventListener('DOMContentLoaded', function () {
    // Elementos do DOM
    const imageUpload = document.getElementById('image-upload');
    const logoUpload = document.getElementById('logo-upload');
    const opacitySlider = document.getElementById('opacity-slider');
    const logoSizeSlider = document.getElementById('logo-size');
    const opacityValue = document.getElementById('opacity-value');
    const sizeValue = document.getElementById('size-value');
    const applyButton = document.getElementById('apply-button');
    const downloadAllButton = document.getElementById('download-all');
    const previewContainer = document.getElementById('preview-container');
    const logoPreview = document.getElementById('logo-preview');
    const positionOptions = document.querySelectorAll('.position-option');
    const loadingOverlay = document.querySelector('.loading');
    const progressBarContainer = document.querySelector('.progress-bar-container');
    const progressBar = document.querySelector('.progress-bar');
    const imageError = document.getElementById('image-error');
    const logoError = document.getElementById('logo-error');
    const imageDropZone = document.getElementById('image-drop-zone');

    // Variáveis
    let selectedImages = [];
    let logoImage = null;
    let position = 'middle-center';
    let processedImages = [];
    let currentPreviewIndex = 0;

    // Modal de visualização
    const modal = document.createElement('div');
    modal.className = 'image-preview-modal';
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.zIndex = '1000';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.flexDirection = 'row';

    const modalImg = document.createElement('img');
    modalImg.className = 'modal-image';
    modalImg.style.maxWidth = '90%';
    modalImg.style.maxHeight = '90%';
    modalImg.style.objectFit = 'contain';
    modalImg.style.boxShadow = '0 0 20px rgba(255,255,255,0.2)';

    const closeBtn = document.createElement('span');
    closeBtn.className = 'modal-close';
    closeBtn.innerHTML = '&times;';
    Object.assign(closeBtn.style, {
        position: 'absolute',
        top: '20px',
        right: '30px',
        color: 'white',
        fontSize: '40px',
        fontWeight: 'bold',
        cursor: 'pointer'
    });

    const leftArrow = document.createElement('span');
    leftArrow.innerHTML = '&#10094;';
    Object.assign(leftArrow.style, {
        position: 'absolute',
        left: '20px',
        fontSize: '60px',
        color: 'white',
        cursor: 'pointer',
        userSelect: 'none'
    });

    const rightArrow = document.createElement('span');
    rightArrow.innerHTML = '&#10095;';
    Object.assign(rightArrow.style, {
        position: 'absolute',
        right: '20px',
        fontSize: '60px',
        color: 'white',
        cursor: 'pointer',
        userSelect: 'none'
    });

    modal.appendChild(leftArrow);
    modal.appendChild(modalImg);
    modal.appendChild(rightArrow);
    modal.appendChild(closeBtn);
    document.body.appendChild(modal);

    // Modal - Eventos
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    leftArrow.addEventListener('click', () => {
        if (currentPreviewIndex > 0) {
            currentPreviewIndex--;
            showImageInModal(currentPreviewIndex);
        }
    });

    rightArrow.addEventListener('click', () => {
        if (currentPreviewIndex < processedImages.length - 1) {
            currentPreviewIndex++;
            showImageInModal(currentPreviewIndex);
        }
    });

    function showImageInModal(index) {
        modalImg.src = processedImages[index].dataURL;
        modal.style.display = 'flex';
    }

    // Upload drag & drop
    imageDropZone.addEventListener('click', () => imageUpload.click());
    imageDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageDropZone.style.borderColor = '#4e54c8';
        imageDropZone.style.backgroundColor = 'rgba(78, 84, 200, 0.1)';
    });
    imageDropZone.addEventListener('dragleave', () => {
        imageDropZone.style.borderColor = '#ccc';
        imageDropZone.style.backgroundColor = 'transparent';
    });
    imageDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        imageDropZone.style.borderColor = '#ccc';
        imageDropZone.style.backgroundColor = 'transparent';
        if (e.dataTransfer.files.length > 0) {
            imageUpload.files = e.dataTransfer.files;
            handleImageUpload(e.dataTransfer.files);
        }
    });

    // Outros eventos
    imageUpload.addEventListener('change', () => handleImageUpload(imageUpload.files));
    logoUpload.addEventListener('change', function () {
        if (this.files?.[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                logoPreview.src = e.target.result;
                logoPreview.style.display = 'block';
                logoImage = new Image();
                logoImage.src = e.target.result;
                logoError.style.display = 'none';
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    opacitySlider.addEventListener('input', function () {
        opacityValue.textContent = this.value;
    });

    logoSizeSlider.addEventListener('input', function () {
        sizeValue.textContent = this.value;
    });

    positionOptions.forEach(option => {
        option.addEventListener('click', function () {
            positionOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            position = this.dataset.position;
        });
    });

    applyButton.addEventListener('click', processImages);
    downloadAllButton.addEventListener('click', downloadAllImages);

    function handleImageUpload(files) {
        selectedImages = [];
        previewContainer.innerHTML = '';

        if (!files || files.length === 0) {
            imageError.style.display = 'block';
            return;
        }

        imageError.style.display = 'none';

        for (const file of Array.from(files)) {
            if (!file.type.match('image.*')) continue;
            processFile(file);
        }
    }

    function processFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const resultData = String(e.target.result);
            loadImageFromData(file, resultData);
        };
        reader.readAsDataURL(file);
    }

    function loadImageFromData(file, resultData) {
        const img = new Image();
        img.src = resultData;

        img.onload = () => {
            selectedImages.push({ file, image: img, data: resultData });
            addImagePreview(file, resultData);
        };
    }

    function addImagePreview(file, resultData) {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';

        const imgElement = document.createElement('img');
        imgElement.src = resultData;
        imgElement.alt = file.name;
        imgElement.style.cursor = 'pointer';

        imgElement.addEventListener('click', () => {
            const index = processedImages.findIndex(img => img.filename.includes(file.name.replace(/\.[^/.]+$/, '')));
            currentPreviewIndex = index >= 0 ? index : 0;
            showImageInModal(currentPreviewIndex);
        });

        previewItem.appendChild(imgElement);
        previewContainer.appendChild(previewItem);
    }

    function processImages() {
        if (selectedImages.length === 0) {
            imageError.style.display = 'block';
            return;
        }

        if (!logoImage) {
            logoError.style.display = 'block';
            return;
        }

        loadingOverlay.style.display = 'flex';
        progressBarContainer.style.display = 'block';
        progressBar.style.width = '0%';
        progressBar.textContent = '0%';

        processedImages = [];
        const opacity = opacitySlider.value / 100;
        const logoSize = logoSizeSlider.value / 100;
        const totalImages = selectedImages.length;
        let processedCount = 0;

        selectedImages.forEach((item, index) => {
            setTimeout(() => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = item.image.width;
                canvas.height = item.image.height;
                ctx.drawImage(item.image, 0, 0);

                const maxLogoWidth = canvas.width * logoSize;
                const maxLogoHeight = canvas.height * logoSize;

                let logoWidth, logoHeight;
                if (logoImage.width / logoImage.height > maxLogoWidth / maxLogoHeight) {
                    logoWidth = maxLogoWidth;
                    logoHeight = (logoImage.height * maxLogoWidth) / logoImage.width;
                } else {
                    logoHeight = maxLogoHeight;
                    logoWidth = (logoImage.width * maxLogoHeight) / logoImage.height;
                }

                let x, y;
                if (position.includes('left')) x = 20;
                else if (position.includes('right')) x = canvas.width - logoWidth - 20;
                else x = (canvas.width - logoWidth) / 2;

                if (position.includes('top')) y = 20;
                else if (position.includes('bottom')) y = canvas.height - logoHeight - 20;
                else y = (canvas.height - logoHeight) / 2;

                ctx.globalAlpha = opacity;
                ctx.drawImage(logoImage, x, y, logoWidth, logoHeight);
                ctx.globalAlpha = 1.0;

                const processedDataURL = canvas.toDataURL('image/png');
                processedImages.push({
                    dataURL: processedDataURL,
                    filename: item.file.name.replace(/\.[^/.]+$/, "") + "_com_marca_ig11_water_mark_setter.png"
                });

                processedCount++;
                const progress = Math.round((processedCount / totalImages) * 100);
                progressBar.style.width = progress + '%';
                progressBar.textContent = progress + '%';

                if (processedCount === totalImages) {
                    finishProcessing();
                }
            }, index * 100);
        });
    }

    function finishProcessing() {
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
            previewContainer.innerHTML = '';
            processedImages.forEach((item, index) => {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';

                const img = document.createElement('img');
                img.src = item.dataURL;
                img.alt = item.filename;
                img.style.cursor = 'pointer';
                img.addEventListener('click', () => {
                    currentPreviewIndex = index;
                    showImageInModal(index);
                });

                previewItem.appendChild(img);
                previewContainer.appendChild(previewItem);
            });

            downloadAllButton.style.display = 'block';
        }, 500);
    }

    function downloadAllImages() {
        if (processedImages.length === 0) return;

        if (processedImages.length === 1) {
            const link = document.createElement('a');
            link.href = processedImages[0].dataURL;
            link.download = processedImages[0].filename;
            link.click();
            return;
        }

        loadingOverlay.style.display = 'flex';

        import('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js')
            .then(() => {
                const zip = new JSZip();
                zip.file("readme.txt", "Images created with Watermark App");
                zip.comment = "Created with Watermark App";

                processedImages.forEach(item => {
                    const byteString = atob(item.dataURL.split(',')[1]);
                    const mimeString = item.dataURL.split(',')[0].split(':')[1].split(';')[0];
                    const ab = new ArrayBuffer(byteString.length);
                    const ia = new Uint8Array(ab);

                    for (let i = 0; i < byteString.length; i++) {
                        ia[i] = byteString.charCodeAt(i);
                    }

                    const blob = new Blob([ab], { type: mimeString });
                    zip.file(item.filename, blob);
                });

                zip.generateAsync({
                    type: 'blob',
                    compression: 'DEFLATE',
                    compressionOptions: { level: 5 },
                    mimeType: 'application/zip'
                }).then(content => {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(content);
                    link.download = 'imagens_com_marca.zip';
                    link.click();
                    loadingOverlay.style.display = 'none';
                });
            })
            .catch(err => {
                alert('Erro ao criar o arquivo ZIP. Por favor, baixe as imagens individualmente.');
                loadingOverlay.style.display = 'none';
                console.error(err);
            });
    }
});


