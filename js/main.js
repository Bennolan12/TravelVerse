// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close menu when link is clicked
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Weather Search Function
function searchWeatherForecast() {
    console.log('Weather function called');
    const cityInput = document.getElementById('cityInput');
    const weatherResult = document.getElementById('weatherResult');
    const city = cityInput.value.trim();

    console.log('City entered:', city);

    if (!city) {
        weatherResult.innerHTML = '<p style="color: #FFE5E5; font-weight: bold;">❌ Please enter a city name.</p>';
        return;
    }

    weatherResult.innerHTML = '<p style="color: white;">🔄 Loading weather data...</p>';

    // Fetch coordinates
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`)
        .then(response => response.json())
        .then(geoData => {
            console.log('Geo data:', geoData);

            if (!geoData.results || geoData.results.length === 0) {
                weatherResult.innerHTML = '<p style="color: #FFE5E5; font-weight: bold;">❌ City not found. Try: Paris, Tokyo, New York, Bali, London</p>';
                return;
            }

            const location = geoData.results[0];
            const { latitude, longitude, name, country, admin1 } = location;

            console.log('Location:', name, latitude, longitude);

            // Fetch weather
            return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=celsius&timezone=auto`);
        })
        .then(response => response.json())
        .then(weatherData => {
            console.log('Weather data:', weatherData);

            const current = weatherData.current;
            const timezone = weatherData.timezone;

            const temp = Math.round(current.temperature_2m);
            const humidity = current.relative_humidity_2m;
            const windSpeed = Math.round(current.wind_speed_10m);
            const weatherCode = current.weather_code;

            const weatherDescriptions = {
                0: '☀️ Clear sky',
                1: '🌤️ Mainly clear',
                2: '⛅ Partly cloudy',
                3: '☁️ Overcast',
                45: '🌫️ Foggy',
                48: '🌫️ Foggy with rime',
                51: '🌧️ Light drizzle',
                53: '🌧️ Moderate drizzle',
                55: '🌧️ Heavy drizzle',
                61: '🌧️ Slight rain',
                63: '🌧️ Moderate rain',
                65: '🌧️ Heavy rain',
                71: '❄️ Slight snow',
                73: '❄️ Moderate snow',
                75: '❄️ Heavy snow',
                80: '🌧️ Rain showers',
                95: '⛈️ Thunderstorm',
            };

            const weatherDesc = weatherDescriptions[weatherCode] || '🌍 Unknown weather';

            const now = new Date();
            const localTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
            const timeString = localTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

            const html = `
                <div style="background: rgba(255, 255, 255, 0.15); padding: 25px; border-radius: 10px; text-align: center; max-width: 600px; margin: 0 auto;">
                    <p style="font-size: 1.4rem; font-weight: bold; margin: 10px 0; color: white;">${current.name || 'Location'}</p>
                    <p style="font-size: 0.9rem; opacity: 0.95; margin: 8px 0; color: rgba(255, 255, 255, 0.9);">Local Time: ${timeString}</p>
                    <hr style="border: none; border-top: 1px solid rgba(255, 255, 255, 0.3); margin: 15px 0;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px; text-align: center;">
                        <div style="background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 8px;">
                            <p style="font-size: 0.9rem; opacity: 0.9; margin: 0 0 8px 0;">Temperature</p>
                            <p style="font-size: 2.5rem; font-weight: bold; margin: 0; color: white;">${temp}°C</p>
                        </div>
                        <div style="background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 8px;">
                            <p style="font-size: 0.9rem; opacity: 0.9; margin: 0 0 8px 0;">Condition</p>
                            <p style="font-size: 1.3rem; margin: 0; color: white;">${weatherDesc}</p>
                        </div>
                        <div style="background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 8px;">
                            <p style="font-size: 0.9rem; opacity: 0.9; margin: 0 0 8px 0;">Humidity</p>
                            <p style="font-size: 2rem; font-weight: bold; margin: 0; color: white;">${humidity}%</p>
                        </div>
                        <div style="background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 8px;">
                            <p style="font-size: 0.9rem; opacity: 0.9; margin: 0 0 8px 0;">Wind Speed</p>
                            <p style="font-size: 2rem; font-weight: bold; margin: 0; color: white;">${windSpeed} km/h</p>
                        </div>
                    </div>
                </div>
            `;

            weatherResult.innerHTML = html;
        })
        .catch(error => {
            console.error('Error:', error);
            weatherResult.innerHTML = '<p style="color: #FFE5E5; font-weight: bold;">❌ Error fetching weather. Please try again.</p>';
        });
}

// Form Validation and Handling
function handleFormSubmit(event) {
    event.preventDefault();

    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    const destination = document.getElementById('destination').value;

    // Validation flags
    let isValid = true;

    // Validate name
    if (name.length < 2) {
        document.getElementById('nameError').textContent = 'Name must be at least 2 characters long.';
        isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address.';
        isValid = false;
    }

    // Validate subject
    if (subject.length < 5) {
        document.getElementById('subjectError').textContent = 'Subject must be at least 5 characters long.';
        isValid = false;
    }

    // Validate message
    if (message.length < 10) {
        document.getElementById('messageError').textContent = 'Message must be at least 10 characters long.';
        isValid = false;
    }

    // If valid, process form
    if (isValid) {
        // Prepare form data
        const formData = {
            name: name,
            email: email,
            phone: phone,
            subject: subject,
            message: message,
            destination: destination,
            timestamp: new Date().toISOString()
        };

        // Save to localStorage (simulating database)
        let submissions = JSON.parse(localStorage.getItem('formSubmissions')) || [];
        submissions.push(formData);
        localStorage.setItem('formSubmissions', JSON.stringify(submissions));

        // Show success message
        const successMessage = document.getElementById('successMessage');
        successMessage.textContent = '✓ Thank you for your message! We will get back to you soon.';
        successMessage.classList.add('show');

        // Reset form
        document.getElementById('contactForm').reset();

        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);

        console.log('Form submitted:', formData);
    }
}

// Allow Enter key
document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('cityInput');
    if (cityInput) {
        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchWeatherForecast();
            }
        });
    }
});