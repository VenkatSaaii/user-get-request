const apiUrl = 'https://crudcrud.com/api/af0aba0ec49345ab8b2294a1955366fe/chocolates';

// Function to add item
// Function to add item
function addItem() {
    const candyNameInput = document.getElementById('candyName');
    const descriptionInput = document.getElementById('description');
    const priceInput = document.getElementById('price');
    const quantityInput = document.getElementById('quantity');

    const candyName = candyNameInput.value;
    const description = descriptionInput.value;
    const price = priceInput.value;
    const quantity = quantityInput.value;

    const candyData = {
        candyName,
        description,
        price,
        quantity
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(candyData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Item added successfully:', data);
        // Clear input fields
        candyNameInput.value = '';
        descriptionInput.value = '';
        priceInput.value = '';
        quantityInput.value = '';
        // Display items again
        displayItems();
    })
    .catch(error => console.error('Error adding item:', error));
}


// Function to display items
function displayItems() {
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const candyListDiv = document.getElementById('candyList');
        candyListDiv.innerHTML = ''; // Clear previous content

        data.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.id = item._id;
            itemDiv.className = 'candy-item';
            itemDiv.innerHTML = `
                <p>Candy Name: ${item.candyName}</p>
                <p>Description: ${item.description}</p>
                <p>Price: ${item.price}</p>
                <p class="quantity">Quantity: ${item.quantity}</p>
                <button onclick="buyItem('${item._id}', 1)">Buy 1</button>
                <button onclick="buyItem('${item._id}', 2)">Buy 2</button>
                <button onclick="buyItem('${item._id}', 3)">Buy 3</button>
            `;
            candyListDiv.appendChild(itemDiv);
        });
    })
    .catch(error => console.error('Error fetching items:', error));
}

// Function to buy item
function buyItem(itemId, quantityToBuy) {
    fetch(`${apiUrl}/${itemId}`)
    .then(response => response.json())
    .then(item => {
        const updatedQuantity = item.quantity - quantityToBuy;
        if (updatedQuantity < 0) {
            alert('Sorry, chocolates are out of stock!');
            return;
        }

        // Update quantity on the screen
        const candyItem = document.getElementById(itemId);
        candyItem.querySelector('.quantity').textContent = `Quantity: ${updatedQuantity}`;

        // Update quantity in CRUD CRUD
        fetch(`${apiUrl}/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: updatedQuantity })
        })
        .then(response => response.json())
        .then(data => {
            console.log(`Bought ${quantityToBuy} chocolates`);
        })
        .catch(error => console.error('Error buying item:', error));
    })
    .catch(error => console.error('Error fetching item to buy:', error));
}

// Initial display of items
displayItems();

