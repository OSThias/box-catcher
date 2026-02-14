async function loadScores() {
    // 1. Zuerst IMMER lokal laden (schnell und sicher)
    let scores = JSON.parse(localStorage.getItem('boxScores')) || [];
    renderScores(scores); 

    // 2. Nur wenn IDs da sind, ONLINE probieren
    if (BIN_ID && BIN_ID !== '' && API_KEY !== '') {
        try {
            const res = await fetch(`https://api.jsonbin.io{BIN_ID}/latest`, { 
                headers: { 'X-Master-Key': API_KEY } 
            });
            if (!res.ok) throw new Error("Server antwortet nicht");
            const data = await res.json();
            if (data.record && data.record.scores) {
                scores = data.record.scores;
                renderScores(scores); // Anzeige mit Online-Daten aktualisieren
            }
        } catch (e) { 
            console.warn("Online-Sync nicht möglich, nutze lokale Daten."); 
        }
    }
    return scores;
}
