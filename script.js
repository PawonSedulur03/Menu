// notice 
function addQty(button) {
  let input = button.parentElement.querySelector('input[type="number"]');
  let name = input.dataset.name;

  // Jika input disabled (stok kosong), munculkan modal alternatif
  if (input.disabled) {
    const alternatifMap = {
      "Bakso Mercon": "Bakso Keju Pedas",
      "Bakso Keju Pedas": "Bakso Mercon",
      "Bakso Tahu": "Bakso Telur",
      "Bakso Telur": "Bakso Tahu",
      "Bakso Urat": "Bakso Keju",
      "Bakso Keju": "Bakso Urat"
    };

    const alternatif = alternatifMap[name] || "produk lainnya";
    showModal(`${name} sedang kosong Lur...`, `Tapi cobain juga ${alternatif}, rasanya gak kalah mantul!`);
    return; // Stop di sini, jangan lanjut nambah qty
  }

  // Jika stok aman, lanjut tambahkan qty
    input.value = parseInt(input.value) + 1; document.getElementById('click-sound').play();
    showToast(`${name} ditambahkan ke keranjang!`);
  }
  

  function showToast(pesan) {
    const toast = document.getElementById('toast');
    toast.innerHTML = pesan;
    toast.style.display = 'block';
    toast.classList.add('toast-show');
    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => { toast.style.display = 'none'; }, 500);
    }, 2500);
  }

  function showModal(title, message) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-message').innerText = message;
    document.getElementById('outOfStockModal').style.display = 'flex';
  }

  function closeModal() {
    document.getElementById('outOfStockModal').style.display = 'none';
  }

//ringkasan pesanan 
function showCartSummary() {
  const inputs = document.querySelectorAll('.product input');
  let pesan = [];
  let total = 0;

  inputs.forEach(input => {
    const qty = parseInt(input.value);
    const name = input.dataset.name;
    const price = parseInt(input.dataset.price);
    if (qty > 0) {
      pesan.push(`<li>${name} (${qty}) - ¥${price * qty}</li>`);
      total += price * qty;
    }
  });

  if (pesan.length > 0) {
    const cartSummary = document.getElementById('cart-summary');
    cartSummary.innerHTML = `
      <h4>Ringkasan Pesanan:</h4>
      <ul>${pesan.join('')}</ul>
      <p><strong>Total: ¥${total}</strong></p>
    `;
    cartSummary.style.display = 'block';
    document.getElementById('wa-form').style.display = 'block';

    // Isi hidden input pesanan
    document.getElementById('pesananInput').value = pesan.join(', ');
  } else {
    alert('Keranjang masih kosong lur!');
    document.getElementById('cart-summary').style.display = 'none';
    document.getElementById('wa-form').style.display = 'none';
  }
}

//update stok
// Panggil fungsi ini di awal (misalnya saat halaman load)
window.addEventListener('DOMContentLoaded', () => {
  fetchStokData();
});

function fetchStokData() {
  fetch('stok.json')
    .then(response => response.json())
    .then(data => {
      const inputs = document.querySelectorAll('.product input');
      inputs.forEach(input => {
        const name = input.dataset.name;
        const stok = data[name];
        if (stok === 0) {
          input.disabled = true;
        }
      });
    })
    .catch(err => console.error("Gagal ambil data stok:", err));
}


function showModal(title, message) {
  document.getElementById('modal-title').innerText = title;
  document.getElementById('modal-message').innerText = message;
  document.getElementById('outOfStockModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('outOfStockModal').style.display = 'none';
}

// Kurang quantity
function removeQty(button) {
  const input = button.closest('.product').querySelector('input[type="number"]');
  if (input && parseInt(input.value) > 0) {
    input.value = parseInt(input.value) - 1;
    const clickSound = document.getElementById("click-sound");
    if (clickSound) clickSound.play();
  }
}

// Checkout ke WA
document.getElementById("wa-form").addEventListener("submit", function(e) {
  e.preventDefault();
  
  const inputs = document.querySelectorAll('.product input');
  let pesan = [];
  let total = 0;
  
  inputs.forEach(input => {
    const qty = parseInt(input.value);
    const name = input.dataset.name;
    const price = parseInt(input.dataset.price);
    if (qty > 0) {
      pesan.push(`${name} (${qty}) - ¥${price * qty}`);
      total += price * qty;
    }
  });
  
  if (pesan.length == 0) {
    alert('Keranjang masih kosong lur!');
    return;
  }

  const nama = document.getElementById('nama').value;
  const alamat = document.getElementById('alamat').value;
  const pengiriman = document.getElementById('pengiriman').value;
  const pembayaran = document.getElementById('pembayaran').value;
  const catatan = document.getElementById('catatan').value;
  
  const message = `Halo Admin Pawon Sedulur! Saya mau pesan:\n\n${pesan.join('\n')}\n\nTotal: ¥${total}\n\nNama: ${nama}\nAlamat: ${alamat}\nPengiriman: ${pengiriman}\nPembayaran: ${pembayaran}\nCatatan: ${catatan}`;
  
  const url = `https://wa.me/6289660111433?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
});

//Testimoni
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const pagination = document.querySelector('.pagination');
let currentSlide = 0;

// Create pagination dots
slides.forEach((_, index) => {
  const dot = document.createElement('div');
  dot.classList.add('pagination-dot');
  if (index === 0) dot.classList.add('active');
  dot.addEventListener('click', () => moveToSlide(index));
  pagination.appendChild(dot);
});

const dots = document.querySelectorAll('.pagination-dot');

function moveToSlide(index) {
  currentSlide = index;
  slider.style.transform = `translateX(-${index * 100}%)`;
  updateDots();
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  moveToSlide(currentSlide);
}

function updateDots() {
  dots.forEach(dot => dot.classList.remove('active'));
  dots[currentSlide].classList.add('active');
}

// Auto slide every 4s
let autoSlide = setInterval(nextSlide, 4000);

// Swipe Support
let startX = 0;
slider.addEventListener('touchstart', e => startX = e.touches[0].clientX);
slider.addEventListener('touchend', e => {
  const endX = e.changedTouches[0].clientX;
  if (startX - endX > 50) nextSlide();
  else if (endX - startX > 50) {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    moveToSlide(currentSlide);
  }
});
