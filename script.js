// ==========================================
// KONFIGURASI AWAL
// ==========================================
const PIN = "2000"; // Ganti sesuai keinginan bos
const STORAGE_KEY = "tuanMuZenLinks";

// Data default jika belum ada
const defaultLinks = [
    { emoji: "🌐", title: "Website Resmi", url: "https://tuanmuzen.com" },
    { emoji: "📸", title: "Instagram", url: "https://www.instagram.com/papizen_?igsi=NGhiNnhleHl5NDRw" },
    { emoji: "🐦", title: "Twitter/X", url: "https://twitter.com/tuanmuzen" },
    { emoji: "🎮", title: "Discord", url: "https://discord.gg/garanobodys_84102" },
    { emoji: "📺", title: "YouTube", url: "https://youtube.com/@zenstore" },
    { emoji: "☕", title: "Trakteer", url: "https://trakteer.id/tuanmuzen" }
];

// ==========================================
// FUNGSI CRUD LINK
// ==========================================
function getLinks() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        try {
            return JSON.parse(data);
        } catch (e) {
            return defaultLinks;
        }
    }
    return defaultLinks;
}

function saveLinks(links) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}

function renderLinks(links) {
    const container = document.getElementById('linkList');
    if (!links || links.length === 0) {
        container.innerHTML = `<div style="text-align:center;color:#666;padding:20px;">Belum ada link, bos. Tambah via admin panel.</div>`;
        return;
    }
    container.innerHTML = links.map((link, index) => `
        <a href="${link.url}" target="_blank" class="link-item" data-index="${index}">
            <span class="emoji">${link.emoji || '🔗'}</span>
            <span class="title">${link.title}</span>
            <span class="arrow">➜</span>
        </a>
    `).join('');
}

function renderManageLinks(links) {
    const container = document.getElementById('manageLinks');
    if (!links || links.length === 0) {
        container.innerHTML = `<div style="color:#666;padding:10px;">Belum ada link.</div>`;
        return;
    }
    container.innerHTML = links.map((link, index) => `
        <div class="link-manage-item">
            <span style="font-size:20px;">${link.emoji || '🔗'}</span>
            <span class="info">${link.title} <small style="color:#888;">${link.url}</small></span>
            <button class="edit-btn" onclick="editLink(${index})">✏️</button>
            <button onclick="deleteLink(${index})">🗑️</button>
        </div>
    `).join('');
}

// ==========================================
// FUNGSI ADMIN (TAMBAH, EDIT, HAPUS)
// ==========================================
function addLink() {
    const emoji = document.getElementById('newEmoji').value.trim() || '🔗';
    const title = document.getElementById('newTitle').value.trim();
    const url = document.getElementById('newUrl').value.trim();
    if (!title || !url) {
        alert('Judul dan URL wajib diisi, bos!');
        return;
    }
    const links = getLinks();
    links.push({ emoji, title, url });
    saveLinks(links);
    refreshUI();
    document.getElementById('newEmoji').value = '';
    document.getElementById('newTitle').value = '';
    document.getElementById('newUrl').value = '';
    alert('✅ Link berhasil ditambahkan, bos!');
}

function deleteLink(index) {
    if (!confirm('Yakin mau hapus link ini?')) return;
    const links = getLinks();
    links.splice(index, 1);
    saveLinks(links);
    refreshUI();
}

function editLink(index) {
    const links = getLinks();
    const link = links[index];
    const newEmoji = prompt('Edit Emoji:', link.emoji) || link.emoji;
    const newTitle = prompt('Edit Judul:', link.title);
    if (!newTitle) return;
    const newUrl = prompt('Edit URL:', link.url);
    if (!newUrl) return;
    links[index] = { emoji: newEmoji, title: newTitle, url: newUrl };
    saveLinks(links);
    refreshUI();
}

// ==========================================
// REFRESH UI
// ==========================================
function refreshUI() {
    const links = getLinks();
    renderLinks(links);
    renderManageLinks(links);
}

// ==========================================
// MODAL ADMIN & PIN
// ==========================================
const modal = document.getElementById('adminModal');
const adminBtn = document.getElementById('adminBtn');
const closeBtn = document.querySelector('.close');
const pinInput = document.getElementById('pinInput');
const pinSubmit = document.getElementById('pinSubmit');
const adminContent = document.getElementById('adminContent');

adminBtn.onclick = () => {
    modal.style.display = 'flex';
    pinInput.value = '';
    adminContent.style.display = 'none';
    pinInput.focus();
};

closeBtn.onclick = () => {
    modal.style.display = 'none';
};

window.onclick = (e) => {
    if (e.target === modal) modal.style.display = 'none';
};

pinSubmit.onclick = () => {
    if (pinInput.value === PIN) {
        adminContent.style.display = 'block';
        document.querySelector('#adminContent h2').innerHTML = '✅ Akses Diberikan, Bos!';
        refreshUI();
    } else {
        alert('❌ PIN SALAH, bos! Coba lagi.');
        pinInput.value = '';
        pinInput.focus();
    }
};

pinInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') pinSubmit.click();
});

// ==========================================
// EVENT LISTENER UNTUK TAMBAH LINK
// ==========================================
document.getElementById('addLinkBtn').addEventListener('click', addLink);

// ==========================================
// INIT
// ==========================================
refreshUI();
