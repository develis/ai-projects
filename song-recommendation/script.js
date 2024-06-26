const currentDate = new Date();
const formattedDate = currentDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
const dateElement = document.querySelector('div p');

window.onload = () => {
    const defaultSongUrl = "https://open.spotify.com/embed/track/4bLbEtNtOK3eYbmaMCLDUv?utm_source=generator&theme=0";
    const urlParams = new URLSearchParams(window.location.search);
    const songUrl = urlParams.get('songUrl') || defaultSongUrl;

    document.querySelector('iframe').src = songUrl;
    dateElement.innerHTML = `${formattedDate},<br> te dedico essa música:`;
};