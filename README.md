# Aplicador de Marca D'Água Automático

Um aplicativo web simples e poderoso para adicionar marcas d'água em lote às suas imagens, eliminando o processo desgastante de editar cada imagem individualmente.

## 🌟 História por trás do projeto

Tudo começou com a necessidade de adicionar um logotipo com opacidade reduzida em centenas de imagens para um projeto. Inicialmente, eu estava usando o Canva:

1. Abrir o Canva
2. Criar novo design
3. Fazer upload da imagem
4. Fazer upload do logotipo (novamente)
5. Ajustar a opacidade do logo
6. Centralizar o logo na imagem
7. Baixar a imagem
8. Repetir todo o processo para cada imagem...

Depois de várias horas desperdiçadas nesse processo manual e repetitivo, percebi que havia uma maneira melhor. Esse aplicativo nasceu da frustração e da necessidade de uma solução simples que pudesse processar múltiplas imagens de uma só vez, mantendo a mesma qualidade do resultado que eu obtinha manualmente no Canva.

## ✨ Funcionalidades

- 📁 Upload de múltiplas imagens por arrastar e soltar
- 🖼️ Seleção de logotipo personalizado
- 🔍 Ajuste de opacidade do logotipo (10% a 100%)
- 📏 Controle do tamanho do logotipo (10% a 90% da imagem)
- 🎯 9 posições diferentes para o posicionamento do logotipo
- 👁️ Prévia em tempo real das imagens processadas
- 💾 Download de todas as imagens processadas em um arquivo ZIP
- 🛡️ Processamento local (suas imagens nunca saem do seu computador)

## 🚀 Como usar

1. Acesse a aplicação no navegador: [Link para aplicação ou GitHub Pages]
2. Arraste suas imagens para a área de upload ou clique para selecionar
3. Faça upload do seu logotipo
4. Ajuste a opacidade e o tamanho do logotipo conforme desejado
5. Selecione a posição do logotipo na imagem
6. Clique em "Aplicar Marca D'Água"
7. Após o processamento, visualize os resultados
8. Clique em "Baixar Todas as Imagens" para obter um arquivo ZIP com todas as imagens processadas

## 💻 Tecnologias Utilizadas

- HTML5
- CSS3 (com animações e design responsivo)
- JavaScript (ES6+)
- Canvas API para manipulação de imagens
- JSZip para compactação de arquivos

## 🛠️ Instalação Local

Para executar este projeto localmente:

1. Clone o repositório

   ```bash
   git clone https://github.com/edvaniofc/water-marker-setter.git
   ```
2. Navegue até o diretório do projeto

   ```bash
   cd water-marker-setter
   ```
3. Abra o arquivo `index.html` em seu navegador favorito

Não há necessidade de instalar dependências, pois o projeto utiliza CDNs para carregar bibliotecas externas.

## 📋 Requisitos

- Navegador moderno com suporte para Canvas API e ES6 (Chrome, Firefox, Edge, Safari)
- Conexão com a internet (apenas para carregar bibliotecas externas)

## 🤝 Contribuindo

Contribuições são bem-vindas! Se você encontrar um bug ou tiver uma ideia para uma nova funcionalidade, sinta-se à vontade para:

1. Abrir uma issue descrevendo o problema ou sugestão
2. Enviar um pull request com suas alterações

Por favor, certifique-se de testar suas alterações antes de enviar um PR.

## 📝 TODO

Funcionalidades planejadas para futuras versões:

- [ ] Adição de texto personalizado como marca d'água
- [ ] Opção para salvar configurações para uso futuro
- [ ] Mais opções de personalização (rotação, efeitos, etc.)
- [ ] Modo escuro
- [ ] Suporte para processamento offline completo
- [ ] Interface em múltiplos idiomas

## 📜 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- A todos que já sofreram com o processo manual de adicionar marcas d'água e me incentivaram a criar essa solução
- A comunidade open source pelas ferramentas incríveis que tornaram este projeto possível

---

Desenvolvido com ❤️ e muita ☕ para economizar horas preciosas de trabalho repetitivo
