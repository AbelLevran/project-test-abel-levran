document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > lastScroll && currentScroll > header.offsetHeight) {
            header.style.top = '-100px';
        } else {
            header.style.top = '0';
        }
        lastScroll = currentScroll;
    });

    const showPerPageSelect = document.getElementById('show-per-page');
    const sortBySelect = document.getElementById('sort-by');
    let currentPage = 1;

    const fetchData = () => {
        const showPerPage = showPerPageSelect.value;
        const sortBy = sortBySelect.value;

        fetch(`/api/ideas?page[number]=${currentPage}&page[size]=${showPerPage}&append[]=small_image&append[]=medium_image&sort=${sortBy}`, {
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const postList = document.getElementById('post-list');
            postList.innerHTML = '';

            data.data.forEach(post => {
                const postItem = document.createElement('div');
                postItem.classList.add('post-item');

                const img = document.createElement('img');
                img.src = post.small_image;
                postItem.appendChild(img);

                const title = document.createElement('h2');
                title.innerText = post.title;
                postItem.appendChild(title);

                postList.appendChild(postItem);
            });

            // Handle pagination (assume 100 items for now)
            const pagination = document.getElementById('pagination');
            pagination.innerHTML = '';
            for (let i = 1; i <= Math.ceil(100 / showPerPage); i++) {
                const pageLink = document.createElement('a');
                pageLink.href = '#';
                pageLink.innerText = i;
                pageLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentPage = i;
                    fetchData();
                });

                if (i === currentPage) {
                    pageLink.style.fontWeight = 'bold';
                }

                pagination.appendChild(pageLink);
            }
        });
    };

    showPerPageSelect.addEventListener('change', () => {
        currentPage = 1;
        fetchData();
    });

    sortBySelect.addEventListener('change', fetchData);

    fetchData();
});
