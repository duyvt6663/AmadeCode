import {
CreateProjectKeyResponse,
LiveClient,
LiveTranscriptionEvents,
createClient,
} from "@deepgram/sdk";
import { useState, useEffect, useCallback, useRef } from "react";
import { useQueue } from "@uidotdev/usehooks";
// import Dg from "./dg.svg";
import Recording from "./recording.svg";
import { Button } from '@/app/components/ui/button'
import { MicIcon, MicOffIcon, SendHorizontalIcon } from "lucide-react";
import { List } from "postcss/lib/list";
// import Image from "next/image";

/**
 * Represents a Microphone component.
 * @param callback - The callback function to handle the transcription result.
 * @returns The Microphone component.
 */
export default function Microphone(callback: any) {
  const { add, remove, first, size, queue } = useQueue<any>([]);
  const [apiKey, setApiKey] = useState<CreateProjectKeyResponse | null>();
  const [connection, setConnection] = useState<LiveClient | null>();
  const [isListening, setListening] = useState(false);
  const [isLoadingKey, setLoadingKey] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const [isProcessing, setProcessing] = useState(false);
  const [micOpen, setMicOpen] = useState(false);
  const [microphone, setMicrophone] = useState<MediaRecorder | null>();
  const [userMedia, setUserMedia] = useState<MediaStream | null>();
  const caption = useRef<string>("");

  const toggleMicrophone = useCallback(async () => {
    if (microphone && userMedia) {
      microphone.stop();
      setUserMedia(null);
      setMicrophone(null);

    } else {
      const userMedia = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const microphone = new MediaRecorder(userMedia);
      microphone.start(500);

      microphone.onstart = () => {
        setMicOpen(true);
      };

      microphone.onstop = () => {
        setMicOpen(false);
      };

      microphone.ondataavailable = (e) => {
        add(e.data);
      };

      setUserMedia(userMedia);
      setMicrophone(microphone);
    }
  }, [add, microphone, userMedia]);

  useEffect(() => {
    if (micOpen && !apiKey) {
      console.log("getting a new api key");
      fetch("/api/key", { cache: "no-store" })
        .then((res) => res.json())
        .then((object) => {
          if (!("key" in object)) throw new Error("No api key returned");

          setApiKey(object);
          setLoadingKey(false);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [micOpen]);

  useEffect(() => {
    if (apiKey && "key" in apiKey) {
      console.log("connecting to deepgram");
      const deepgram = createClient(apiKey?.key ?? "");
      const connection = deepgram.listen.live({
        model: "nova-2",
        interim_results: true,
        // smart_format: true,
        punctuate: true,
        sample_rate: 16000,
        channels: 1,
        endpointing: 1000
        // language: "en-US",
        // encoding: "linear16"
      });

      connection.on(LiveTranscriptionEvents.Open, () => {
        console.log("connection established");
        setListening(true);
      });

      connection.on(LiveTranscriptionEvents.Close, () => {
        console.log("connection closed");
        setListening(false);
        setApiKey(null);
        setConnection(null);
      });

      connection.on(LiveTranscriptionEvents.Transcript, (data) => {

        if (data.is_final){
          const words = data.channel.alternatives[0].words.map(
                          (word: any) => word.punctuated_word ?? word.word).join(" ");

          if (words.length > 0) {
            caption.current = caption.current.concat(" ", words);
            console.log("interim caption", caption.current);
          }

          if (data.speech_final && caption.current !== ""){
            console.log("final caption", caption.current);

            // send the caption to the chatbot
            callback({
              role: "user",
              content: caption.current,
            });

            // clear the caption
            caption.current = "";
          }
        }
      });

      setConnection(connection);
      setLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    const processQueue = async () => {
      if (size > 0 && !isProcessing) {
        setProcessing(true);

        if (isListening) {
          const blob = first;
          connection?.send(blob);
          remove();
        }

        const waiting = setTimeout(() => {
          clearTimeout(waiting);
          setProcessing(false);
        }, 250);
      }
    };

    processQueue();
  }, [connection, queue, remove, first, size, isProcessing, isListening]);

  return (
    <Button
      size='icon'
      type='button'
      variant='secondary'
      disabled={false}
      className='absolute right-11 top-1 h-8 w-10'
      onClick={toggleMicrophone}
    >
        {userMedia && microphone && micOpen ? (
          <Recording className='h-5 w-5 fill-red-400 drop-shadow-glowReds' />
        ) : (
          <MicOffIcon className='h-5 w-5 fill-gray-600' />
        )}
    </Button>
  );
}
