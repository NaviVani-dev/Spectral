async function extractSongMetadata(songRoute) {
    const songData = {
        link: songRoute,
        title: '',
        artist: 'Artista desconocido',
        album: '',
        genre: 'Género desconocido',
        cover: 'images/temp_cover.png',
        number: '0',
        date: null,
        duration: null,
        copyright: null,
        lyrics: null,
    };

    try {
        const isLocalFile = !songRoute.startsWith('http');
        const fileUrl = isLocalFile ? `file:///${songRoute.replace(/\\/g, '/')}` : songRoute;

        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error('Network response was not ok');

        const arrayBuffer = await response.arrayBuffer();

        const pathname = decodeURIComponent(new URL(fileUrl).pathname);
        const fileName = pathname.split('/').pop().replace(/\.[^/.]+$/, "");
        const folderName = decodeURIComponent(pathname.split('/').slice(-2, -1)[0]);

        const file = new File([arrayBuffer], fileName + '.mp3', { type: response.headers.get('Content-Type') });

        const tags = await new Promise((resolve, reject) => {
            jsmediatags.read(file, {
                onSuccess: (tag) => resolve(tag.tags),
                onError: (error) => reject(error),
            });
        });

        songData.title = tags.title || fileName;
        songData.artist = tags.artist || 'Artista desconocido';
        songData.album = tags.album || folderName;
        songData.genre = tags.genre || 'Género desconocido';

        if (tags.picture) {
            const { data, format } = tags.picture;
            const byteArray = new Uint8Array(data);
            const blob = new Blob([byteArray], { type: format });
            songData.cover = URL.createObjectURL(blob);
        }

        const trackNumber = tags.track ? tags.track.split('/')[0] : '0';
        songData.number = !isNaN(parseInt(trackNumber)) ? parseInt(trackNumber) : 0;
        
        songData.date = tags.TDRC ? tags.TDRC.data : new Date().toISOString().split('T')[0];

        const audio = new Audio(fileUrl);
        await new Promise((resolve) => {
            audio.addEventListener('loadedmetadata', () => {
                const duration = audio.duration;
                const minutes = Math.floor(duration / 60);
                const seconds = Math.floor(duration % 60).toString().padStart(2, '0');
                songData.duration = `${minutes}:${seconds}`;
                resolve();
            });
            audio.addEventListener('error', () => {
                songData.duration = '--:--';
                resolve();
            });
        });

        songData.copyright = tags.TCOP ? tags.TCOP.data : null;
        songData.lyrics = tags.lyrics || null;

    } catch (error) {
        const pathname = decodeURIComponent(new URL(songRoute).pathname);
        const fileName = pathname.split('/').pop().replace(/\.[^/.]+$/, "");
        const folderName = decodeURIComponent(pathname.split('/').slice(-2, -1)[0]);
        songData.title = fileName;
        songData.album = folderName
        songData.date = new Date().toISOString().split('T')[0];
        const audio = new Audio(songRoute);
        await new Promise((resolve) => {
            audio.addEventListener('loadedmetadata', () => {
                const duration = audio.duration;
                const minutes = Math.floor(duration / 60);
                const seconds = Math.floor(duration % 60).toString().padStart(2, '0');
                songData.duration = `${minutes}:${seconds}`;
                resolve();
            });
            audio.addEventListener('error', () => {
                songData.duration = '--:--';
                resolve();
            });
        });
    }

    return songData;
}
