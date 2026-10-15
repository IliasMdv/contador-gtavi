// Rockstar anuncia el 19 de noviembre de 2026, pero no una hora concreta.
// La medianoche de Nueva York es solo una referencia configurable.
const RELEASE_AT = '2026-11-19T00:00:00-05:00';
const RELEASE_TIME_ZONE = 'America/New_York';

const targetTime = new Date(RELEASE_AT).getTime();
const units = {
	days: document.getElementById('days'),
	hours: document.getElementById('hours'),
	minutes: document.getElementById('minutes'),
	seconds: document.getElementById('seconds'),
};
const availableMessage = document.getElementById('available-message');
const releaseNote = document.getElementById('release-note');
let intervalId;

const dateFormatter = new Intl.DateTimeFormat('es-ES', {
	day: 'numeric',
	month: 'long',
	year: 'numeric',
	timeZone: RELEASE_TIME_ZONE,
});

document.querySelector('.timezone-note').textContent =
	`Cuenta hasta las 00:00 de Nueva York (${RELEASE_TIME_ZONE}). La hora oficial de lanzamiento no ha sido anunciada.`;
releaseNote.innerHTML = `Lanzamiento anunciado: <strong>${dateFormatter.format(targetTime)}</strong>`;

function renderCountdown() {
	const remainingSeconds = Math.max(0, Math.ceil((targetTime - Date.now()) / 1000));

	if (remainingSeconds === 0) {
		Object.values(units).forEach((element) => {
			element.textContent = '0'.repeat(element.id === 'days' ? 3 : 2);
		});
		availableMessage.hidden = false;
		clearInterval(intervalId);
		return false;
	}

	const values = {
		days: Math.floor(remainingSeconds / 86_400),
		hours: Math.floor((remainingSeconds % 86_400) / 3_600),
		minutes: Math.floor((remainingSeconds % 3_600) / 60),
		seconds: remainingSeconds % 60,
	};

	Object.entries(values).forEach(([unit, value]) => {
		const element = units[unit];
		const formattedValue = String(value).padStart(unit === 'days' ? 3 : 2, '0');
		if (element.textContent !== formattedValue) {
			element.textContent = formattedValue;
			element.classList.remove('is-changing');
			void element.offsetWidth;
			element.classList.add('is-changing');
		}
	});

	return true;
}

if (Number.isNaN(targetTime)) {
	throw new Error('RELEASE_AT debe ser una fecha ISO válida con zona horaria explícita.');
}

if (renderCountdown()) {
	intervalId = window.setInterval(renderCountdown, 1000);
}

document.addEventListener('visibilitychange', () => {
	if (document.hidden) return;
	renderCountdown();
	if (Date.now() < targetTime && !intervalId) {
		intervalId = window.setInterval(renderCountdown, 1000);
	}
});
