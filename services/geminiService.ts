export const generateEventTitle = async (date: Date): Promise<string> => {
    const formattedDate = date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return `Cuenta regresiva para ${formattedDate}`;
};
