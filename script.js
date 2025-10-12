// Seleciona os elementos do HTML que vamos usar
const followersInput = document.getElementById('followers-file');
const followingInput = document.getElementById('following-file');
const compareBtn = document.getElementById('compare-btn');
const resultsSection = document.getElementById('results-section');
const resultsTitle = document.getElementById('results-title');
const resultsList = document.getElementById('results-list');

// Adiciona o evento de clique ao botão de comparar
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

        // Converte o texto para objetos JSON, usando a estrutura correta para cada arquivo
        const followersData = JSON.parse(followersText);
        const followingData = JSON.parse(followingText).relationships_following;

        // Extrai os nomes de usuário de cada lista, usando a chave correta para cada arquivo
        const followersUsernames = followersData.map(user => user.string_list_data[0].value);
        const followingUsernames = followingData.map(user => user.title);

        // Cria um Set para uma busca otimizada
        const followersSet = new Set(followersUsernames);

        // Filtra a lista de quem você segue para encontrar quem não está na sua lista de seguidores
        const notFollowingBack = followingUsernames.filter(username => !followersSet.has(username));
        
        // Chama a função para exibir os resultados na nova lista interativa
        displayResults(notFollowingBack);

    } catch (error) {
        alert('Ocorreu um erro ao processar os arquivos. Verifique se são os arquivos JSON corretos e tente novamente.');
        console.error("Erro detalhado:", error);
    }
});

function displayResults(users) {
    // Limpa a lista de resultados anteriores antes de adicionar novos
    resultsList.innerHTML = ''; 
    
    resultsSection.classList.remove('hidden');
    resultsTitle.innerText = `Você segue ${users.length} usuário(s) que não te seguem de volta:`;

    // Ícones SVG como strings para fácil manipulação
    const copyIconSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>`;
    
    const checkIconSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#28a745" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>`;

    // Itera sobre a lista de usuários que não te seguem
    users.forEach(username => {
        if (!username) return; // Garante que não criamos itens para usuários inválidos

        // Cria os elementos HTML para cada item da lista
        const item = document.createElement('div');
        item.className = 'user-item';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = username;

        const copyButton = document.createElement('button');
        copyButton.className = 'copy-icon-btn';
        copyButton.innerHTML = copyIconSVG;
        
        // Adiciona o evento de clique para copiar o nome de usuário
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(username).then(() => {
                // Feedback visual: troca o ícone para "copiado"
                copyButton.innerHTML = checkIconSVG;
                
                // Volta ao ícone original após 1.5 segundos
                setTimeout(() => {
                    copyButton.innerHTML = copyIconSVG;
                }, 1500);
            }).catch(err => {
                console.error('Erro ao copiar:', err);
                alert('Não foi possível copiar o usuário.');
            });
        });

        // Adiciona o nome e o botão ao item, e o item à lista principal
        item.appendChild(nameSpan);
        item.appendChild(copyButton);
        resultsList.appendChild(item);
    });
}