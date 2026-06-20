// Seleciona os elementos da nova página
const followingInput = document.getElementById('following-file');
const closeFriendsInput = document.getElementById('close-friends-file');
const compareBtn = document.getElementById('compare-btn');
const resultsSection = document.getElementById('results-section');
const resultsTitle = document.getElementById('results-title');
const resultsList = document.getElementById('results-list');

// Adiciona o evento de clique ao botão
compareBtn.addEventListener('click', async () => {
    const followingFile = followingInput.files[0];
    const closeFriendsFile = closeFriendsInput.files[0];

    if (!followingFile || !closeFriendsFile) {
        alert('Por favor, selecione os dois arquivos JSON.');
        return;
    }

    try {
        console.log(`[CF_APP] Lendo arquivo following: ${followingFile.name}`);
        const followingText = await followingFile.text();
        console.log(`[CF_APP] Lendo arquivo close_friends: ${closeFriendsFile.name}`);
        const closeFriendsText = await closeFriendsFile.text();

        console.log("[CF_APP] Fazendo parse dos JSONs...");
        // Extrai os dados de cada arquivo com base na sua estrutura específica
        const followingData = JSON.parse(followingText).relationships_following;
        const closeFriendsData = JSON.parse(closeFriendsText).relationships_close_friends;
        console.log(`[CF_APP] Parse concluído. Seguindo: ${followingData.length}, Amigos Próximos: ${closeFriendsData.length}`);

        // Extrai os nomes de usuário de cada lista
        const followingUsernames = followingData.map(user => user.title);
        const closeFriendsUsernames = closeFriendsData.map(user => user.string_list_data[0].value);

        // Cria um Set com os Amigos Próximos para uma verificação rápida
        const closeFriendsSet = new Set(closeFriendsUsernames);

        console.log("[CF_APP] Verificando quem não está nos Amigos Próximos...");
        // Filtra a lista de quem você segue para encontrar quem NÃO está no Set de Amigos Próximos
        const notInCloseFriends = followingUsernames.filter(username => !closeFriendsSet.has(username));
        console.log(`[CF_APP] Verificação concluída. ${notInCloseFriends.length} usuários encontrados.`);
        
        displayResults(notInCloseFriends);

    } catch (error) {
        alert('Ocorreu um erro ao processar os arquivos. Verifique se são os arquivos JSON corretos.');
        console.error("Erro detalhado:", error);
    }
});

function displayResults(users) {
    resultsList.innerHTML = ''; 
    
    resultsSection.classList.remove('hidden');
    resultsTitle.innerText = `Você segue ${users.length} usuário(s) que não estão nos Amigos Próximos:`;

    // Ícone de avatar genérico (placeholder)
    const avatarSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>`;

    users.forEach(username => {
        if (!username) return;

        // Cria os elementos para cada item da lista
        const item = document.createElement('div');
        item.className = 'cf-user-item';
        
        // Avatar
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar';
        avatarDiv.innerHTML = avatarSVG;

        // Nome de usuário
        const userInfoDiv = document.createElement('div');
        userInfoDiv.className = 'user-info';
        userInfoDiv.textContent = username;

        // Link para o perfil
        const profileLink = document.createElement('a');
        profileLink.className = 'profile-link';
        profileLink.href = `https://www.instagram.com/${username}`;
        profileLink.target = '_blank'; // Abre em uma nova aba
        profileLink.textContent = 'Ver Perfil';

        // Monta o item e o adiciona à lista
        item.appendChild(avatarDiv);
        item.appendChild(userInfoDiv);
        item.appendChild(profileLink);
        resultsList.appendChild(item);
    });
}