// script.js (versão corrigida e robusta)

const followersInput = document.getElementById('followers-file');
const followingInput = document.getElementById('following-file');
const compareBtn = document.getElementById('compare-btn');
const resultsSection = document.getElementById('results-section');
const resultsTitle = document.getElementById('results-title');
const resultsTextarea = document.getElementById('results-textarea');
const copyBtn = document.getElementById('copy-btn');

compareBtn.addEventListener('click', async () => {
    const followersFile = followersInput.files[0];
    const followingFile = followingInput.files[0];

    if (!followersFile || !followingFile) {
        alert('Por favor, selecione os dois arquivos JSON.');
        return;
    }

    try {
        const followersText = await followersFile.text();
        const followingText = await followingFile.text();

        // Converte o texto para objetos JSON
        const parsedFollowers = JSON.parse(followersText);
        const parsedFollowing = JSON.parse(followingText);
        
        // ===== AQUI ESTÁ A CORREÇÃO! =====
        // Verifica se a chave 'relationships_followers' existe. Se sim, usa ela. Se não, usa o objeto inteiro.
        // Isso torna o código compatível com as duas versões do arquivo do Instagram.
        const followersData = parsedFollowers.relationships_followers || parsedFollowers;
        const followingData = parsedFollowing.relationships_following || parsedFollowing;
        // ===================================

        // Extrai apenas os nomes de usuário de cada lista
        const followersUsernames = followersData.map(user => user.string_list_data[0].value);
        const followingUsernames = followingData.map(user => user.string_list_data[0].value);

        // Para uma busca mais rápida, criamos um Set com os seguidores
        const followersSet = new Set(followersUsernames);

        // Filtramos a lista de "seguindo" para encontrar quem não está na lista de "seguidores"
        const notFollowingBack = followingUsernames.filter(username => !followersSet.has(username));
        
        displayResults(notFollowingBack);

    } catch (error) {
        alert('Ocorreu um erro ao processar os arquivos. Verifique se são os arquivos JSON corretos e tente novamente.');
        console.error("Erro detalhado:", error); // Isso ajuda a ver o erro no console do navegador (F12)
    }
});

function displayResults(users) {
    resultsSection.classList.remove('hidden');
    resultsTitle.innerText = `Você segue ${users.length} usuário(s) que não te seguem de volta:`;
    resultsTextarea.value = users.join('\n');
}

copyBtn.addEventListener('click', () => {
    resultsTextarea.select();
    document.execCommand('copy');
    alert('Lista copiada para a área de transferência!');
});