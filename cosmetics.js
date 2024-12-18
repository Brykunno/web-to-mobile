const express = require('express');
const qrcode = require('qrcode');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Parse JSON bodies for POST requests
app.use(bodyParser.json());

// Serve static files (like images)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

let sales = 0; // Track total sales

app.get('/cosmetics', (req, res) => {
  const jsonData = [
    { name: 'Gilded Glamour', price: 42, src: 'assets/gilded_glamour.png' },
    { name: 'Stay Curious', price: 90, src: 'assets/stayc.png' },
    { name: 'Golden Girls', price: 88, src: 'assets/golden_girls.png' },
    { name: 'Private Label BB Cream Liquid Tinted Moisturize Custom Foundation Makeup for Black Women Customized Package Face Skin Female 30g', price: 48, src: 'assets/q1.png' },
    { name: 'Customized Flower Lip Balm Pencil Foil Jelly Lipstick with Color-changing Feature Moisturizing Makeup Gold Waterproof Women 3.2g', price: 73, src: 'assets/l1.png' },
    { name: 'wholesale Private Label thin Slim Eyebrow Pencil Custom Logo Own Brand Makeup Safe and Lasting Cream for Daily Use for Cosmetics', price: 85, src: 'assets/b1.png' },
    { name: 'GRIO Eternal Flower Anti-Acne aqua luster Clearing Face Sheet Mask Acne Treatment Hydrating Facial Masks sheet maskes korean', price: 96, src: 'assets/g1.png' },
    { name: 'Luxury Skincare Packaging Glass 40Ml 100Ml Empty 50g Cream Cosmetic Glass Jar Logo Custom Toner Lotion Pump Glass Bottle Set', price: 53, src: 'assets/d1.png' },
  ];

  const generateQRCodePromises = jsonData.map((product) =>
    qrcode.toDataURL(JSON.stringify(product)).then((qrcodeurl) => ({
      ...product,
      qrcodeurl,
    }))
  );

  Promise.all(generateQRCodePromises)
    .then((qrCodes) => {
      const html = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LuxeBloom - Cosmetics</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f8f9fa;
    }

    /* Navbar Styling */
    .navbar {
      background-color: #343a40;
    }

    .navbar-brand {
      color: #f8f9fa;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .navbar-brand:hover {
      color: #e9ecef;
    }

    /* Main Title */
    h1 {
      text-align: center;
      margin-top: 20px;
      margin-bottom: 30px;
      color: #343a40;
    }

    /* Card Styling */
    .card {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      overflow: hidden;
    }

    .card img {
      height: 180px;
      object-fit: cover;
    }

    .card-title {
      font-size: 1.2rem;
      color: #343a40;
      font-weight: 600;
    }

    .card-text {
      font-size: 0.9rem;
      color: #495057;
    }

    /* Accordion Styling */
    .accordion-button {
      background-color: #e9ecef;
      color: #495057;
      font-size: 0.9rem;
    }

    .accordion-button:hover {
      background-color: #dee2e6;
    }

    /* Footer Styling */
    footer {
      background-color: #343a40;
      color: #f8f9fa;
      text-align: center;
      padding: 15px 0;
      margin-top: 30px;
    }

    footer a {
      color: #e9ecef;
      text-decoration: none;
    }

    footer a:hover {
      text-decoration: underline;
    }

    .total-sales {
      font-size: 1.5rem;
      color: #495057;
      text-align: center;
      margin-bottom: 20px;
    }
  </style>
</head>

<body>
  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg navbar-dark sticky-top">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">LuxeBloom</a>
    </div>
  </nav>

  <!-- Main Content -->
  <h1>Explore Our Products</h1>
  <div class="total-sales"><strong>Total Sales:</strong> $<span id="total-sales">0</span></div>

  <div class="container">
    <div class="row">
      ${qrCodes
        .map(
          (product, index) => `
          <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="card h-100">
              <img src="${product.src}" class="card-img-top" alt="Image of ${product.name}">
              <div class="card-body text-center">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">Price: $${product.price}</p>

                <div class="accordion accordion-flush" id="accordionFlushExample-${index}">
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="heading-${index}">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#flush-collapse-${index}" aria-expanded="false"
                        aria-controls="flush-collapse-${index}">
                        Show QR Code
                      </button>
                    </h2>
                    <div id="flush-collapse-${index}" class="accordion-collapse collapse"
                      aria-labelledby="heading-${index}" data-bs-parent="#accordionFlushExample-${index}">
                      <div class="accordion-body">
                        <img src="${product.qrcodeurl}" alt="QR Code for ${product.name}" class="img-fluid">
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        `
        )
        .join('')}
    </div>
  </div>

  <!-- Footer -->
  <footer>
    <p>&copy; 2024 LuxeBloom | <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
  </footer>

  <script>
    // Update total sales dynamically
    const totalSalesElem = document.getElementById('total-sales');

    // Fetch current sales from the server
    fetch('/sales')
      .then(response => response.json())
      .then(data => {
        totalSalesElem.textContent = data.sales;
      });

    // Handle purchase button clicks (if applicable)
    document.querySelectorAll('.purchase-btn').forEach(button => {
      button.addEventListener('click', () => {
        const productName = button.getAttribute('data-name');
        const productPrice = button.getAttribute('data-price');

        fetch('/purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productName, productPrice })
        })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              totalSalesElem.textContent = data.sales;
              alert(data.message);
            } else {
              alert('Purchase failed: ' + data.message);
            }
          });
      });
    });
  </script>
</body>

</html>
`;
      res.send(html);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error generating QR codes');
    });
});

// Endpoint to handle purchases
app.post('/purchase', (req, res) => {
  const { productName, productPrice } = req.body;

  if (!productName || !productPrice) {
    return res.status(400).send({ success: false, message: 'Invalid product details!' });
  }

  sales += Number(productPrice);

  console.log(`Purchase received: ${productName}, $${productPrice}`);
  
  // Send response with updated sales count
  res.send({ success: true, message: 'Purchase recorded successfully!', sales });
});

// Endpoint to get the current sales total
app.get('/sales', (req, res) => {
  res.send({ sales });
});

app.listen(PORT,'192.168.41.206', () => {
  console.log(`Server is running on http://192.168.41.206:${PORT}`);
});
