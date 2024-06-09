"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  Client,
  useStreamMessages,
  useClient,
  useMessages,
  useConversations,
  useCanMessage,
  useStartConversation,
} from "@xmtp/react-sdk";
import { ethers } from "ethers";
import { useAddress, useSigner } from "@thirdweb-dev/react";

export default function ChatPage() {
  const { address: chatAddress } = useParams();
  const userAddress = useAddress();
  const signer = useSigner();
  const [client, setClient] = useState<Client | null>(null);
  const [conversation, setConversation] = useState(null);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);

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
      env: "dev",
    };
    const walletSigner = signer.getSigner();
    const initializedClient = await initialize({ signer: walletSigner, options });
    setClient(initializedClient);
  };

  const startChat = async () => {
    if (client && (await canMessage(chatAddress))) {
      const conversation = await startConversation(chatAddress);
      setConversation(conversation);
    }
  };

  useEffect(() => {
    if (client && chatAddress) {
      startChat();
    }
  }, [client, chatAddress]);

  const onMessage = useCallback((message) => {
    setHistory((prevMessages) => [...prevMessages, message]);
  }, []);

  useEffect(() => {
    if (conversation) {
      const { unsubscribe } = useStreamMessages(conversation, { onMessage });
      return () => unsubscribe();
    }
  }, [conversation, onMessage]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (conversation && message.trim()) {
      await conversation.send(message);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mt-6">Chat with {chatAddress}</h1>
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