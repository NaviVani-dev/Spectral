const buttonsData = [
    {
        buttonTitle: 'Ejemplo Album 1',
        buttonSubtitle: 'Album • Artista 1',
        buttonImage: './images/temp_cover.png',
        buttonContentType: 'album',
        buttonContentID: '1'
    },
    {
        buttonTitle: 'Ejemplo Album 2',
        buttonSubtitle: 'Album • Artista 2',
        buttonImage: './images/temp_cover.png',
        buttonContentType: 'album',
        buttonContentID: '2'
    },
    {
        buttonTitle: 'Ejemplo Album 3',
        buttonSubtitle: 'Playlist',
        buttonImage: './images/temp_cover.png',
        buttonContentType: 'album',
        buttonContentID: '3'
    },
];

const sidebar = document.getElementById('sidebar');
const hardcoded_buttons = document.querySelectorAll('.sidebar_container_static .sidebar_buttons, #sidebar .sidebar_buttons');

// Se añaden verificadores de click a los botones hard-codeados
hardcoded_buttons.forEach(button => {
    button.addEventListener('click', () => {
        const contentType = button.getAttribute('contenttype');
        const contentID = button.getAttribute('contentid');
        sidebarLoadPage(contentType, contentID);
    });
});

// Añade los botones de albumes, singles y playlists a la sidebar
buttonsData.forEach(data => {
    const button = document.createElement('button');
    button.className = 'sidebar_buttons';
    button.setAttribute('contentType', data.buttonContentType);
    button.setAttribute('contentID', data.buttonContentID);

    const img = document.createElement('img');
    img.src = data.buttonImage;
    img.className = 'sidebar_buttons_image';
    button.appendChild(img);

    const textContainer = document.createElement('div');
    textContainer.className = 'sidebar_buttons_text';

    const title = document.createElement('span');
    title.className = 'sidebar_buttons_title';
    title.textContent = data.buttonTitle;
    textContainer.appendChild(title);

    if (data.buttonSubtitle) {
        const subtitle = document.createElement('span');
        subtitle.className = 'sidebar_buttons_subtitle';
        subtitle.textContent = data.buttonSubtitle;
        textContainer.appendChild(subtitle);
    }
    button.appendChild(textContainer);

    button.addEventListener('click', () => {
        sidebarLoadPage(data.buttonContentType, data.buttonContentID);
    });

    sidebar.appendChild(button);
    });