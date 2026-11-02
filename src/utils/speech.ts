// Web Speech API helper for NutriBot voice narration in Indonesian

export function speakText(text: string, onEnd?: () => void): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser');
    return false;
  }

  try {
    // Cancel any active speech
    window.speechSynthesis.cancel();

    // Clean markdown formatting for smoother speech
    const cleanText = text
      .replace(/[*#_~`]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/📸|⭐|⚡|🍞|💪|🥑|🌟|🦸‍♂️|💡|❓|🚀|🧠|🛡️|🥦|🍎|💧/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    if (!cleanText) return false;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'id-ID';
    utterance.rate = 1.05; // Friendly and lively pace
    utterance.pitch = 1.15; // Slightly higher, friendly robot/detective voice

    // Look for Indonesian voice if available
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find((v) => v.lang.startsWith('id') || v.lang.startsWith('ind'));
    if (idVoice) {
      utterance.voice = idVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = () => onEnd();
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Speech synthesis error:', err);
    return false;
  }
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
