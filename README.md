# WebGIS - Leaflet

WebGIS desenvolvido com Leaflet contendo 3 camadas de base de mapas e 2 camadas de dados GeoJSON.

## Funcionalidades

- **3 Camadas de Base de Mapas:**
  - OpenStreetMap
  - CartoDB Positron
  - Satélite (Esri)

- **2 Camadas de Dados GeoJSON:**
  - Imóveis Rurais Itapetinga
  - Limite Municipal de Itapetinga

## Como Executar

### Opção 1: Servidor Python (Recomendado)

1. Certifique-se de ter Python instalado
2. Execute o servidor:
```bash
python server.py
```

3. O navegador abrirá automaticamente em `http://localhost:8000`

### Opção 2: Servidor HTTP Simples (Python 3)

```bash
python -m http.server 8000
```

Acesse: `http://localhost:8000`

### Opção 3: Node.js (se tiver instalado)

```bash
npx http-server -p 8000
```

## Estrutura de Arquivos

```
prototipo/
├── index.html
├── styles.css
├── map.js
├── server.py
├── README.md
└── data/
    ├── imoveis_rurais_itapetinga.geojson
    └── itapetinga.geojson
```

## Notas Importantes

⚠️ **IMPORTANTE:** O arquivo deve ser aberto via servidor HTTP (não via `file://`) para que as camadas GeoJSON sejam carregadas corretamente devido às políticas CORS do navegador.

## Controles

- **Botão de Menu** (canto superior direito): Abre/fecha o painel de camadas
- **Camadas de Base**: Botões para alternar entre os mapas base
- **Camadas de Dados**: Checkboxes para exibir/ocultar as camadas GeoJSON
- **Clique nos polígonos**: Exibe informações detalhadas em popup
