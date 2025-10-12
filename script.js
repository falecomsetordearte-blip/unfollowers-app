// Seleciona os elementos do HTML que vamos usar
const followersInput = document.getElementById('followers-file');
const followingInput = document.getElementById('following-file');
const compareBtn = document.getElementById('compare-btn');
const resultsSection = document.getElementById('results-section');
const resultsTitle = document.getElementById('results-title');
const resultsTextarea = document.getElementById('results-textarea');
const copyBtn = document.getElementById('copy-btn');

// Adiciona um "ouvinte" para o clique no botão de comparar
compareBtn.addEventListener('click', async () => {
    const followersFile = followersInput.files[0];
    const followingFile = followingInput.files[0];

    // Verifica se os dois arquivos foram selecionados
    if (!followersFile || !followingFile) {
        alert('Por favor, selecione os dois arquivos JSON.');
        return;
    }

    try {
        // Lê o conteúdo dos arquivos como texto
        const followersText = await followersFile.text();
        const followingText = await followingFile.text();

        // Converte o texto JSON em objetos JavaScript
        const followersData = JSON.parse(followersText);
        const followingData = JSON.parse(followingText).relationships_following;
        
        // Extrai apenas os nomes de usuário de cada lista
        // Usamos .map() para transformar cada item do array em apenas o nome de usuário
        const followersUsernames = followersData.map(user => user.string_list_data[0].value);
        const followingUsernames = followingData.map(user => user.string_list_data[0].value);

        // Para uma busca mais rápida, criamos um Set com os seguidores
        const followersSet = new Set(followersUsernames);

        // Filtramos a lista de "seguindo" para encontrar quem não está na lista de "seguidores"
        const notFollowingBack = followingUsernames.filter(username => !followersSet.has(username));
        
        // Mostra os resultados na tela
        displayResults(notFollowingBack);

    } catch (error) {
        alert('Ocorreu um erro ao ler ou processar os arquivos. Verifique se são os arquivos JSON corretos do Instagram.');
        console.error(error);
    }
});

// Função para mostrar os resultados
function displayResults(users) {
    resultsSection.classList.remove('hidden'); // Mostra a seção de resultados
    resultsTitle.innerText = `Você segue ${users.length} usuário(s) que não te seguem de volta:`;
    
    // Junta todos os nomes de usuário em uma única string, um por linha
    resultsTextarea.value = users.join('\n');
}

// Adiciona a funcionalidade de copiar ao botão
copyBtn.addEventListener('click', () => {
    resultsTextarea.select();
    document.execCommand('copy');
    alert('Lista copiada para a área de transferência!');
});