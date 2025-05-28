# Dashboard de Ações da B3

Este é um projeto de dashboard interativo para visualização de cotações e dados históricos de ações da B3 (Bolsa de Valores brasileira). Ele é construído utilizando HTML, CSS e JavaScript puros, consumindo dados da API da [Brapi](https://brapi.dev/).

## Funcionalidades

*   **Monitoramento de Ações:** Adicione tickers de ações da B3 (ex: PETR4, VALE3) para acompanhar.
*   **Dados em Tempo (Quase) Real:** Visualização de preço atual, variação diária (R$ e %), abertura, máxima, mínima, e fechamento anterior.
*   **Gráficos Históricos Interativos por Ação:**
    *   Gráfico de linha para o histórico de preços de fechamento do último mês.
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
*   **Atualização Automática:** Os dados das ações são atualizados automaticamente a cada 90 segundos (configurável no `script.js`).
*   **Design Responsivo:** Interface adaptada para visualização em diferentes tamanhos de tela.

## Tecnologias Utilizadas

*   **HTML5:** Estrutura da página.
*   **CSS3:** Estilização e layout (incluindo variáveis CSS para temas e Flexbox/Grid para responsividade).
*   **JavaScript (ES6+):** Lógica da aplicação, manipulação do DOM, consumo da API e interatividade.
*   **Chart.js:** Biblioteca para a criação dos gráficos (incluída via CDN).
    *   `chartjs-adapter-date-fns`: Adaptador para eixos de tempo no Chart.js (incluído via CDN).
*   **Brapi API:** Fonte dos dados do mercado de ações da B3.

## Como Usar

1.  **Obtenha um Token da Brapi API:**
    *   Acesse [https://brapi.dev/](https://brapi.dev/).
    *   Crie uma conta gratuita ou faça login.
    *   No seu dashboard da Brapi, copie o seu **Token de API**.

2.  **Configure o Token no Projeto:**
    *   Abra o arquivo `script.js`.
    *   Localize a linha que começa com `const API_TOKEN =`.
    *   Substitua o valor existente (ex: `'sLgubZcsdnsHJi7sBfM888'` ou `'SEU_TOKEN_AQUI'`) pelo token que você copiou no passo anterior. Mantenha as aspas simples em volta do seu token.
        ```javascript
        const API_TOKEN = 'SEU_TOKEN_REAL_DA_BRAPI_AQUI';
        ```

3.  **Abra o Dashboard:**
    *   Certifique-se de que os arquivos `index.html`, `style.css`, e `script.js` estão na mesma pasta.
    *   Abra o arquivo `index.html` em seu navegador de preferência (ex: Google Chrome, Firefox, Edge).

4.  **Utilize o Dashboard:**
    *   Digite o ticker de uma ação no campo "Adicionar Ação" (ex: `ITUB4`, `MGLU3`) e clique no botão "Adicionar" ou pressione Enter.
    *   A ação será adicionada ao dashboard com seus dados e gráficos.
    *   Utilize o botão com o ícone de sol/lua no canto superior direito para alternar entre o tema claro e escuro.

## Estrutura do Projeto

O projeto é organizado da seguinte forma, com os principais arquivos e suas responsabilidades:
## Estrutura do Projeto

O projeto possui uma estrutura simples, consistindo nos seguintes arquivos principais na raiz do diretório:

*   **`index.html`**:
    *   Arquivo principal HTML que define a estrutura da página do dashboard.
    *   Contém os elementos onde os dados e gráficos serão renderizados.
    *   Inclui os links para o arquivo CSS e os scripts JavaScript (bibliotecas externas e o `script.js` do projeto).

*   **`style.css`**:
    *   Folha de Estilo CSS que contém todas as regras de estilização para a aparência visual do dashboard.
    *   Define o layout, cores, tipografia, responsividade e os temas (claro/escuro).

*   **`script.js`**:
    *   Arquivo JavaScript principal que contém toda a lógica da aplicação e interatividade do dashboard.
    *   Responsável por:
        *   Consumir a API da Brapi para buscar os dados das ações.
        *   Manipular o DOM para exibir os dados e criar/atualizar os cards das ações.
        *   Gerenciar a renderização e atualização dos gráficos utilizando a biblioteca Chart.js.
        *   Implementar a funcionalidade de adicionar e remover ações.
        *   Controlar a atualização automática dos dados.
        *   Gerenciar o armazenamento local (`localStorage`) para persistência das ações monitoradas e do tema escolhido.
        *   Controlar a lógica de alternância entre o tema claro e escuro.

*   **`README.md`**:
    *   Este arquivo, contendo a documentação do projeto.
    *   Fornece informações sobre as funcionalidades, tecnologias utilizadas, como configurar e usar o dashboard, a estrutura do projeto e possíveis melhorias futuras.

**Observações sobre Dependências Externas:**

As seguintes bibliotecas JavaScript são incluídas diretamente no `index.html` via CDN e não fazem parte dos arquivos locais do projeto:

*   **Chart.js:** Para a criação de gráficos dinâmicos.
*   **Chart.js Date Adapter (date-fns):** Para habilitar o Chart.js a trabalhar com eixos de tempo de forma eficiente.

## Possíveis Melhorias Futuras

*   Adicionar mais opções de períodos para os gráficos históricos (ex: 3 meses, 6 meses, 1 ano, YTD).
*   Permitir a entrada de quantidade de ações e preço de compra para simular uma carteira real e calcular lucros/prejuízos.
*   Implementar gráficos de pizza/donut para a composição da carteira (baseado nos dados de simulação).
*   Adicionar indicadores técnicos simples (ex: Médias Móveis) aos gráficos de preço.
*   Opção para reordenar os cards das ações (ex: arrastar e soltar).
*   Filtros ou ordenação para a lista de ações (ex: por maior variação, por nome).
*   Melhorias na interface de feedback para o usuário (ex: toasts para notificações).

## Contribuições

Este projeto foi criado para fins de aprendizado e demonstração. Sinta-se à vontade para clonar, modificar e experimentar! Se você tiver sugestões ou encontrar bugs, pode abrir uma *issue* (se o projeto estiver em uma plataforma como o GitHub).

## Licença e Disclaimer

Este projeto é fornecido como está, sem garantias. Utilize por sua conta e risco.
Os dados do mercado de ações são fornecidos pela API da Brapi. Verifique os termos de uso da API Brapi antes de utilizar este projeto para fins que não sejam pessoais ou educacionais. Este projeto não se destina a fornecer aconselhamento financeiro.
