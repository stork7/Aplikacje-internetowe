// Inicjalizacja mapy Leaflet
const map = L.map('mapBox').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Funkcja do centrowania mapy na lokalizacji użytkownika
document.getElementById('centerBtn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                map.setView([latitude, longitude], 13);
            },
            (error) => {
                console.error("Error getting location:", error);
                alert("Unable to retrieve your location.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

// Funkcja do generowania puzzli z widoku mapy jako obraz
function createPuzzles(canvas) {
    const numRows = 4; // 4 wiersze
    const numCols = 4; // 4 kolumny
    const puzzleBox = document.getElementById('puzzleBox');
    const puzzlePieces = [];
    const pieceWidth = canvas.width / numCols;
    const pieceHeight = canvas.height / numRows;

    // Tworzenie puzzli
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const pieceCanvas = document.createElement('canvas');
            pieceCanvas.width = pieceWidth;
            pieceCanvas.height = pieceHeight;
            const context = pieceCanvas.getContext('2d');

            // Rysowanie kawałka na pieceCanvas
            context.drawImage(canvas, col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);

            // Dodanie do tablicy jako obiekt z indeksem
            puzzlePieces.push({
                canvas: pieceCanvas,
                index: row * numCols + col // Obliczenie indeksu w oparciu o rząd i kolumnę
            });
        }
    }

    // Tasowanie puzzli
    shuffleArray(puzzlePieces);

    // Wyświetlanie puzzli w puzzleBox
    puzzleBox.innerHTML = ''; // Czyszczenie poprzednich puzzli
    puzzlePieces.forEach((pieceObj) => {
        const img = document.createElement('img');
        img.src = pieceObj.canvas.toDataURL(); // Ustawianie obrazu puzzli
        img.style.width = '100%'; // Dopasowanie do wielkości puzzleBox
        img.style.height = 'auto';
        img.draggable = true; // Umożliwienie przeciągania
        img.classList.add('puzzle-piece'); // Dodanie klasy
        img.setAttribute('data-index', pieceObj.index); // Ustawienie oryginalnego indeksu puzzla
        img.addEventListener('dragstart', () => {
            img.classList.add('dragging'); // Dodanie klasy do przeciąganego obrazka
        });
        img.addEventListener('dragend', () => {
            img.classList.remove('dragging'); // Usunięcie klasy po zakończeniu przeciągania
        });
        puzzleBox.appendChild(img);
    });
}

// Funkcja do losowego tasowania puzzli
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Funkcja do przechwytywania widoku mapy jako obraz
document.getElementById('captureBtn').addEventListener('click', () => {
    // Czyszczenie solutionBox przed przechwyceniem
    document.getElementById('solutionBox').innerHTML = '';

    map.invalidateSize();
    setTimeout(() => {
        leafletImage(map, function(err, canvas) {
            if (err) {
                console.error("Error generating map image:", err);
                return;
            }
            const imageBox = document.getElementById('imageBox');
            imageBox.innerHTML = ''; // Czyszczenie poprzedniego obrazu
            imageBox.appendChild(canvas); // Dodanie zrzutu mapy
            canvas.style.width = '100%';  // Dopasowanie rozmiaru do imageBox
            canvas.style.height = '100%';

            // Tworzenie puzzli po przechwyceniu obrazu
            createPuzzles(canvas);
        });
    }, 200);
});

// Dodaj eventy do solutionBox
const solutionBox = document.getElementById('solutionBox');

solutionBox.addEventListener('dragover', (e) => {
    e.preventDefault(); // Pozwolenie na upuszczenie
});

solutionBox.addEventListener('drop', (e) => {
    e.preventDefault();
    const draggedImage = document.querySelector('.dragging'); // Wyszukiwanie aktualnie przeciąganego obrazu
    if (draggedImage) {
        const imgClone = draggedImage.cloneNode(true); // Klonowanie obrazu
        imgClone.style.width = '100%'; // Ustawienie rozmiaru na 100%
        imgClone.style.height = 'auto'; // Ustawienie wysokości na auto
        imgClone.classList.remove('dragging'); // Usunięcie klasy drag

        // Obliczanie kolumny i wiersza
        const rect = solutionBox.getBoundingClientRect(); // Pozycja solutionBox
        const x = e.clientX - rect.left; // Pozycja X w solutionBox
        const y = e.clientY - rect.top; // Pozycja Y w solutionBox

        const colIndex = Math.floor(x / (solutionBox.clientWidth / 4));
        const rowIndex = Math.floor(y / (solutionBox.clientHeight / 4));

        // Sprawdzenie, czy istnieje już obrazek w tej pozycji
        const existingPiece = solutionBox.querySelector(`img[data-row="${rowIndex}"][data-col="${colIndex}"]`);

        if (existingPiece) {
            // Wymiana puzzli
            existingPiece.style.opacity = 0; // Ukrycie istniejącego puzzla
            existingPiece.remove(); // Usunięcie istniejącego puzzla
        }

        imgClone.setAttribute('data-row', rowIndex); // Ustawienie danych
        imgClone.setAttribute('data-col', colIndex); // Ustawienie danych
        imgClone.style.gridRowStart = rowIndex + 1; // Ustawienie rzędu
        imgClone.style.gridColumnStart = colIndex + 1; // Ustawienie kolumny

        solutionBox.appendChild(imgClone); // Dodawanie klonu do solutionBox

        // Usunięcie oryginalnego puzzla z puzzleBox
        draggedImage.remove();

        // Sprawdzenie, czy wszystkie puzzle są poprawnie ułożone
        checkForCompletion();
    }
});

function checkForCompletion() {
    const pieces = solutionBox.querySelectorAll('img');
    let isComplete = true;

    pieces.forEach(piece => {
        const row = parseInt(piece.getAttribute('data-row'));
        const col = parseInt(piece.getAttribute('data-col'));
        const index = parseInt(piece.getAttribute('data-index'));

        // Obliczamy oczekiwany index na podstawie rzędu i kolumny
        const expectedIndex = row * 4 + col;
        if (index !== expectedIndex) {
            isComplete = false;
        }
    });

    if (isComplete && pieces.length === 16) {
        console.log("Gratulacje! Puzzle zostały poprawnie ułożone.");
        // Powiadomienie systemowe
        if (Notification.permission === "granted") {
            new Notification("Congratulations! Puzzle completed!");
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification("Congratulations! Puzzle completed!");
                }
            });
        }
    }
}
