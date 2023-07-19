class PDF {
    constructor(pdfUrl) {
        this.pdfUrl = pdfUrl;
        this.pdfUrl = 'https://kn-staging.nodered.vip/books/docs/eyJucyI6IjFXS0ZOal84MzhSNlJRVHRsa2lrXzBscjNQcG4tQjVKNSIsImZpbGUiOiJib29rLnBkZiJ9';
        this.pdfContainer = document.getElementById("pdfContainer");
        this.scale = 1;  // Initialize scale
        this.highlightTimeout = 0;
        this.selectedText = "";
        // Initialize PDF.js settings
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js';

        // Listen for the scroll event
        this.pdfContainer.addEventListener('scroll', () => {
            // Get all page elements
            const pageElements = Array.from(this.pdfContainer.children);
            // Find the first page element that is (partially) visible in the viewport
            const visiblePageElement = pageElements.find(pageElement => {
                const rect = pageElement.getBoundingClientRect();
                return rect.top >= 0 && rect.top < window.innerHeight;
            });

            // Update this.nowPageNum
            if (visiblePageElement) {
                this.nowPageNum = parseInt(visiblePageElement.id.split('-')[1]);
                console.log("Page:", this.nowPageNum);
            }
        });
    }

    async zoomIn() {
        this.scale += 0.2;
        await this.load();  // Re-load the PDF after changing the scale
    }

    async zoomOut() {
        this.scale -= 0.2;
        await this.load();  // Re-load the PDF after changing the scale
    }

    async fitWidth() {
        // Get the first page
        const page = await this.pdfDoc.getPage(1);
        // Get the viewport for the page at scale 1
        const unscaledViewport = page.getViewport({ scale: 1 });
        // Calculate the scale necessary to fit the page width to the container width
        this.scale = this.pdfContainer.clientWidth / unscaledViewport.width;
        // Re-load the PDF
        await this.load();
    }

    async load() {
        try {
            this.pdfContainer.innerHTML = '';
            // Start loading the PDF
            const pdfDoc = await pdfjsLib.getDocument(this.pdfUrl).promise;
            this.pdfDoc = pdfDoc; // Save the pdfDoc
            const page = await this.pdfDoc.getPage(1);
            // Get the viewport for the page at scale 1
            const unscaledViewport = page.getViewport({ scale: 1 });
            // Calculate the scale necessary to fit the page width to the container width
            this.scale = this.pdfContainer.clientWidth / unscaledViewport.width;
            await new Promise(r => setTimeout(r, 500));
            //
            for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
                await this.renderPage(pageNum);
            }
        } catch (error) {
            // Handle any errors that occur during loading
            console.error('Error loading PDF:', error);
        }
    }

    async find(keyword) {
        let keywords = keyword.split(' ');
    
        for (let pageNum = 1; pageNum <= this.pdfDoc.numPages; pageNum++) {
            const page = await this.pdfDoc.getPage(pageNum);
            const textContent = await page.getTextContent();
            let textItems = textContent.items.map(item => item.str);
            let pageText = textItems.join(' ');
    
            if (keywords.every(kw => pageText.includes(kw))) {
                this.page(pageNum);
    
                var pageDiv = document.getElementById("page-" + pageNum);
                if (pageDiv) {
                    var textLayerDiv = pageDiv.querySelector(".textLayer");
                    if (textLayerDiv) {
                        var textElements = Array.from(textLayerDiv.getElementsByTagName('span'));
    
                        let matches = [];
                        let matchIndex = 0;
    
                        for (let i = 0; i < textElements.length; i++) {
                            if (textElements[i].textContent.includes(keywords[matchIndex])) {
                                matches.push(textElements[i]);
                                matchIndex++;
    
                                if (matchIndex >= keywords.length) {
                                    matches.forEach(element => element.classList.add('highlight'));
                                    matches = [];
                                    matchIndex = 0;
                                }
                            } else {
                                matches = [];
                                matchIndex = 0;
                            }
                        }
                    }
                }
                break;
            }
        }
    }
        




    nowPage() {
        return this.nowPageNum;
    }

    page(pageNum) {
        this.nowPageNum = pageNum;
        // Scroll to the specified page
        var pageDiv = document.getElementById("page-" + pageNum);
        if (pageDiv) {
            pageDiv.scrollIntoView();
        }
    }

    async renderPage(pageNum, keyword = null) {
        console.log("load :", this.scale);
        const page = await this.pdfDoc.getPage(pageNum);
        var viewport = page.getViewport({ scale: this.scale });  // Use the current scale
        var canvas = document.createElement("canvas");
        var context = canvas.getContext('2d');
        var textLayerDiv = document.createElement("div");
        var pageDiv = document.createElement("div");

        // Set an ID for the pageDiv
        pageDiv.id = "page-" + pageNum;

        // Set up pageDiv
        pageDiv.style.position = 'relative';
        pageDiv.style.width = viewport.width + "px";
        pageDiv.style.height = viewport.height + "px";
        pageDiv.style.marginBottom = '20px';

        // Set up text layer
        textLayerDiv.className = "textLayer";
        textLayerDiv.style.width = "100%";
        textLayerDiv.style.height = "100%";
        textLayerDiv.style.position = 'absolute';
        textLayerDiv.style.top = "0";
        textLayerDiv.style.left = "0";
        textLayerDiv.style.setProperty("--scale-factor", this.scale);

        // Set up the canvas
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.position = 'absolute';
        canvas.style.top = "0";
        canvas.style.left = "0";

        // Append elements to the pageDiv
        pageDiv.appendChild(canvas);
        pageDiv.appendChild(textLayerDiv);

        // Retrieve the text content and render it onto the textLayer
        const textContent = await page.getTextContent();

        // Render the page onto the canvas
        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;

        // Render the text layer
        pdfjsLib.renderTextLayer({
            textContentSource: textContent,
            container: textLayerDiv,
            viewport: viewport,
            textDivs: [],
            enhanceTextSelection: true,
            textContentStream: true
        });
        // Append the rendered page to the container
        this.pdfContainer.appendChild(pageDiv);
        var self = this;
        // Add event listener for text selection
        textLayerDiv.addEventListener("mouseup", function (event) {
            var selectedRange = window.getSelection().getRangeAt(0);
            this.selectedText = selectedRange.toString().trim();
            setTimeout(function () {
                console.log(self.selectedText);
            }, 250);
        });

        textLayerDiv.addEventListener("mouseover", function (event) {
            if (this.highlightTimeout) clearTimeout(this.highlightTimeout);

            this.highlightTimeout = setTimeout(function () {
                var target = event.target;

                // Skip if the target is not a span (i.e., not a text element)
                if (target.tagName.toLowerCase() !== 'span') return;

                // Remove all existing highlights
                var highlightedElements = document.querySelectorAll('.highlight');
                highlightedElements.forEach(function (element) {
                    element.classList.remove('highlight');
                });

                // Get the position of the target element
                var targetRect = target.getBoundingClientRect();

                // Get all text elements
                var textElements = Array.from(textLayerDiv.getElementsByTagName('span'));

                // Function to check if an element is in the same block as the target
                var isInSameBlock = function (element) {
                    var rect = element.getBoundingClientRect();

                    // Check if the element is in the same line as the target
                    // This is a simple check and might not work correctly for all PDFs
                    return Math.abs(rect.top - targetRect.top) < rect.height * 3;
                };

                // Get all elements in the same block
                var sameBlockElements = textElements.filter(isInSameBlock);

                if (sameBlockElements.length) {
                    console.log('Text block:', sameBlockElements.map(function (element) {
                        return element.textContent;
                    }).join(' '));

                    // Highlight all elements in the same block
                    sameBlockElements.forEach(function (element) {
                        element.classList.add('highlight');
                    });
                }
            }, 250);
        });

    }
}