async function loadScores() {
    // 1. Zuerst sofort lokal laden (damit man immer etwas sieht)
    let scores = JSON.parse(localStorage.getItem('boxScores')) || [];
    renderScores(scores); 

    // 2. Online-Versuch mit Sicherheitsnetz (Timeout)
    if (BIN_ID && API_KEY) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // Max 3 Sek warten

        try {
            const res = await fetch(`https://api.jsonbin.io{BIN_ID}/latest`, { 
                headers: { 'X-Master-Key': API_KEY },
                signal: controller.signal 
            });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                if (data.record && data.record.scores) {
                    scores = data.record.scores;
                    renderScores(scores); // Mit Online-Daten aktualisieren
                }
            }
        } catch (e) { 
            console.warn("Online-Abruf blockiert oder zu langsam - nutze Lokal-Daten."); 
        }
    }
    return scores;
}
