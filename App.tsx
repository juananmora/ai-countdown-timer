import React, { useMemo, useState } from 'react';
import TimeUnit from './components/TimeUnit';
import { useCountdown } from './hooks/useCountdown';
import { formatDateTimeLocal, parseQuickEventPrompt } from './utils/quickEventParser';

const COPILOT_LOGO = `data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRjhGOEZGIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMS4yMyAxMC4yIj48cGF0aCBkPSJNOS4xMywzLjQxYy0uMTQtLjE0LS4zMS0uMjEtLjQ4LS4yMXMtLjM1LC4wNy0uNDksLjIxTDYuMDIsNS41NSw0LjM0LDMuODdjLS4xNC0uMTQtLjMyLS4yMS0uNS0uMjFzLS4zNiwwLS41LC4yMUMzLjIyLDMuODQsMywxMSw0LjQ3LDMuMTZDNy41MSw0LjQ4LDYuMDIsNy41Miw2LjAyLDcuNTJsMS41NS0xLjU1LDAsMCwxLjU2LTEuNTYsMCwwYzAtLjE0LTMuMTYsMy4xNC00LjQ4LDQuNDcsMS4zMiwxLjMyLDQuNDgsMy4xNCw0LjQ4LDMuMTRzMy4xNi0zLjE0LDQuNDctNC40OEM5LjE0LDkuMTIsOS4xMywzLjQxLDkuMTMsMy40MVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0uNDQgLTEuMzQpIi8+PHBhdGggZD0iTTEwLjI2LDEuNDRjLS4xNC0uMTQtLjMyLS4yMi0uNS0uMjJoMEM4LjQ1LDAsMi4xMSw2LjM0LDIuMTEsNi4zNFYxLjY2YzAtLjE1LS4wNy0uMi4yMS0uMzNDMi4yNCwxLjI5LDIuMjEsMS4yNSwyLjE4LDEuMjFjLS4xNC0uMTQtLjMyLS4yMS0uNS0uMjFTMS4zMywxLjA3LDEuMTgsMS4yMUMuMzcsMiwwLC43LDAsLjdWOS41YzAsLjE1LDUuNjQsNS42NCw1LjY0LDUuNjRzNS42NC01LjY0LDUuNjQtNS42NEw1LjY0LDUuNjQsMTAuMjYsMS40NFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0uNDQgLTEuMzQpIi8+PC9zdmc+`;

const App: React.FC = () => {
    const [targetDate, setTargetDate] = useState<Date | null>(null);
    const [eventName, setEventName] = useState<string>('');
    const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [dateString, setDateString] = useState<string>('');
    const [quickPrompt, setQuickPrompt] = useState<string>('');

    const timeLeft = useCountdown(isCountingDown ? targetDate : null);

    const minDateTime = useMemo(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset() + 1);
        return now.toISOString().slice(0, 16);
    }, []);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const dateValue = e.target.value;
        setDateString(dateValue);
        if (dateValue) {
            const selectedDate = new Date(dateValue);
            if (selectedDate > new Date()) {
                setError('');
            } else {
                setError('Por favor, selecciona una fecha y hora futuras.');
            }
        }
    };

    const handleQuickCreate = () => {
        const parsedEvent = parseQuickEventPrompt(quickPrompt);
        if ('error' in parsedEvent) {
            setError(parsedEvent.error);
            return;
        }

        setError('');
        setEventName(parsedEvent.eventName);
        setTargetDate(parsedEvent.targetDate);
        setDateString(formatDateTimeLocal(parsedEvent.targetDate));
        setIsCountingDown(true);
    };

    const handleStartCountdown = () => {
        if (!dateString) {
            setError('Por favor, selecciona una fecha y hora.');
            return;
        }
        const selectedDate = new Date(dateString);
        if (selectedDate <= new Date()) {
            setError('Por favor, selecciona una fecha y hora futuras.');
            return;
        }
        if (!eventName.trim()) {
            setError('Por favor, introduce un nombre para el evento.');
            return;
        }

        setError('');
        setTargetDate(selectedDate);
        setIsCountingDown(true);
    };

    const handleReset = () => {
        setIsCountingDown(false);
        setTargetDate(null);
        setEventName('');
        setError('');
        setDateString('');
        setQuickPrompt('');
    };

    const isFinished = timeLeft ? Object.values(timeLeft).every((val) => val === 0) : false;

    const formatDisplayDateTime = (d: Date) => {
        const pad = (n: number) => n.toString().padStart(2, '0');
        const day = pad(d.getDate());
        const month = pad(d.getMonth() + 1);
        const year = d.getFullYear();
        const hours = pad(d.getHours());
        const minutes = pad(d.getMinutes());
        const seconds = pad(d.getSeconds());
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

    if (!isCountingDown) {
        return (
            <main className="animated-grid-background enhanced-grid min-h-screen w-full flex items-center justify-center p-4 text-slate-100 font-space">
                <div className="w-full max-w-3xl mx-auto glass-panel rounded-2xl p-8 md:p-12 border border-indigo-500/30 fade-in">
                    <div className="flex flex-col items-center gap-8 animate-fade-in">
                        <div className="flex items-center justify-center gap-10 flex-wrap">
                            <img src="logo-bbva.png" alt="BBVA Logo" className="h-16 md:h-24 w-auto object-contain drop-shadow-lg" />
                            <img src={COPILOT_LOGO} alt="Copilot Logo" className="h-16 md:h-24 w-auto object-contain drop-shadow-lg" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-orbitron neon-title text-center text-indigo-300">Creador de Cuentas Regresivas</h1>
                        <p className="text-center text-slate-400">Describe tu evento con lenguaje natural o configúralo manualmente.</p>

                        <div className="w-full space-y-4">
                            <div>
                                <label htmlFor="quick-prompt" className="block text-sm font-medium text-slate-300 mb-2">Crear desde texto</label>
                                <input
                                    id="quick-prompt"
                                    type="text"
                                    value={quickPrompt}
                                    onChange={(e) => setQuickPrompt(e.target.value)}
                                    placeholder="Ej: crea una sesion de devops para el miercoles a la 10 am"
                                    className="w-full p-3 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                />
                                <p className="mt-2 text-sm text-slate-400">Reconoce hoy, mañana y días de la semana con horas como 10 am o 18:30.</p>
                            </div>

                            <button
                                onClick={handleQuickCreate}
                                className="w-full primary-btn text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500/40"
                            >
                                Crear desde texto
                            </button>
                        </div>

                        <div className="w-full h-px bg-slate-700/70" />

                        <div className="w-full space-y-4">
                            <div>
                                <label htmlFor="datetime-picker" className="block text-sm font-medium text-slate-300 mb-2">Fecha y Hora del Evento</label>
                                <input
                                    id="datetime-picker"
                                    type="datetime-local"
                                    value={dateString}
                                    min={minDateTime}
                                    onChange={handleDateChange}
                                    className="w-full p-3 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label htmlFor="event-name" className="block text-sm font-medium text-slate-300 mb-2">Nombre del Evento</label>
                                <input
                                    id="event-name"
                                    type="text"
                                    value={eventName}
                                    onChange={(e) => setEventName(e.target.value)}
                                    placeholder="Ej: Lanzamiento del Proyecto Fénix"
                                    className="w-full p-3 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-400 text-center text-sm">{error}</p>}

                        <button
                            onClick={handleStartCountdown}
                            className="w-full primary-btn text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500/40"
                        >
                            Iniciar Cuenta Regresiva
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="animated-grid-background enhanced-grid min-h-screen w-full flex flex-col items-center justify-center p-4 font-space text-white relative">
            <div className="flex items-center justify-center gap-10 flex-wrap mb-10 px-6">
                <img src="logo-bbva.png" alt="BBVA Logo" className="h-20 md:h-28 w-auto object-contain drop-shadow-lg" />
                <img src={COPILOT_LOGO} alt="Copilot Logo" className="h-20 md:h-28 w-auto object-contain drop-shadow-lg" />
            </div>
            <div className="text-center animate-fade-in flex flex-col items-center gap-10 md:gap-16">
                <div>
                    <h2 className="text-4xl sm:text-5xl md:text-7xl font-orbitron neon-title text-indigo-300 break-words px-4 uppercase tracking-widest">{eventName}</h2>
                    {targetDate && <p className="text-slate-400 mt-4 text-base md:text-xl font-mono">{formatDisplayDateTime(targetDate)}</p>}
                </div>

                {isFinished ? (
                    <div className="text-6xl md:text-9xl font-bold text-green-400 my-10 animate-pulse">
                        ¡LANZADO!
                    </div>
                ) : (
                    timeLeft && (
                        <div className="flex justify-center gap-2 sm:gap-4 md:gap-6">
                            <div className="time-unit-card"><TimeUnit value={timeLeft.days} label="Días" /></div>
                            <div className="time-unit-card"><TimeUnit value={timeLeft.hours} label="Horas" /></div>
                            <div className="time-unit-card"><TimeUnit value={timeLeft.minutes} label="Minutos" /></div>
                            <div className="time-unit-card"><TimeUnit value={timeLeft.seconds} label="Segundos" /></div>
                        </div>
                    )
                )}
            </div>

            <button
                onClick={handleReset}
                className="absolute bottom-8 md:bottom-12 bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700 text-slate-300 hover:text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-500/50"
            >
                Crear Nueva Cuenta Regresiva
            </button>
        </main>
    );
};

export default App;
