document.getElementById('getWeatherButton').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    if (!city) {
        alert('Proszę wprowadzić nazwę miasta.');
        return;
    }

    const apiKey = 'd2f9e24d473fd75b7b9c7aa734520f10';

    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', currentWeatherURL, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            console.log('XMLHttpRequest:', data);
            const weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            document.getElementById('currentWeather').innerHTML = `
                <h2>Bieżąca pogoda:</h2>
                <div>
                    <img src="${weatherIcon}" alt="${data.weather[0].description}" >
                    <p>${data.name}: ${data.main.temp}°C, ${data.weather[0].description}</p>
                </div>
            `;
        } else {
            alert('Nie udało się pobrać bieżącej pogody.');
        }
    };
    xhr.send();

    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pl`;
    fetch(forecastURL)
        .then(response => {
            if (!response.ok) throw new Error('Błąd w pobieraniu prognozy.');
            return response.json();
        })
        .then(data => {
            const forecastElement = document.getElementById('forecast');
            console.log('Fetch API:', data);
            forecastElement.innerHTML = '<h2>Prognoza na 5 dni:</h2>';
            data.list.forEach((item, index) => {
                if (index % 8 === 0) {
                    const weatherIcon = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
                    forecastElement.innerHTML += `
                        <div class="forecast-item">
                            <img src="${weatherIcon}" alt="${item.weather[0].description}"class="weather-icon">
                            <p>${item.dt_txt}: ${item.main.temp}°C, ${item.weather[0].description}</p>
                        </div>
                    `;
                }
            });
        })
        .catch(error => alert(error.message));
});
