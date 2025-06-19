const style = document.createElement('style');
style.textContent = `
  .dangerous-flight {
    border: 2px solid #dc2626 !important;
    box-shadow: 0 0 8px rgba(220, 38, 38, 0.3);
    background-color: #fef2f2 !important;
    position: relative !important;
  }
  
  .dangerous-flight::before {
    content: "⚠️ BOEING DETECTED";
    position: absolute;
    top: -1px;
    left: -1px;
    background: linear-gradient(135deg, #dc2626, #ef4444);
    color: white;
    font-size: 11px;
    font-weight: bold;
    padding: 4px 8px;
    border-radius: 4px 0 4px 0;
    z-index: 10;
    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    animation: pulse-warning 2s infinite;
  }
  
  @keyframes pulse-warning {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
  
  .dangerous-flight .sc-aXZVg.bqBeXl {
     background-color: #fee2e2 !important;
     border: 1px solid #fca5a5 !important;
  }
  
  .dangerous-flight:hover {
    border-color: #b91c1c !important;
    box-shadow: 0 0 12px rgba(220, 38, 38, 0.4);
  }
`;
document.head.appendChild(style);

const flightSelector = ".sc-aXZVg.dczbns.mb-2.bg-white";
let dangerousFlightNumbers = null;

const boeingAircrafts = {
    "707": "Boeing 707",
    "B707": "Boeing 707",
    "720": "Boeing 720",
    "B720": "Boeing 720",
    "721": "Boeing 727-100",
    "B721": "Boeing 727-100",
    "722": "Boeing 727-200",
    "B722": "Boeing 727-200",
    "731": "Boeing 737-100",
    "B731": "Boeing 737-100",
    "732": "Boeing 737-200",
    "B732": "Boeing 737-200",
    "733": "Boeing 737-300",
    "B733": "Boeing 737-300",
    "734": "Boeing 737-400",
    "B734": "Boeing 737-400",
    "735": "Boeing 737-500",
    "B735": "Boeing 737-500",
    "736": "Boeing 737-600",
    "B736": "Boeing 737-600",
    "737": "Boeing 737-700",
    "B737": "Boeing 737-700",
    "738": "Boeing 737-800",
    "B738": "Boeing 737-800",
    "739": "Boeing 737-900",
    "B739": "Boeing 737-900",
    "7M7": "Boeing 737 MAX 7",
    "B37M": "Boeing 737 MAX 7",
    "7M8": "Boeing 737 MAX 8",
    "B38M": "Boeing 737 MAX 8",
    "7M9": "Boeing 737 MAX 9",
    "B39M": "Boeing 737 MAX 9",
    "7L9": "Boeing 737 MAX 10",
    "B7L9": "Boeing 737 MAX 10",
    "741": "Boeing 747-100",
    "B741": "Boeing 747-100",
    "742": "Boeing 747-200",
    "B742": "Boeing 747-200",
    "743": "Boeing 747-300",
    "B743": "Boeing 747-300",
    "744": "Boeing 747-400",
    "B744": "Boeing 747-400",
    "748": "Boeing 747-8",
    "B748": "Boeing 747-8",
    "74D": "Boeing 747 Domestic",
    "B74D": "Boeing 747 Domestic",
    "74L": "Boeing 747 SP",
    "B74L": "Boeing 747 SP",
    "74F": "Boeing 747 Freighter",
    "B74F": "Boeing 747 Freighter",
    "752": "Boeing 757-200",
    "B752": "Boeing 757-200",
    "753": "Boeing 757-300",
    "B753": "Boeing 757-300",
    "762": "Boeing 767-200",
    "B762": "Boeing 767-200",
    "763": "Boeing 767-300",
    "B763": "Boeing 767-300",
    "764": "Boeing 767-400ER",
    "B764": "Boeing 767-400ER",
    "772": "Boeing 777-200",
    "B772": "Boeing 777-200",
    "773": "Boeing 777-300",
    "B773": "Boeing 777-300",
    "77L": "Boeing 777-200LR",
    "B77L": "Boeing 777-200LR",
    "77W": "Boeing 777-300ER",
    "B77W": "Boeing 777-300ER",
    "77F": "Boeing 777 Freighter",
    "B77F": "Boeing 777 Freighter",
    "77X": "Boeing 777X",
    "B77X": "Boeing 777X",
    "778": "Boeing 777-8",
    "B778": "Boeing 777-8",
    "779": "Boeing 777-9",
    "B779": "Boeing 777-9",
    "788": "Boeing 787-8 Dreamliner",
    "B788": "Boeing 787-8 Dreamliner",
    "789": "Boeing 787-9 Dreamliner",
    "B789": "Boeing 787-9 Dreamliner",
    "78X": "Boeing 787-10 Dreamliner",
    "B78X": "Boeing 787-10 Dreamliner",
    "717": "Boeing 717-200",
    "B717": "Boeing 717-200"
};

function getDepartDate(url) {
    const params = new URL(url).searchParams;
    return params.get('depart_date');
}

async function fetchAirCraftData() {
    try {
        const pageUrl = window.location.href;
        const departDate = getDepartDate(pageUrl);
        const apiUrl = `https://www.cleartrip.com/flight/search/v2?from=BLR&source_header=BLR&to=JAI&destination_header=JAI&depart_date=${departDate}&class=Economy&adults=1&childs=0&infants=0&mobileApp=true&intl=n&responseType=jsonV3&source=DESKTOP&utm_currency=INR&sft=&return_date=&carrier=&cfw=false&multiFare=true&isFFSC=false`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'app-agent': 'DESKTOP' }
        });

        if (!response.ok) {
            console.error(`Error fetching aircraft data: HTTP status ${response.status}`);
            return [];
        }

        const data = await response.json();

        if (data && typeof data.flights === 'object' && data.flights !== null) {
            const dangerousFlights = [];

            for (const flight of Object.keys(data.flights)) {
                const aircraftType = data.flights[flight].aircraftType;
                const codes = aircraftType.split(' ');

                if (boeingAircrafts[aircraftType] || aircraftType.startsWith('7')) {
                    dangerousFlights.push(flight);
                } else if (codes.length > 1 && boeingAircrafts[codes[0]]) {
                    dangerousFlights.push(flight);
                }
            }

            return dangerousFlights;
        } else {
            console.warn('API response structure unexpected: missing or invalid "flights" field', data);
            return [];
        }
    } catch (error) {
        console.error('Error fetching aircraft data:', error);
        return [];
    }
}

function markFlightIfDangerous(flightDiv) {
    if (flightDiv && flightDiv.nodeType === Node.ELEMENT_NODE && !flightDiv.classList.contains('dangerous-flight')) {
        if (dangerousFlightNumbers === null) {
            console.warn("markFlightIfDangerous called before data was loaded. This indicates a script logic issue.");
            return;
        }

        const flightNumberElement = flightDiv.querySelector('.sc-eqUAAy.fkahrI');

        if (flightNumberElement) {
            const flightNumber = flightNumberElement.textContent.trim();

            for (flight of dangerousFlightNumbers) {
                if (flight.startsWith(flightNumber)) {
                    console.log(`Marking flight as dangerous: ${flightNumber} (found in dangerous list)`);
                    flightDiv.classList.add('dangerous-flight');
                }
            }
        } else {
            console.warn('Could not find flight number element in flight div:', flightDiv);
        }
    }
}

fetchAirCraftData().then(data => {
    dangerousFlightNumbers = data;
    document.querySelectorAll(flightSelector).forEach(markFlightIfDangerous);

    console.log('Starting MutationObserver...');

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE && node.matches(flightSelector)) {
                    markFlightIfDangerous(node);
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    node.querySelectorAll(flightSelector).forEach(markFlightIfDangerous);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}).catch(error => {
    console.error("Error during the initial data fetch or processing:", error);
});