document.addEventListener("DOMContentLoaded", function() {
  const items = document.querySelectorAll(".checkbox-list");
  Array.prototype.forEach.call(items, item => {
    const title = item.children[0];
    title.onclick = function(e) {
      title.classList.toggle("checkbox-list__title_open");
      const menu = e.currentTarget.nextElementSibling;
      menu.style.height = menu.offsetHeight === 0 ? `${menu.scrollHeight}px` : `${0}px`;
    };
  });
});
