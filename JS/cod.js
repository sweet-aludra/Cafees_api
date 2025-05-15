const API_KEY = "3bc1917d12cd484a828a4a05114a4e16"; //chave do site

function ajustarCaixa() { //responsividade de lista
    const caixa = document.getElementById('caixa'); //id de section
    
    if (window.innerWidth >= 800) { //window.innerWidth para o tamnho da tela 
        caixa.style.width = '950px';
    } else if (window.innerWidth < 600) {
        caixa.style.width = '340px';
    } else {
        caixa.style.width = '600px'; 
    }
}

async function buscarCafes() {
    const local = document.getElementById("localInput").value; //pega local digitado
    const resultados = document.getElementById("resultados"); //pega a lista para mostrar os resultados
    resultados.innerHTML = "Carregando..."; 
    
    //geocodificar o nome da cidade para pegar coordenadas
    const geoRes = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(local)}&apiKey=${API_KEY}`); //API
    const geoData = await geoRes.json(); //tranformar em formato json

    if (!geoData.features.length) { //se nao encontrou nenhum local..
        resultados.innerHTML = "<li>Local não encontrado.</li>";
        return; //encerra a funçao se nao encontrado
    }

    const { lon, lat } = geoData.features[0].properties; //pega a longitude ea latitude do primeiro indice[0]

    //buscar cafés perto da coordenada
    const placesUrl = `https://api.geoapify.com/v2/places?categories=catering.cafe&filter=circle:${lon},${lat},3000&limit=10&apiKey=${API_KEY}`; //define a cetegoria de cafe para a api de localizaçao (com longitude de 3km(3000) do local atual)
    const placesRes = await fetch(placesUrl); //pega resultado 
    const placesData = await placesRes.json(); //tranforma em json(objeto)

    resultados.innerHTML = ""; //mostra os resultados na lista

    if (!placesData.features.length) { //se nenhum cafe for encontrado...
        resultados.innerHTML = "<li>Nenhum café encontrado.</li>";
        return; //encerra funçao se nao encontrado
    }

    //exibir os cafés
    placesData.features.forEach(place => { //percorre cada local da array de cafeterias
        const cafe = place.properties; //pega propriedades (nome do cafe)
        const item = document.createElement("li"); //cria <li> para cada indice do array
        item.innerHTML = `<strong>${cafe.name || "Café sem nome"}</strong><br>${cafe.address_line1 || ""}`; //mostra nome do cafe em negrito(se nao houver mostra "cafe sem nome") e depois o endereço a baixo
        resultados.appendChild(item); //adiciona os <li> na <ul> para ser mostrado
    });

    //dinamismo da lista quando o botao for clicado
    ajustarCaixa(); //executa ao carregar
    window.addEventListener('resize', ajustarCaixa); //atualiza automaticamente ao redimensionar a tela
}