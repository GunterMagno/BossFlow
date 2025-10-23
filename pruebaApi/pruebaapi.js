
fetch('https://api.rawg.io/api/games?key=26224c4f863d44c684aa6a44df6f634a')
    .then(res => res.json())
    .then(data => {
        data.results.forEach(game => {
            console.log(game.name);
        });
    })
    .catch(err => console.error(err));
