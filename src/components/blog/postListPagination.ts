(() => {
  const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];
  const DEFAULT_PAGE_SIZE = 10;

  const wrapper = document.querySelector('.post-list-wrapper');
  if (!wrapper) return;

  const total = Number(wrapper.getAttribute('data-total') || '0');
  let pageSize = Number(wrapper.getAttribute('data-page-size') || String(DEFAULT_PAGE_SIZE));
  if (!Number.isFinite(pageSize) || pageSize <= 0) {
    pageSize = DEFAULT_PAGE_SIZE;
  }
  let currentPage = 1;

  const cards = wrapper.querySelectorAll('.post-card-wrapper');
  const paginationEl = wrapper.querySelector('#post-list-pagination');
  const dropdownEl = wrapper.querySelector('#page-size-dropdown');
  const triggerBtn = wrapper.querySelector('#page-size-trigger');

  function getTotalPages() {
    return Math.ceil(total / pageSize);
  }

  function updateView() {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    cards.forEach((card, idx) => {
      (card as HTMLElement).style.display = idx >= start && idx < end ? '' : 'none';
    });

    updatePagination();
  }

  function updatePagination() {
    if (!paginationEl) return;

    const totalPages = getTotalPages();
    if (totalPages <= 1) {
      (paginationEl as HTMLElement).style.display = 'none';
      return;
    }
    (paginationEl as HTMLElement).style.display = '';

    const prevBtn = paginationEl.querySelector('[data-action="prev"]') as HTMLButtonElement | null;
    const nextBtn = paginationEl.querySelector('[data-action="next"]') as HTMLButtonElement | null;
    const pageNumbersContainer = paginationEl.querySelector('#page-numbers');

    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;

    if (pageNumbersContainer) {
      pageNumbersContainer.innerHTML = Array.from({ length: totalPages }, (_, i) => {
        const pageNum = i + 1;
        const isActive = currentPage === pageNum;
        return `<button type="button" class="join-item btn btn-sm ${isActive ? 'btn-active' : ''}" data-page="${pageNum}"${isActive ? ' aria-current="page"' : ''}>${pageNum}</button>`;
      }).join('');

      pageNumbersContainer.querySelectorAll('button').forEach((btn) => {
        btn.addEventListener('click', () => goToPage(Number(btn.getAttribute('data-page'))));
      });
    }
  }

  function goToPage(page: number) {
    const totalPages = getTotalPages();
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    updateView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handlePageSizeChange(newSize: number) {
    if (!Number.isFinite(newSize) || newSize <= 0) return;
    if (!PAGE_SIZE_OPTIONS.includes(newSize)) return;
    if (newSize === pageSize) return;
    pageSize = newSize;
    currentPage = 1;
    if (triggerBtn) {
      triggerBtn.textContent = `${pageSize} 条/页`;
      triggerBtn.setAttribute('aria-expanded', 'false');
    }
    dropdownEl?.querySelectorAll('a[data-value]').forEach((opt) => {
      const optValue = Number(opt.getAttribute('data-value'));
      opt.classList.toggle('active', optValue === pageSize);
    });
    updateView();
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  }

  // 绑定分页按钮事件
  if (paginationEl) {
    paginationEl
      .querySelector('[data-action="prev"]')
      ?.addEventListener('click', () => goToPage(currentPage - 1));
    paginationEl
      .querySelector('[data-action="next"]')
      ?.addEventListener('click', () => goToPage(currentPage + 1));

    paginationEl.querySelectorAll('#page-numbers button').forEach((btn) => {
      btn.addEventListener('click', () => goToPage(Number(btn.getAttribute('data-page'))));
    });
  }

  // 绑定每页条数选择器
  if (dropdownEl) {
    dropdownEl.querySelectorAll('a[data-value]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const rawValue = link.getAttribute('data-value');
        const newSize = rawValue ? Number(rawValue) : NaN;
        handlePageSizeChange(newSize);
      });
    });
  }
})();
