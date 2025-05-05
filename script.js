//Deskripsi produk 
function showDescModal(imgElement) {
  const name = imgElement.alt;
  const imgSrc = imgElement.src;
  const description = `
  Isi Paket Komplit ${name} Spesial!<br>
  1 ${name}<br>
  5 bakso kecil,<br>
  50ml biang kuah gurih,<br>
  tetelan+lemak lembut,<br> 
  bihun, dan sambal homemade pedas mantap!
  `;

  document.getElementById('desc-modal-title').innerText = name;
  document.getElementById('desc-modal-image').src = imgSrc;
  document.getElementById('desc-modal-description').innerHTML = description;

  document.getElementById('desc-modal-add-button').setAttribute('data-name', name);
  document.getElementById('productDescModal').style.display = 'flex';
}

function closeDescModal() {
  document.getElementById('productDescModal').style.display = 'none';
}

function addToCartFromDesc() {
  const name = document.getElementById('desc-modal-add-button').getAttribute('data-name');
  const inputs = document.querySelectorAll('.qty-input');

  inputs.forEach(input => {
    if (input.getAttribute('data-name') === name) {
      // Panggil tombol "+Keranjang" yang terkait
      const button = input.nextElementSibling;
      addQty(button); // biar 1x aja yang nambah
    }
  });

  closeDescModal();
}


let keranjang = [];

function tambahDanMasukkan(inputId) {
  const input = document.getElementById(inputId);
  const name = input.dataset.name;
  const price = parseInt(input.dataset.price);

  // Tambah nilai input
  let qty = parseInt(input.value) || 0;
  qty += 1;
  input.value = qty;

  // Cek apakah produk sudah ada di keranjang
  const existingItem = keranjang.find(item => item.name === name);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    keranjang.push({ name: name, price: price, qty: 1 });
  }

  alert(`1x ${name} dimasukkan ke keranjang!`);

  console.log("Keranjang:", keranjang);
  localStorage.setItem("keranjangPawonSedulur", JSON.stringify(keranjang));
}


function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}


//nav
const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
  link.addEventListener('click', function() {
    navLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});

const sections = document.querySelectorAll('section'); // pastikan setiap bagian (beranda, menu, testimoni) pakai <section>
const navItems = document.querySelectorAll('nav a');

window.addEventListener('scroll', debounce(() => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (pageYOffset >= sectionTop - 60) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').includes(current)) {
      link.classList.add('active');
    }
  });
}, 100)); // 100ms delay, bisa disesuaikan

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
      "Bakso Keju": "Bakso Urat",
      "Bakso Mercon 1kg": "Bakso Keju Pedas 1kg",
      "Bakso Keju Pedas 1kg": "Bakso Mercon 1kg",
      "Bakso Tahu 1kg": "Bakso Telur",
      "Bakso Telur 1kg": "Bakso Tahu 1kg",
      "Bakso Urat 1kg": "Bakso Keju 1kg atau Bakso Kecil 1kg",
      "Bakso Kecil 1kg": "Bakso Keju 1kg atau Bakso Urat 1kg",
      "Bakso Keju 1kg": "Bakso Urat 1kg atau Bakso Kecil 1kg",
      
      
    };

    const alternatif = alternatifMap[name] || "produk lainnya";
    showModal(`${name} sedang kosong Lur...`, `Tapi cobain juga ${alternatif} lur, rasanya gak kalah mantul!`);
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
