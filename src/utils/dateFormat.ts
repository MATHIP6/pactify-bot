export function formatDiscordDate(dateString: string) {
  const date = new Date(dateString);
  const formattedDate = Math.floor(date.getTime() / 1000); // Convertir en secondes
  return `<t:${formattedDate}:d>`;
}

export function formatTime(time: number) {
  const seconds = time % 60;
  const minutes = Math.floor((time / 60) % 60);
  const hours = Math.floor(time / 3600);

  let result = '';

  if (hours > 0) {
    result += `${hours} heure(s)`;
  }
  if (minutes > 0) {
    if (result) result += ', ';
    result += `${minutes} minute(s)`;
  }
  if (seconds > 0) {
    if (result) result += ' et ';
    result += `${seconds} seconde(s)`;
  }

  return result || '0 seconde(s)';
}
