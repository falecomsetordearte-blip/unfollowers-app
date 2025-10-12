// script.js (versão final corrigida com base nos seus arquivos)

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

        // Converte o texto JSON em objetos/arrays JavaScript
        const followersData = JSON.parse(followersText); // followers_1.json é um array direto
        const followingData = JSON.parse(followingText).relationships_following; // following.json é um objeto com a chave

        // ===== AQUI ESTÁ A CORREÇÃO FINAL E PRECISA =====
        // Extrai os nomes de usuário de cada lista, USANDO A ESTRUTURA CORRETA PARA CADA ARQUIVO.

        // Para a lista de seguidores (followers), o nome está em 'string_list_data[0].value'
        const followersUsernames = followersData.map(user => user.string_list_data[0].value);

        // Para a lista de quem você segue (following), o nome está em 'title'
        const followingUsernames = followingData.map(user => user.title);
        // ===================================================

        // Para uma busca mais rápida, criamos um Set com os seguidores
        const followersSet = new Set(followersUsernames);

        // Filtramos a lista de "seguindo" para encontrar quem não está na lista de "seguidores"
        const notFollowingBack = followingUsernames.filter(username => !followersSet.has(username));
        
        displayResults(notFollowingBack);

    } catch (error) {
        alert('Ocorreu um erro ao processar os arquivos. Verifique se são os arquivos JSON corretos e tente novamente.');
        console.error("Erro detalhado:", error);
    }
});

function displayResults(users) {
    resultsSection.classList.remove('hidden');
    resultsTitle.innerText = `Você segue ${users.length} usuário(s) que não te seguem de volta:`;
    // Remove qualquer usuário "undefined" que possa aparecer por erro e junta o resto em uma string
    resultsTextarea.value = users.filter(user => user).join('\n');
}

copyBtn.addEventListener('click', () => {
    resultsTextarea.select();
    document.execCommand('copy');
    alert('Lista copiada para a área de transferência!');
});