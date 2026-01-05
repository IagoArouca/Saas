export const useAudioNotification = () => {
  const playNotification = () => {
    const audio = new Audio('/sounds/somalarme.mp3');
    audio.volume = 0.5; 
    audio.play().catch(_err => console.log("Áudio bloqueado pelo browser até interação do usuário."));
  };

  return { playNotification };
};