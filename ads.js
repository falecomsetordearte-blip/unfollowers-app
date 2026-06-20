// Script dedicado para gerenciamento e carregamento de anúncios AdSense
console.log("[ADS] Script de anúncios (ads.js) carregado com sucesso.");

// Função para injetar o script do AdSense de forma assíncrona
function loadAdSense(publisherId) {
    if (!publisherId) {
        console.warn("[ADS] Publisher ID não fornecido. O carregamento do AdSense foi cancelado.");
        return;
    }

    console.log(`[ADS] Iniciando o carregamento do Google AdSense para o ID: ${publisherId}`);

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
    script.crossOrigin = "anonymous";
    
    script.onload = () => {
        console.log("[ADS] Script do Google AdSense carregado no navegador.");
    };

    script.onerror = () => {
        console.error("[ADS] Erro ao carregar o script do Google AdSense.");
    };

    document.head.appendChild(script);
}

// Inicializa a configuração dos banners de anúncio quando a página terminar de carregar
document.addEventListener("DOMContentLoaded", () => {
    console.log("[ADS] Documento carregado. Preparando espaços para anúncios...");
    
    // Você pode chamar a função abaixo com seu ID quando tiver a aprovação.
    // Exemplo: loadAdSense("ca-pub-XXXXXXXXXXXXXXXX");
    
    // Configuração para forçar a renderização dos anúncios que têm a classe 'adsbygoogle'
    try {
        const adsElements = document.querySelectorAll('.adsbygoogle');
        if (adsElements.length > 0) {
            console.log(`[ADS] Encontrados ${adsElements.length} espaços de anúncios na página.`);
            // (adsbygoogle = window.adsbygoogle || []).push({}); // Descomente quando o script principal for carregado e a conta aprovada
        } else {
            console.log("[ADS] Nenhum espaço de anúncio (.adsbygoogle) encontrado na página atual.");
        }
    } catch (e) {
        console.error("[ADS] Erro ao tentar renderizar os anúncios:", e);
    }
});
