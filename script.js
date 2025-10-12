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

        const followersData = JSON.parse(followersText);
        const followingData = JSON.parse(followingText).relationships_following;

        const followersUsernames = followersData.map(user => user.string_list_data[0].value);
        const followingUsernames = followingData.map(user => user.title);

        const followersSet = new Set(followersUsernames);

        const notFollowingBack = followingUsernames.filter(username => !followersSet.has(username));
        
        displayResults(notFollowingBack);

    } catch (error) {
        alert('Ocorreu um erro ao processar os arquivos. Verifique se são os arquivos JSON corretos e tente novamente.');
        console.error("Erro detalhado:", error);
    }
});

function displayResults(users) {
    resultsList.innerHTML = ''; 
    
    resultsSection.classList.remove('hidden');
    resultsTitle.innerText = `Você segue ${users.length} usuário(s) que não te seguem de volta:`;

    const copyIconSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>`;
    
    const checkIconSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#28a745" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>`;

    users.forEach(username => {
        if (!username) return;

        // <<< MUDANÇA PRINCIPAL AQUI >>>
        // Processa o nome de usuário: pega a string e a divide no primeiro "."
        // O [0] pega a primeira parte antes do ponto.
        // Se não houver ponto, o array terá apenas um item, que é o próprio username.
        const processedUsername = username.split('.')[0];
        // <<< FIM DA MUDANÇA >>>

        const item = document.createElement('div');
        item.className = 'user-item';

        const nameSpan = document.createElement('span');
        // Usamos o nome processado para EXIBIR na tela
        nameSpan.textContent = processedUsername;

        const copyButton = document.createElement('button');
        copyButton.className = 'copy-icon-btn';
        copyButton.innerHTML = copyIconSVG;
        
        copyButton.addEventListener('click', () => {
            // E usamos o nome processado também para COPIAR
            navigator.clipboard.writeText(processedUsername).then(() => {
                copyButton.innerHTML = checkIconSVG;
                
                setTimeout(() => {
                    copyButton.innerHTML = copyIconSVG;
                }, 1500);
            }).catch(err => {
                console.error('Erro ao copiar:', err);
                alert('Não foi possível copiar o usuário.');
            });
        });

        item.appendChild(nameSpan);
        item.appendChild(copyButton);
        resultsList.appendChild(item);
    });
}