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