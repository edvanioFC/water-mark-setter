document.addEventListener('DOMContentLoaded', function() {
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

    // Variáveis para armazenar dados
    let selectedImages = [];
    let logoImage = null;
    let position = 'middle-center';
    let processedImages = [];

    // Configurar eventos para o upload de arquivos via drag and drop
    imageDropZone.addEventListener('click', () => {
        imageUpload.click();
    });

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

    // Event listeners
    imageUpload.addEventListener('change', () => handleImageUpload(imageUpload.files));
    
    logoUpload.addEventListener('change', function() {
        if (this.files?.[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                logoPreview.src = e.target.result;
                logoPreview.style.display = 'block';
                logoImage = new Image();
                logoImage.src = e.target.result;
                logoError.style.display = 'none';
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    opacitySlider.addEventListener('input', function() {
        opacityValue.textContent = this.value;
    });

    logoSizeSlider.addEventListener('input', function() {
        sizeValue.textContent = this.value;
    });

    positionOptions.forEach(option => {
        option.addEventListener('click', function() {
            positionOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            position = this.dataset.position;
        });
    });

    applyButton.addEventListener('click', processImages);
    downloadAllButton.addEventListener('click', downloadAllImages);

    // Funções
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

    // Extracted function to reduce nesting
    function processFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const resultData = String(e.target.result);
            loadImageFromData(file, resultData);
        };
        reader.readAsDataURL(file);
    }

    // Further extracted function to reduce nesting
    function loadImageFromData(file, resultData) {
        const img = new Image();
        img.src = resultData;
        
        img.onload = () => {
            selectedImages.push({
                file: file,
                image: img,
                data: resultData
            });
            
            addImagePreview(file, resultData);
        };
    }

    // Final extracted function to reduce nesting
    function addImagePreview(file, resultData) {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        
        // Create elements instead of using innerHTML with template literal
        const imgElement = document.createElement('img');
        imgElement.src = resultData;
        imgElement.alt = file.name;
        
        previewItem.appendChild(imgElement);
        previewContainer.appendChild(previewItem);
    }

    function processImages() {
        // Validação
        if (selectedImages.length === 0) {
            imageError.style.display = 'block';
            return;
        }
        
        if (!logoImage) {
            logoError.style.display = 'block';
            return;
        }
        
        // Mostrar indicadores de carregamento
        loadingOverlay.style.display = 'flex';
        progressBarContainer.style.display = 'block';
        progressBar.style.width = '0%';
        progressBar.textContent = '0%';
        
        processedImages = [];
        const opacity = opacitySlider.value / 100;
        const logoSize = logoSizeSlider.value / 100;
        
        const totalImages = selectedImages.length;
        let processedCount = 0;
        
        // Processar cada imagem
        selectedImages.forEach((item, index) => {
            setTimeout(() => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Configurar canvas com o tamanho da imagem
                canvas.width = item.image.width;
                canvas.height = item.image.height;
                
                // Desenhar a imagem original
                ctx.drawImage(item.image, 0, 0);
                
                // Calcular o tamanho e posição do logo
                const maxLogoWidth = canvas.width * logoSize;
                const maxLogoHeight = canvas.height * logoSize;
                
                // Manter proporção do logo
                let logoWidth, logoHeight;
                if (logoImage.width / logoImage.height > maxLogoWidth / maxLogoHeight) {
                    logoWidth = maxLogoWidth;
                    logoHeight = (logoImage.height * maxLogoWidth) / logoImage.width;
                } else {
                    logoHeight = maxLogoHeight;
                    logoWidth = (logoImage.width * maxLogoHeight) / logoImage.height;
                }
                
                // Determinar a posição com base na seleção
                let x, y;
                if (position.includes('left')) {
                    x = 20;
                } else if (position.includes('right')) {
                    x = canvas.width - logoWidth - 20;
                } else {
                    x = (canvas.width - logoWidth) / 2;
                }
                
                if (position.includes('top')) {
                    y = 20;
                } else if (position.includes('bottom')) {
                    y = canvas.height - logoHeight - 20;
                } else {
                    y = (canvas.height - logoHeight) / 2;
                }
                
                // Configurar opacidade
                ctx.globalAlpha = opacity;
                
                // Desenhar o logo
                ctx.drawImage(logoImage, x, y, logoWidth, logoHeight);
                
                // Resetar opacidade
                ctx.globalAlpha = 1.0;
                
                // Salvar a imagem processada
                const processedDataURL = canvas.toDataURL('image/png');
                processedImages.push({
                    dataURL: processedDataURL,
                    filename: item.file.name.replace(/\.[^/.]+$/, "") + "_com_marca.png"
                });
                
                // Atualizar contador e barra de progresso
                processedCount++;
                const progress = Math.round((processedCount / totalImages) * 100);
                progressBar.style.width = progress + '%';
                progressBar.textContent = progress + '%';
                
                // Verificar se todas as imagens foram processadas
                if (processedCount === totalImages) {
                    finishProcessing();
                }
            }, index * 100); // Processamento escalonado para não bloquear a UI
        });
    }

    function finishProcessing() {
        setTimeout(() => {
            // Esconder indicadores de carregamento
            loadingOverlay.style.display = 'none';
            
            // Atualizar visualização
            previewContainer.innerHTML = '';
            processedImages.forEach(item => {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                
                const img = document.createElement('img');
                img.src = item.dataURL;
                img.alt = item.filename;
                
                previewItem.appendChild(img);
                previewContainer.appendChild(previewItem);
            });
            
            // Mostrar botão de download
            downloadAllButton.style.display = 'block';
        }, 500);
    }

    function downloadAllImages() {
        if (processedImages.length === 0) return;
        
        // Se houver apenas uma imagem, baixar diretamente
        if (processedImages.length === 1) {
            const link = document.createElement('a');
            link.href = processedImages[0].dataURL;
            link.download = processedImages[0].filename;
            link.click();
            return;
        }
        
        // Para múltiplas imagens, criar um arquivo ZIP
        loadingOverlay.style.display = 'flex';
        
        // UsING JSZip 
        import('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js')
            .then(() => {
                const zip = new JSZip();
                
                // Adicionar cada imagem ao ZIP
                processedImages.forEach(item => {
                    // Converter dataURL para Blob
                    const byteString = atob(item.dataURL.split(',')[1]);
                    const mimeString = item.dataURL.split(',')[0].split(':')[1].split(';')[0];
                    const ab = new ArrayBuffer(byteString.length);
                    const ia = new Uint8Array(ab);
                    
                    for (let i = 0; i < byteString.length; i++) {
                        ia[i] = byteString.charCodeAt(i);
                    }
                    
                    const blob = new Blob([ab], {type: mimeString});
                    zip.file(item.filename, blob);
                });
                
                // Gerar o arquivo ZIP
                zip.generateAsync({type: 'blob'})
                    .then(content => {
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(content);
                        link.download = 'imagens_com_marca.zip';
                        link.click();
                        
                        // Limpar e esconder o indicador de carregamento
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
