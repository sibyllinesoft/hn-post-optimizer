import { StreamingAdapterObserver } from "@nlux/core";
import { COMPLETIONS_URL, DEFAULT_MODEL } from "./config";

type Message = { role: string; content: string };

interface AdapterConfig {
  apiUrl?: string;
  model?: string;
  applicationId: number;
  sessionId?: string;
  idToken?: string;
  accessToken?: string;
  openModal: () => void;
}

const getHeaders = (
  applicationId: number,
  idToken?: string,
  accessToken?: string,
  sessionId?: string
) => {
  if (idToken && accessToken) {
    return {
      "X-KeyTrustee-Application-Id": applicationId.toString(),
      "Content-Type": "application/json",
      "X-Session-ID": sessionId || "",
    };
  } else if (sessionId) {
    return {
      "X-KeyTrustee-Application-Id": applicationId.toString(),
      "Content-Type": "application/json",
      "X-Session-ID": sessionId,
    };
  }
  throw new Error(
    "Either an id token and access token or session ID must be supplied"
  );
};

const verifyResponse = async (response: Response, openModal: () => void) => {
  if (!response.ok) {
    if (
      response.status === 401 &&
      (response.statusText === "Expired Token" ||
        response.statusText === "Token validation failed" ||
        response.statusText === "Session not found")
    ) {
      openModal();
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

const streamResponseToObserver = async (
  response: Response,
  observer: StreamingAdapterObserver
) => {
  if (!response.body) {
    observer.error(new Error("Response body not present"));
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    let boundary;
    while ((boundary = buffer.indexOf("}{")) !== -1) {
      const jsonString = buffer.substring(0, boundary + 1).trim();
      buffer = buffer.slice(boundary + 1);

      try {
        const chunk = JSON.parse(jsonString);
        if (
          chunk.choices &&
          chunk.choices[0] &&
          chunk.choices[0].delta &&
          chunk.choices[0].delta.content
        ) {
          observer.next(chunk.choices[0].delta.content);
        }
      } catch (e) {
        observer.error(new Error("Error while processing chunks"));
      }
    }
  }

  if (buffer.length > 0) {
    try {
      const chunk = JSON.parse(buffer.trim());
      if (
        chunk.choices &&
        chunk.choices[0] &&
        chunk.choices[0].delta &&
        chunk.choices[0].delta.content
      ) {
        observer.next(chunk.choices[0].delta.content);
      }
    } catch (e) {
      observer.error(new Error("Error while processing final chunk"));
    }
  }

  observer.complete();
};

export const createAdapter = ({
  apiUrl = COMPLETIONS_URL,
  model = DEFAULT_MODEL,
  applicationId,
  sessionId,
  idToken,
  accessToken,
  openModal,
}: AdapterConfig) => {
  if (!applicationId) {
    throw new Error("Application ID is required.");
  }

  const headers = getHeaders(applicationId, idToken, accessToken, sessionId);
  const memory: Message[] = [];

  const batchText = async (
    message: string,
    systemPrompt: string,
    useMemory = true,
  ): Promise<string> => {
    let messages = [];
    const msgObj = { role: "user", content: message };

    if (useMemory) {
      memory.push(msgObj);
      messages = memory;
    } else {
      if (systemPrompt) {
        messages.push({ role: "system", content: systemPrompt });
      }
      messages.push(msgObj);
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        messages,
        model,
      }),
    });

    verifyResponse(response, openModal);

    const responseJson = await response.json();
    const { content } = responseJson.choices[0].message;
    if (useMemory) {
      memory.push({ role: "assistant", content });
    }
    return content;
  };

  const streamText = async (
    message: string,
    observer: StreamingAdapterObserver,
    systemPrompt: string,
    useMemory = true
  ): Promise<void> => {
    let messages = [];
    const msgObj = { role: "user", content: message };

    if (useMemory) {
      memory.push(msgObj);
      messages = memory;
    } else {
      if (systemPrompt) {
        messages.push({ role: "system", content: systemPrompt });
      }
      messages.push(msgObj);
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        messages,
        model,
        stream: true,
      }),
    });

    verifyResponse(response, openModal);
    await streamResponseToObserver(response, observer);
  };

  return { batchText, streamText };
};
