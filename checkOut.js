import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgyWGXCAIR6NiKfkzkWZbBeOMPRDNwMg4",
  authDomain: "contactus-a9d19.firebaseapp.com",
  databaseURL: "https://contactus-a9d19-default-rtdb.firebaseio.com",
  projectId: "contactus-a9d19",
  storageBucket: "contactus-a9d19.firebasestorage.app",
  messagingSenderId: "290565306453",
  appId: "1:290565306453:web:0995f78c2a17d582903cdc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const productsRef = ref(db, "products");

// Function to display products in cart
function displayCartItems(snapshot) {
  const cartContainer = document.getElementById("cart-items");
  cartContainer.innerHTML = ""; // Clear existing items
  let totalPrice = 0;

  snapshot.forEach((childSnapshot) => {
    const product = childSnapshot.val();
    totalPrice += parseFloat(product.price);

    const productHTML = `
      <div class="card mb-3">
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${product.image}" class="img-fluid rounded-start" alt="${product.name}">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">$${product.price}</p>
              <button class="btn btn-danger remove-btn" data-id="${childSnapshot.key}">Remove</button>
            </div>
          </div>
        </div>
      </div>
    `;

    cartContainer.innerHTML += productHTML;
  });

  // Update total price
  document.querySelector(".total-price").textContent = `$${totalPrice.toFixed(
    2
  )}`;

  // Add event listeners for removing items
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      removeItem(this.getAttribute("data-id"));
    });
  });
}

// Fetch products from Firebase and display
onValue(productsRef, (snapshot) => {
  if (snapshot.exists()) {
    displayCartItems(snapshot);
  } else {
    document.getElementById("cart-items").innerHTML =
      "<p>No products in the cart.</p>";
  }
});

// Function to remove an item from Firebase
function removeItem(productId) {
  const productRef = ref(db, `products/${productId}`);
  remove(productRef).then(() => {
    alert("Item removed from cart.");
  });
}

document
  .getElementById("paymentForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    clearMessages([
      "cardNumberError",
      "nameOnCardError",
      "expirationError",
      "cvvError",
    ]);

    const cardNumber = document.getElementById("typeText").value;
    const nameOnCard = document.getElementById("typeName").value;
    const expiration = document.getElementById("typeExp").value;
    const cvv = document.getElementById("typeCvv").value;

    let valid = true;

    if (!validateCardNumber(cardNumber)) {
      displayMessage(
        "cardNumberError",
        "Please enter a valid card number.",
        "error"
      );
      valid = false;
    }

    if (!nameOnCard.trim()) {
      displayMessage("nameOnCardError", "Name on card is required.", "error");
      valid = false;
    }

    if (!validateExpiration(expiration)) {
      displayMessage(
        "expirationError",
        "Please enter a valid expiration date (MM/YY).",
        "error"
      );
      valid = false;
    }

    if (!validateCVV(cvv)) {
      displayMessage("cvvError", "CVV must be exactly 3 digits.", "error");
      valid = false;
    }

    if (valid) {
      const successMessage = document.getElementById("paymentSuccessMessage");
      successMessage.textContent = "Payment successful!";
      successMessage.style.display = "block";

      setTimeout(() => {
        window.location.href = "index.html";
      }, 3000);
    }
  });

function displayMessage(elementId, message, type) {
  const element = document.getElementById(elementId);
  element.textContent = message;
  element.style.color = type === "error" ? "red" : "green";
}

function clearMessages(ids) {
  ids.forEach((id) => {
    const element = document.getElementById(id);
    element.textContent = "";
  });
}

function validateCardNumber(cardNumber) {
  return /^\d{16}$/.test(cardNumber.replace(/\s/g, ""));
}

function validateExpiration(expiration) {
  const expPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
  const [month, year] = expiration.split("/").map(Number);
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear() % 100;
  return (
    expPattern.test(expiration) &&
    (year > currentYear || (year === currentYear && month >= currentMonth))
  );
}

function validateCVV(cvv) {
  return /^\d{3}$/.test(cvv);
}

let username = localStorage.getItem("username");
document.getElementById("nav-username").textContent = username;
document.getElementById("nav-username").style.margin = "10px";
