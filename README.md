# Dashboard de Ações da B3

Este é um projeto de dashboard interativo para visualização de cotações e dados históricos de ações da B3 (Bolsa de Valores brasileira). Ele é construído utilizando HTML, CSS e JavaScript puros, consumindo dados da API da [Brapi](https://brapi.dev/).

## Funcionalidades

*   **Monitoramento de Ações:** Adicione tickers de ações da B3 (ex: PETR4, VALE3) para acompanhar.
*   **Dados em Tempo (Quase) Real:** Visualização de preço atual, variação diária (R$ e %), abertura, máxima, mínima, e fechamento anterior.
*   **Gráficos Históricos Interativos:**
    *   Gráfico de linha para o histórico de preços de fechamento do último mês para cada ação.
    *   Gráfico de barras sobreposto para o volume de negociação diário.
*   **Resumo da Carteira (Monitoradas):**
    *   Número total de ativos sendo monitorados.
    *   Variação percentual média das ações no dia.
    *   Ação com o melhor e pior desempenho no dia.
    *   Gráfico de barras comparando a performance diária de todas as ações monitoradas.
*   **Informações Adicionais por Ação:**
    *   Estado do mercado (aberto/fechado).
    *   Timestamp da última cotação.
    *   Capitalização de mercado (Market Cap), se disponível.
*   **Tema Claro e Escuro (Dark Mode):** Alterne entre os temas para melhor visualização.
*   **Persistência de Dados:** As ações adicionadas e o tema escolhido são salvos no `localStorage` do navegador.
*   **Atualização Automática:** Os dados das ações são atualizados automaticamente a cada 90 segundos (configurável).
*   **Design Responsivo:** Interface adaptada para visualização em diferentes tamanhos de tela.

## Tecnologias Utilizadas

*   **HTML5:** Estrutura da página.
*   **CSS3:** Estilização e layout (incluindo variáveis CSS para temas e Flexbox/Grid para responsividade).
*   **JavaScript (ES6+):** Lógica da aplicação, manipulação do DOM, consumo da API e interatividade.
*   **Chart.js:** Biblioteca para a criação dos gráficos.
    *   `chartjs-adapter-date-fns`: Adaptador para eixos de tempo no Chart.js.
*   **Brapi API:** Fonte dos dados do mercado de ações da B3.

## Como Usar

1.  **Obtenha um Token da Brapi API:**
    *   Acesse [https://brapi.dev/](https://brapi.dev/).
    *   Crie uma conta gratuita ou faça login.
    *   No seu dashboard da Brapi, copie o seu **Token de API**.

2.  **Configure o Token no Projeto:**
    *   Abra o arquivo `script.js`.
    *   Localize a linha:
        ```javascript
        const API_TOKEN = 'SEU_TOKEN_AQUI'; // Substitua pelo seu token real
        ```
    *   Substitua `'SEU_TOKEN_AQUI'` pelo token que você copiou no passo anterior. Mantenha as aspas.

3.  **Abra o Dashboard:**
    *   Clone ou baixe este repositório (se estiver em um).
    *   Certifique-se de que os arquivos `index.html`, `style.css`, e `script.js` estão na mesma pasta.
    *   Abra o arquivo `index.html` em seu navegador de preferência (ex: Google Chrome, Firefox, Edge).

4.  **Utilize o Dashboard:**
    *   Digite o ticker de uma ação no campo "Adicionar Ação" (ex: `ITUB4`) e clique no botão "Adicionar" ou pressione Enter.
    *   A ação será adicionada ao dashboard com seus dados e gráficos.
    *   Utilize o botão no canto superior direito para alternar entre o tema claro e escuro.

## Estrutura do Projeto
├── index.html # Arquivo principal HTML com a estrutura da página
├── style.css # Arquivo CSS para estilização
├── script.js # Arquivo JavaScript com a lógica da aplicação
└── README.md # Este arquivo


## Possíveis Melhorias Futuras

*   Adicionar mais opções de períodos para os gráficos históricos (ex: 3 meses, 6 meses, 1 ano).
*   Permitir a entrada de quantidade de ações e preço de compra para simular uma carteira real e calcular lucros/prejuízos.
*   Implementar gráficos de pizza/donut para a composição da carteira.
*   Adicionar indicadores técnicos simples (ex: Médias Móveis) aos gráficos de preço.
*   Melhorar o tratamento de erros e feedback ao usuário.
*   Opção para reordenar os cards das ações.
*   Internacionalização (suporte a outros idiomas).

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir *issues* para reportar bugs ou sugerir novas funcionalidades. Se desejar contribuir com código, por favor, abra um *Pull Request*.

## Licença

Este projeto é apenas para fins educacionais e de demonstração. Verifique os termos de uso da API da Brapi antes de utilizar em produção ou para fins comerciais.
