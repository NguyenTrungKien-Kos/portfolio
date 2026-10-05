import { projects } from './data.js';

const ul = document.querySelector('#project-list');
const tpl = document.querySelector('#project-card');

function render(list) {
  ul.textContent = '';
  for (const p of list) {
    const li = tpl.content.cloneNode(true);
    
    // Tìm thẻ link và thẻ img
    const linkEl = li.querySelector('.project-link');
    const img = li.querySelector('.project-img');
    
    if (p.image) {
      img.src = p.image;
      img.alt = `Banner cho dự án ${p.title}`;
      
      // Gán đường link nếu có
      if (p.link) {
          linkEl.href = p.link;
      } else {
          linkEl.removeAttribute('href'); // Nếu không có link thì xóa thuộc tính href
      }
    } else {
      linkEl.style.display = 'none'; // Ẩn toàn bộ khối ảnh nếu dự án không có ảnh
    }

    li.querySelector('h3').textContent = p.title;
    
    const desc = li.querySelector('.description');
    if(desc && p.description) desc.textContent = p.description; 
    
    const tagsEl = li.querySelector('.tags');
    if (p.tags && tagsEl) {
      tagsEl.textContent = p.tags.join(', ');
    } else if (tagsEl) {
      tagsEl.style.display = 'none'; 
    }
    
    ul.append(li);
  }
}

render(projects);

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