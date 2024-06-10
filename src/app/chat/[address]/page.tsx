"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  Client,
  useStreamMessages,
  useClient,
  useCanMessage,
  useStartConversation,
  Conversation,
} from "@xmtp/react-sdk";
import { useAddress, useSigner } from "@thirdweb-dev/react";

interface Message {
  senderAddress: string;
  content: string;
}

export default function ChatPage() {
  const { address: rawChatAddress } = useParams();
  const chatAddress = Array.isArray(rawChatAddress) ? rawChatAddress[0] : rawChatAddress;
  const userAddress = useAddress();
  const signer = useSigner();
  const [client, setClient] = useState<Client | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<Message[]>([]);

  const { initialize } = useClient();
  const { startConversation } = useStartConversation();
  const { canMessage } = useCanMessage();

  useEffect(() => {
    if (signer) {
      initXmtp();
    }
  }, [signer]);

  const initXmtp = async () => {
    if (!signer) return;
    const options = {
      persistConversations: false,
      env: "production" as "production",
    };
    const initializedClient = await initialize({ signer, options });
    if (initializedClient) {
      setClient(initializedClient);
    }
  };

  const onMessage = useCallback((message: Message) => {
    setHistory((prevMessages) => [...prevMessages, message]);
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (conversation && message.trim()) {
      await conversation.send(message);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h1 className="mt-6">Chat with {chatAddress}</h1>
      <div className="w-full max-w-2xl mt-6">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="h-64 overflow-y-scroll p-4 border border-gray-300 rounded-lg mb-4">
            {history.length === 0 ? (
              <p className="text-center text-gray-500">No chat history</p>
            ) : (
              history.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 ${
                    msg.senderAddress === userAddress ? "text-right" : "text-left"
                  }`}
                >
                  <div className="bg-gray-200 p-2 rounded-lg inline-block">
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <form onSubmit={sendMessage} className="flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded-l-lg"
              placeholder="Type a message..."
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-lg">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
