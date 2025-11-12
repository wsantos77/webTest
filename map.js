// Inicialização do mapa - Centro em Itapetinga, BA
const map = L.map('map').setView([-15.2489, -40.2478], 11);

// Definição das 3 camadas de base de mapas

// 1. OpenStreetMap (padrão)
const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
});

// 2. CartoDB Positron (estilo claro e moderno)
const cartoLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
});

// 3. Esri World Imagery (imagens de satélite)
const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 19
});

// Adicionar a camada padrão (OpenStreetMap)
osmLayer.addTo(map);

// Armazenar referências das camadas
const baseLayers = {
    'OpenStreetMap': osmLayer,
    'CartoDB Positron': cartoLayer,
    'Satélite (Esri)': satelliteLayer
};

// Variável para rastrear a camada ativa
let currentLayer = osmLayer;

// Função para alternar entre camadas
function switchLayer(layerName) {
    // Remove a camada atual
    map.removeLayer(currentLayer);
    
    // Adiciona a nova camada
    currentLayer = baseLayers[layerName];
    currentLayer.addTo(map);
    
    // Atualiza os botões
    updateButtons(layerName);
}

// Função para atualizar o estado dos botões
function updateButtons(activeLayerName) {
    const buttons = document.querySelectorAll('.layer-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        
        // Identifica qual botão corresponde à camada ativa
        if (btn.id === 'osm-layer' && activeLayerName === 'OpenStreetMap') {
            btn.classList.add('active');
        } else if (btn.id === 'carto-layer' && activeLayerName === 'CartoDB Positron') {
            btn.classList.add('active');
        } else if (btn.id === 'satellite-layer' && activeLayerName === 'Satélite (Esri)') {
            btn.classList.add('active');
        }
    });
}

// Event listeners para os botões
document.getElementById('osm-layer').addEventListener('click', () => {
    switchLayer('OpenStreetMap');
});

document.getElementById('carto-layer').addEventListener('click', () => {
    switchLayer('CartoDB Positron');
});

document.getElementById('satellite-layer').addEventListener('click', () => {
    switchLayer('Satélite (Esri)');
});

// Adicionar controle de escala
L.control.scale({
    imperial: false,
    metric: true
}).addTo(map);

// Carregar camadas GeoJSON
let imoveisLayer = null;
let itapetingaLayer = null;

// Estilo para Imóveis Rurais
const imoveisStyle = {
    color: '#ffc107',
    weight: 2,
    opacity: 0.8,
    fillColor: '#ffc107',
    fillOpacity: 0.3
};

// Estilo para Limite de Itapetinga
const itapetingaStyle = {
    color: '#4ecdc4',
    weight: 3,
    opacity: 0.9,
    fillColor: '#4ecdc4',
    fillOpacity: 0.1
};

// Mapeamento de traduções para nomes de atributos
const attributeTranslations = {
    'cod_tema': 'Código do Tema',
    'nom_tema': 'Nome do Tema',
    'cod_imovel': 'Código do Imóvel',
    'mod_fiscal': 'Módulo Fiscal',
    'num_area': 'Área (ha)',
    'ind_status': 'Status',
    'ind_tipo': 'Tipo',
    'des_condic': 'Condição',
    'municipio': 'Município',
    'cod_estado': 'Código do Estado',
    'dat_criaca': 'Data de Criação',
    'dat_atuali': 'Data de Atualização',
    'CD_MUN': 'Código do Município',
    'NM_MUN': 'Nome do Município',
    'CD_RGI': 'Código RGI',
    'NM_RGI': 'Nome RGI',
    'CD_RGINT': 'Código RGINT',
    'NM_RGINT': 'Nome RGINT',
    'CD_UF': 'Código UF',
    'NM_UF': 'Nome do Estado',
    'SIGLA_UF': 'Sigla do Estado',
    'CD_REGIA': 'Código da Região',
    'NM_REGIA': 'Nome da Região',
    'SIGLA_RG': 'Sigla da Região',
    'CD_CONCU': 'Código CONCU',
    'NM_CONCU': 'Nome CONCU',
    'AREA_KM2': 'Área (km²)'
};

// Função para formatar nome do atributo
function formatAttributeName(key) {
    // Verificar se existe tradução direta
    if (attributeTranslations[key]) {
        return attributeTranslations[key];
    }
    
    // Formatação automática para outros campos
    let formatted = key
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .toLowerCase()
        .split(' ')
        .map(word => {
            // Capitalizar primeira letra de cada palavra
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
    
    // Correções específicas
    formatted = formatted
        .replace(/Cod /g, 'Código ')
        .replace(/Nom /g, 'Nome ')
        .replace(/Dat /g, 'Data ')
        .replace(/Mod /g, 'Módulo ')
        .replace(/Area /g, 'Área ')
        .replace(/Ind /g, 'Indicador ')
        .replace(/Des /g, 'Descrição ')
        .replace(/Sigla /g, 'Sigla ')
        .replace(/Km/g, 'km')
        .replace(/Ha/g, 'ha');
    
    return formatted;
}

// Função para criar tabela de atributos completa
function createAttributeTable(properties, title) {
    let tableContent = `
        <div class="popup-container">
            <h3 class="popup-title">${title}</h3>
            <table class="attribute-table">
                <tbody>
    `;
    
    // Iterar sobre todas as propriedades
    for (const [key, value] of Object.entries(properties)) {
        if (value !== null && value !== undefined && value !== '') {
            let displayValue = value;
            
            // Formatar valores numéricos
            if (typeof value === 'number') {
                if (key.toLowerCase().includes('area') || key.toLowerCase().includes('km')) {
                    displayValue = value.toFixed(2);
                } else {
                    displayValue = value.toString();
                }
            }
            
            // Formatar chave para exibição
            const displayKey = formatAttributeName(key);
            
            tableContent += `
                <tr>
                    <td class="attr-key">${displayKey}:</td>
                    <td class="attr-value">${displayValue}</td>
                </tr>
            `;
        }
    }
    
    tableContent += `
                </tbody>
            </table>
        </div>
    `;
    
    return tableContent;
}

// Função para criar popup para imóveis
function onEachFeatureImoveis(feature, layer) {
    if (feature.properties) {
        const popupContent = createAttributeTable(feature.properties, 'Imóvel Rural');
        layer.bindPopup(popupContent, {
            maxWidth: 400,
            maxHeight: 500,
            className: 'custom-popup'
        });
    }
}

// Função para criar popup para Itapetinga
function onEachFeatureItapetinga(feature, layer) {
    if (feature.properties) {
        const popupContent = createAttributeTable(feature.properties, 'Limite Municipal');
        layer.bindPopup(popupContent, {
            maxWidth: 400,
            maxHeight: 500,
            className: 'custom-popup'
        });
    }
}

// Carregar camada de Imóveis Rurais
fetch('data/imoveis_rurais_itapetinga.geojson')
    .then(response => response.json())
    .then(data => {
        imoveisLayer = L.geoJSON(data, {
            style: imoveisStyle,
            onEachFeature: onEachFeatureImoveis
        });
        imoveisLayer.addTo(map);
        console.log('Camada de Imóveis Rurais carregada com sucesso!');
    })
    .catch(error => {
        console.error('Erro ao carregar camada de Imóveis Rurais:', error);
    });

// Carregar camada de Limite de Itapetinga
fetch('data/itapetinga.geojson')
    .then(response => response.json())
    .then(data => {
        itapetingaLayer = L.geoJSON(data, {
            style: itapetingaStyle,
            onEachFeature: onEachFeatureItapetinga
        });
        itapetingaLayer.addTo(map);
        console.log('Camada de Limite de Itapetinga carregada com sucesso!');
    })
    .catch(error => {
        console.error('Erro ao carregar camada de Limite de Itapetinga:', error);
    });

// Controles de checkbox para as camadas GeoJSON
const imoveisCheckbox = document.getElementById('imoveis-checkbox');
const itapetingaCheckbox = document.getElementById('itapetinga-checkbox');

imoveisCheckbox.addEventListener('change', (e) => {
    if (imoveisLayer) {
        if (e.target.checked) {
            imoveisLayer.addTo(map);
        } else {
            map.removeLayer(imoveisLayer);
        }
    }
});

itapetingaCheckbox.addEventListener('change', (e) => {
    if (itapetingaLayer) {
        if (e.target.checked) {
            itapetingaLayer.addTo(map);
        } else {
            map.removeLayer(itapetingaLayer);
        }
    }
});

// Controle de hover do painel de camadas base
const toggleBaseBtn = document.getElementById('toggle-base-layers');
const baseLayerPanel = document.getElementById('base-layer-panel');
const baseLayerControl = document.getElementById('base-layer-control');

let baseHoverTimeout = null;

function showBasePanel() {
    clearTimeout(baseHoverTimeout);
    baseLayerPanel.classList.remove('hidden');
}

function hideBasePanel() {
    baseHoverTimeout = setTimeout(() => {
        baseLayerPanel.classList.add('hidden');
    }, 200);
}

baseLayerControl.addEventListener('mouseenter', showBasePanel);
baseLayerPanel.addEventListener('mouseenter', showBasePanel);
baseLayerControl.addEventListener('mouseleave', hideBasePanel);
baseLayerPanel.addEventListener('mouseleave', hideBasePanel);

// Controle de hover do painel de camadas de dados
const toggleDataBtn = document.getElementById('toggle-data-layers');
const dataLayerPanel = document.getElementById('data-layer-panel');
const dataLayerControl = document.getElementById('data-layer-control');

let dataHoverTimeout = null;

function showDataPanel() {
    clearTimeout(dataHoverTimeout);
    dataLayerPanel.classList.remove('hidden');
}

function hideDataPanel() {
    dataHoverTimeout = setTimeout(() => {
        dataLayerPanel.classList.add('hidden');
    }, 200);
}

dataLayerControl.addEventListener('mouseenter', showDataPanel);
dataLayerPanel.addEventListener('mouseenter', showDataPanel);
dataLayerControl.addEventListener('mouseleave', hideDataPanel);
dataLayerPanel.addEventListener('mouseleave', hideDataPanel);

console.log('WebGIS inicializado com sucesso!');
console.log('Camadas disponíveis:', Object.keys(baseLayers));

