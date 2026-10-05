import { projects, songs, blogs } from './data.js'; 

function renderList(list, ulElement, tplElement) {
  ulElement.textContent = '';
  for (const item of list) {
    const li = tplElement.content.cloneNode(true);
    
    const linkEl = li.querySelector('.project-link');
    const img = li.querySelector('.project-img');
    
    if (item.image) {
      img.src = item.image;
      img.alt = `Banner cho ${item.title}`;
      
      if (item.link) {
          linkEl.href = item.link;
      } else {
          linkEl.removeAttribute('href'); 
      }
    } else {
      if(linkEl) linkEl.style.display = 'none'; 
    }

    const titleEl = li.querySelector('h3');
    if(titleEl) titleEl.textContent = item.title;
    
    const desc = li.querySelector('.description');
    if(desc && item.description) desc.textContent = item.description; 
    
    const tagsEl = li.querySelector('.tags');
    if (item.tags && tagsEl) {
      tagsEl.textContent = item.tags.join(', ');
    } else if (tagsEl) {
      tagsEl.style.display = 'none'; 
    }
    
    ulElement.append(li);
  }
}

// 1. Chạy render cho phần Projects
const projectUl = document.querySelector('#project-list');
const projectTpl = document.querySelector('#project-card');
renderList(projects, projectUl, projectTpl);

// 2. Chạy render cho phần Blogs
const blogUl = document.querySelector('#blog-list');
const blogTpl = document.querySelector('#blog-card');
if (blogUl && blogTpl) {
    renderList(blogs, blogUl, blogTpl);
}

// ==============================================
// HIỆU ỨNG CLICK CHUỘT (NEON SQUARES)
// ==============================================
document.addEventListener('click', function(e) {
    // Số lượng ô vuông sinh ra ngẫu nhiên từ 4 đến 6 ô
    const numSquares = Math.floor(Math.random() * 3) + 4;

    for (let i = 0; i < numSquares; i++) {
        const square = document.createElement('div');
        square.className = 'neon-square';

        // Tạo kích thước ngẫu nhiên từ 10px đến 25px
        const size = Math.random() * 15 + 10;
        square.style.width = `${size}px`;
        square.style.height = `${size}px`;

        // Đặt vị trí xuất hiện trùng với tọa độ click chuột
        square.style.left = `${e.clientX}px`;
        square.style.top = `${e.clientY}px`;

        // Tính toán hướng bay ngẫu nhiên (trong khoảng -60px đến +60px)
        const tx = (Math.random() - 0.5) * 120; 
        const ty = (Math.random() - 0.5) * 120;
        
        // Truyền giá trị hướng bay vào biến CSS --tx và --ty để dùng trong @keyframes
        square.style.setProperty('--tx', `${tx}px`);
        square.style.setProperty('--ty', `${ty}px`);

        // Thêm ô vuông vào màn hình
        document.body.appendChild(square);

        // Tự động xóa thẻ div sau 600ms
        setTimeout(() => {
            square.remove();
        }, 600);
    }
});

// ==============================================
// MUSIC PLAYER LOGIC
// ==============================================
const carousel = document.querySelector('.carousel');
const titleEl = document.getElementById('song-title');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const audioPlayer = document.getElementById('audio-player');

let currentSongIndex = 0;
let isPlaying = false;

// Khởi tạo các thẻ ảnh banner
function initMusicPlayer() {
    if (!songs || songs.length === 0) return;
    
    songs.forEach((song, index) => {
        const img = document.createElement('img');
        img.src = song.cover;
        img.className = 'song-card';
        // Xử lý nếu ảnh lỗi để tránh trống layout
        img.onerror = () => { img.src = 'https://via.placeholder.com/400x225/270d54/ffffff?text=No+Cover'; }; 
        carousel.appendChild(img);
    });
    
    updatePlayerUI();
}

// Cập nhật giao diện khi chuyển bài
function updatePlayerUI() {
    const cards = document.querySelectorAll('.song-card');
    const totalSongs = songs.length;
    
    cards.forEach((card, index) => {
        card.className = 'song-card'; // Xóa class cũ
        
        if (index === currentSongIndex) {
            card.classList.add('active');
        } else if (index === (currentSongIndex - 1 + totalSongs) % totalSongs) {
            card.classList.add('prev');
        } else if (index === (currentSongIndex + 1) % totalSongs) {
            card.classList.add('next');
        }
    });

    // Cập nhật thông tin và file nhạc
    const currentSong = songs[currentSongIndex];
    titleEl.textContent = `${currentSong.title} - ${currentSong.artist}`;
    
    // Chỉ đổi src nếu chuyển bài khác
    if(!audioPlayer.src.includes(currentSong.audio)) {
        audioPlayer.src = currentSong.audio;
    }
    
    if (isPlaying) {
        audioPlayer.play();
        playBtn.innerHTML = '⏸'; // Đổi icon sang Pause
    } else {
        audioPlayer.pause();
        playBtn.innerHTML = '▶'; // Đổi icon sang Play
    }
}

// Bắt sự kiện nút bấm
prevBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    updatePlayerUI();
});

nextBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    updatePlayerUI();
});

playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    updatePlayerUI();
});

// Tự động chuyển bài khi kết thúc
audioPlayer.addEventListener('ended', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    updatePlayerUI();
});

// Chạy khởi tạo
initMusicPlayer();

// ==============================================
// DRAG TO SCROLL (KÉO CHUỘT ĐỂ TRƯỢT BLOG)
// ==============================================
const slider = document.querySelector('.blog-carousel');
let isDown = false; // Trạng thái có đang nhấn chuột hay không
let startX;         // Vị trí X ban đầu khi click
let scrollLeft;     // Vị trí cuộn ban đầu

if (slider) {
    // Khi nhấn chuột xuống
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active'); // Thêm class active để đổi con trỏ chuột (CSS)
        startX = e.pageX - slider.offsetLeft; // Lấy tọa độ X của chuột
        scrollLeft = slider.scrollLeft; // Lưu lại vị trí thanh cuộn hiện tại
    });

    // Khi di chuột ra khỏi khu vực blog
    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    // Khi nhả chuột ra
    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    // Khi di chuyển chuột (và đang nhấn giữ)
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return; // Nếu không nhấn chuột thì bỏ qua
        e.preventDefault(); // Ngăn hành vi mặc định (như kéo ảnh ra ngoài)
        
        const x = e.pageX - slider.offsetLeft; // Tọa độ X hiện tại
        const walk = (x - startX) * 1.5; // Khoảng cách di chuyển (nhân 1.5 để cuộn nhanh hơn)
        slider.scrollLeft = scrollLeft - walk; // Cập nhật vị trí thanh cuộn
    });
}