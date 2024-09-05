const apiUrl = 'https://aid1.onrender.com/api/products?populate=*';
const apiToken = ''; // تأكد من إضافة التوكن الصحيح هنا

async function fetchData() {
    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${apiToken}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched data:', data);
        displayProducts(data.data);
    } catch (error) {
        console.error('Error fetching data:', error);
        displayError(`حدث خطأ أثناء تحميل البيانات: ${error.message}`);
    }
}

function displayProducts(products) {
    const dataContainer = document.getElementById('data-container');
    if (!dataContainer) {
        console.error('Element with id "data-container" not found.');
        return;
    }
    dataContainer.innerHTML = '';

    if (Array.isArray(products) && products.length > 0) {
        products.forEach(product => {
            const dataCard = document.createElement('div');
            dataCard.className = 'product-card';
            dataCard.dataset.productId = product.id;

            const title = createElement('h3', '', product.attributes.Title || 'No Title');
            const description = createElement('p', '', product.attributes.Description || 'No Description');
            const price = createElement('span', '', `السعر: ${product.attributes.Price || 'No Price'} دج`);

            const imageContainer = document.createElement('div');
            imageContainer.className = 'data-image';
            const imageUrl = product.attributes.Image?.data?.[0]?.attributes?.formats?.thumbnail?.url;
            if (imageUrl) {
                const imgElement = document.createElement('img');
                imgElement.src = imageUrl;
                imgElement.alt = product.attributes.Title || 'No Image';
                imageContainer.appendChild(imgElement);
            } else {
                imageContainer.innerHTML = '<p>لا توجد صورة.</p>';
            }

            dataCard.appendChild(imageContainer);
            dataCard.appendChild(title);
            dataCard.appendChild(description);
            dataCard.appendChild(price);
            
            const orderButton = createElement('a', 'order-btn', 'اشترِ الآن');
            orderButton.href = `order.html?productId=${product.id}`;
            dataCard.appendChild(orderButton);

            dataCard.addEventListener('click', () => {
                window.location.href = `order.html?productId=${product.id}`;
            });

            dataContainer.appendChild(dataCard);
        });
    } else {
        dataContainer.innerHTML = '<p>لا توجد منتجات لعرضها.</p>';
    }
}

function filterProducts() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        if (title.includes(searchInput)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function displayError(message) {
    const dataContainer = document.getElementById('data-container');
    if (!dataContainer) {
        console.error('Element with id "data-container" not found.');
        return;
    }
    dataContainer.innerHTML = `<p class="error-message">${message}</p>`;
}

function createElement(tag, className, textContent) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');
    
    if (productId) {
        document.getElementById('product-id').value = productId;
        fetchProductDetails(productId);
    }

    fetchData();
});

async function fetchProductDetails(productId) {
    const apiUrl = `https://aid1.onrender.com/api/products/${productId}?populate=*`;
    const apiToken = ''; // تأكد من إضافة التوكن الصحيح هنا

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${apiToken}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayProductDetails(data.data);
    } catch (error) {
        console.error('Error fetching product details:', error);
        displayError(`حدث خطأ أثناء تحميل تفاصيل المنتج: ${error.message}`);
    }
}

function displayProductDetails(product) {
    const productDetails = document.getElementById('product-details');
    if (!productDetails) {
        console.error('Element with id "product-details" not found.');
        return;
    }
    productDetails.innerHTML = '';

    const title = createElement('h3', '', product.attributes.Title || 'No Title');
    const description = createElement('p', '', product.attributes.Description || 'No Description');
    const price = createElement('span', '', `السعر: ${product.attributes.Price || 'No Price'} دج`);
    
    const imageGallery = document.createElement('div');
    imageGallery.className = 'image-gallery';

    const mainImage = document.createElement('img');
    mainImage.className = 'main-image';
    mainImage.src = product.attributes.Image?.data?.[0]?.attributes?.formats?.thumbnail?.url || '';
    mainImage.alt = product.attributes.Title || 'No Image';
    imageGallery.appendChild(mainImage);

    const controls = document.createElement('div');
    controls.className = 'controls';

    const prevButton = document.createElement('button');
    prevButton.textContent = '◄';
    controls.appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.textContent = '►';
    controls.appendChild(nextButton);

    imageGallery.appendChild(controls);
    
    if (product.attributes.Image?.data?.length > 1) {
        const images = product.attributes.Image.data;
        let currentIndex = 0;

        function updateImage(index) {
            const imageUrl = images[index]?.attributes?.formats?.thumbnail?.url;
            if (imageUrl) {
                mainImage.src = imageUrl;
                mainImage.alt = product.attributes.Title || 'No Image';
            }
        }

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
            updateImage(currentIndex);
        });

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
            updateImage(currentIndex);
        });

        // Load initial image
        updateImage(currentIndex);
    } 

    productDetails.appendChild(imageGallery);
    productDetails.appendChild(title);
    productDetails.appendChild(description);
    productDetails.appendChild(price);
}

function submitOrder(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    fetch(form.action, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Order submitted:', data);
        alert('تم إرسال الطلب بنجاح!');
        form.reset();
    })
    .catch(error => {
        console.error('Error submitting order:', error);
        alert('حدث خطأ أثناء إرسال الطلب.');
    });
}



