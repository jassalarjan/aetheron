import { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const useVoiceCommands = (onCommandParsed) => {
  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  useEffect(() => {
    if (!listening && transcript) {
      const parsed = parseVoiceCommand(transcript.toLowerCase());
      onCommandParsed(parsed);
      resetTranscript();
    }
  }, [transcript, listening]);

  const start = () => SpeechRecognition.startListening({ continuous: true });
  const stop = () => SpeechRecognition.stopListening();

  return { transcript, start, stop, listening };
};

function parseVoiceCommand(cmd) {
  const action = /(create|delete|update|show)/.exec(cmd)?.[0];
  const domain = /(text|nlp|image)/.exec(cmd)?.[0];
  const idMatch = /chat (\d+)/.exec(cmd);
  const id = idMatch ? parseInt(idMatch[1]) : null;
  return { action, domain, id };
}

export default useVoiceCommands;
