async function copyURL(path) {
    const fullURL = `${window.location.origin}${path}`;

    try {
        await navigator.clipboard.writeText(fullURL);
        alert("Copied!");
    } catch (err) {
        console.error(err);
    }
}