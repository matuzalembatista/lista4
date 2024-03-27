window.addEventListener("load", () => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YWIzMGNiMjMyNzQ0OWM4NDQ5NmM5MzFlMGM2YWFkZSIsInN1YiI6IjYyYWEyNTQ4OTA3ZjI2MTRmNjEyZDdiZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.DnVpu1fMOIwH5vqYJ1YgQZg4mO63vVWX94D7PDa0sYE'
        }
    };

    const language = "pt-BR"; // Definindo language como uma constante global
    const imagemURL = `https://image.tmdb.org/t/p/w500`;

    fetch(`https://api.themoviedb.org/3/movie/popular?language=${language}&page=1`, options)
        .then(response => response.json())
        .then(filmes => exibirFilmes(filmes.results.slice(0, 10)))
        .catch(err => console.error(err));

    async function exibirFilmes(filmes) {
        for (const filme of filmes) {
            const boxFilme = document.createElement("div");
            const filmeTitulo = document.createElement("h1");
            const filmeData = document.createElement("p");
            const filmeOverview = document.createElement("p");
            const filmeCapa = document.createElement("img");
            const filmeAvaliacao = document.createElement("p");
            const filmeGeneros = document.createElement("p");

            filmeTitulo.textContent = filme.title;
            filmeData.textContent = "Lançamento: " + filme.release_date;
            filmeOverview.textContent = diminuirResumo(filme.overview);
            filmeAvaliacao.textContent = "Avaliação: " + filme.vote_average.toFixed(1) ;


            const starRating = createStarRating(Math.round(filme.vote_average));
            const genreNames = await getGenreNames(filme.genre_ids, language);
            filmeGeneros.textContent = "Gêneros: " + genreNames.join(', ');

            boxFilme.appendChild(filmeTitulo);
            boxFilme.appendChild(filmeCapa);
            filmeCapa.setAttribute("src", imagemURL + filme.poster_path);
            boxFilme.appendChild(filmeData);
            boxFilme.appendChild(filmeOverview);
            boxFilme.appendChild(filmeAvaliacao);
            boxFilme.appendChild(starRating);
            boxFilme.appendChild(filmeGeneros);

            document.getElementById("boxFilmes").appendChild(boxFilme);
        }
    }

    // Função para diminuir o RESUMO DO FILME
    function diminuirResumo(overview) {
        const maxLength = 120;
        if (overview.length > maxLength) {
            return overview.substring(0, maxLength) + '...';
        } else {
            return overview;
        }
    }

    // Função para pegar o NOME DO GENERO
    async function getGenreNames(genreIds, language) {
        const apiKey = '8ab30cb2327449c84496c931e0c6aade';
        const apiUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=${language}`;


            const response = await fetch(apiUrl);
            const data = await response.json();

            const genreNames = genreIds.map(genreId => {
                const genre = data.genres.find(genre => genre.id === genreId);
                return genre ? genre.name : 'Desconhecido';
            });

            return genreNames;
    }

    // Função para ADD ESTRELA na Avaliaxao
    function createStarRating(rating) {
        const starSpan = document.createElement("span");
        Array(rating).fill().forEach(() => {
            const star = document.createElement("span");
            star.textContent = "⭐️"; 
            starSpan.appendChild(star);
        });
        return starSpan;
    }
    
});
