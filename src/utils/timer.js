export const startTimer = (callback, duration) => {
    let timer = duration;
    const interval = setInterval(() => {
      timer -= 1;
      if (timer <= 0) {
        clearInterval(interval);
        if (callback) callback();
      }
    }, 1000);
  };
  
  const timerElement = document.querySelector('#timer');
  if (timerElement) {
    timerElement.addEventListener('click', () => startTimer(null, 60));  // Default 60 seconds for demo
  };
  