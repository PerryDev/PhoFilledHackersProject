// apps/student-onboarding/src/components/student-onboarding/chat-assistant.tsx
// Chatbot intake UI for the onboarding workspace.
// Keeps the assistant surface visible while persisting canonical intake state upstream.
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Compass, Send, SkipForward } from "lucide-react";

import {
  copy,
  onboardingSteps,
  quickReplyLabels,
  type Locale,
  type ProfileField,
} from "@/lib/onboarding-data";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  createdAt: string;
  quickReplies?: string[];
  skippable?: boolean;
}

interface PersistedIntakeState {
  currentStepIndex: number;
  conversationDone: boolean;
  messages: Array<{
    id: string;
    role: "assistant" | "student";
    text: string;
    createdAt: string;
  }>;
}

interface ChatAssistantProps {
  locale: Locale;
  userName: string;
  initialState?: PersistedIntakeState | null;
  onAnswer: (field: ProfileField, value: string) => void;
  onPersist: (state: PersistedIntakeState) => Promise<void> | void;
  onProgressChange: (current: number, total: number) => void;
  onFinished: () => void;
}

function createMessage(
  sender: Message["sender"],
  text: string,
): Message {
  return {
    id: `${sender}-${Date.now()}-${Math.random()}`,
    sender,
    text,
    createdAt: new Date().toISOString(),
  };
}

function localizeQuickReplies(values: string[] | undefined, locale: Locale) {
  return values?.map((value) => quickReplyLabels[value]?.[locale] ?? value);
}

function hydrateMessage(message: PersistedIntakeState["messages"][number]): Message {
  return {
    id: message.id,
    sender: message.role === "assistant" ? "bot" : "user",
    text: message.text,
    createdAt: message.createdAt,
  };
}

function toPersistedState(
  messages: Message[],
  currentStepIndex: number,
  conversationDone: boolean,
): PersistedIntakeState {
  return {
    currentStepIndex,
    conversationDone,
    messages: messages.map((message) => ({
      id: message.id,
      role: message.sender === "bot" ? "assistant" : "student",
      text: message.text,
      createdAt: message.createdAt,
    })),
  };
}

export function ChatAssistant({
  locale,
  userName,
  initialState = null,
  onAnswer,
  onPersist,
  onProgressChange,
  onFinished,
}: ChatAssistantProps) {
  const text = copy[locale];
  const welcomeText = text.chatWelcome.replace("{name}", userName);
  const [messages, setMessages] = useState<Message[]>(
    initialState?.messages.map(hydrateMessage) ?? [],
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(
    initialState?.currentStepIndex ?? 0,
  );
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(!initialState?.messages.length);
  const [conversationDone, setConversationDone] = useState(
    initialState?.conversationDone ?? false,
  );
  const bottomRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(initialState?.messages.length ? true : false);

  useEffect(() => {
    if (initializedRef.current) {
      onProgressChange(
        conversationDone ? onboardingSteps.length : currentStepIndex,
        onboardingSteps.length,
      );
      return;
    }

    const firstStep = onboardingSteps[0];
    const timeoutId = window.setTimeout(() => {
      const nextMessages = [
        createMessage("bot", welcomeText),
        createMessage("bot", firstStep.prompts[locale]),
      ];

      initializedRef.current = true;
      setIsTyping(false);
      setMessages(nextMessages);
      onProgressChange(0, onboardingSteps.length);
      void onPersist(toPersistedState(nextMessages, 0, false));
    }, 700);

    return () => window.clearTimeout(timeoutId);
  }, [
    conversationDone,
    currentStepIndex,
    locale,
    onPersist,
    onProgressChange,
    welcomeText,
  ]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const renderedMessages = useMemo(() => {
    return messages.map((message, index) => {
      const isLastMessage = index === messages.length - 1;
      if (
        !isLastMessage ||
        message.sender !== "bot" ||
        conversationDone ||
        !onboardingSteps[currentStepIndex]
      ) {
        return message;
      }

      return {
        ...message,
        quickReplies: localizeQuickReplies(
          onboardingSteps[currentStepIndex]?.quickReplies?.en,
          locale,
        ),
        skippable: onboardingSteps[currentStepIndex]?.skippable,
      };
    });
  }, [conversationDone, currentStepIndex, locale, messages]);

  function persistState(
    nextMessages: Message[],
    nextStepIndex: number,
    nextConversationDone: boolean,
  ) {
    void onPersist(
      toPersistedState(nextMessages, nextStepIndex, nextConversationDone),
    );
  }

  function queueNextStep(nextIndex: number, existingMessages: Message[]) {
    const nextStep = onboardingSteps[nextIndex];

    if (!nextStep) {
      setConversationDone(true);
      setIsTyping(true);
      onProgressChange(onboardingSteps.length, onboardingSteps.length);

      window.setTimeout(() => {
        const nextMessages = [
          ...existingMessages,
          createMessage("bot", text.chatDone),
        ];
        setIsTyping(false);
        setMessages(nextMessages);
        persistState(nextMessages, onboardingSteps.length, true);
        onFinished();
      }, 700);
      return;
    }

    setIsTyping(true);
    window.setTimeout(() => {
      const nextMessages = [
        ...existingMessages,
        createMessage("bot", nextStep.prompts[locale]),
      ];
      setIsTyping(false);
      setCurrentStepIndex(nextIndex);
      setMessages(nextMessages);
      onProgressChange(nextIndex, onboardingSteps.length);
      persistState(nextMessages, nextIndex, false);
    }, 700);
  }

  function submitAnswer(answer: string) {
    const step = onboardingSteps[currentStepIndex];

    if (!step || !answer.trim() || conversationDone || isTyping) {
      return;
    }

    const nextMessages = [
      ...messages,
      createMessage("user", answer.trim()),
    ];
    setMessages(nextMessages);
    onAnswer(step.key, answer.trim());
    setInputValue("");
    persistState(nextMessages, currentStepIndex, false);
    queueNextStep(currentStepIndex + 1, nextMessages);
  }

  function skipCurrentStep() {
    const step = onboardingSteps[currentStepIndex];

    if (!step?.skippable || conversationDone || isTyping) {
      return;
    }

    const nextMessages = [...messages, createMessage("user", text.chatSkipped)];
    setMessages(nextMessages);
    persistState(nextMessages, currentStepIndex, false);
    queueNextStep(currentStepIndex + 1, nextMessages);
  }

  const lastBotMessage = [...renderedMessages]
    .reverse()
    .find((message) => message.sender === "bot");

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex items-center gap-3 border-b border-border bg-card px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Compass className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm text-foreground">{text.chatTitle}</h3>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-xs text-muted-foreground">{text.chatActive}</span>
          </div>
        </div>
        <div className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
          {Math.min(currentStepIndex + 1, onboardingSteps.length)}/{onboardingSteps.length}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 p-4">
          {renderedMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex max-w-[85%] gap-2 ${
                  message.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {message.sender === "bot" ? (
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                ) : null}
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm ${
                    message.sender === "user"
                      ? "rounded-br-md bg-primary text-primary-foreground"
                      : "rounded-bl-md bg-muted text-foreground"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            </div>
          ))}

          {lastBotMessage?.quickReplies &&
          !conversationDone &&
          lastBotMessage === renderedMessages[renderedMessages.length - 1] ? (
            <div className="flex flex-wrap gap-2 pl-9">
              {lastBotMessage.quickReplies.map((reply) => (
                <button
                  type="button"
                  key={reply}
                  onClick={() => submitAnswer(reply)}
                  className="cursor-pointer rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {reply}
                </button>
              ))}
            </div>
          ) : null}

          {isTyping ? (
            <div className="flex items-center gap-2 pl-9">
              <div className="flex gap-1 rounded-2xl rounded-bl-md bg-muted px-4 py-3">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:300ms]" />
              </div>
            </div>
          ) : null}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t border-border bg-card p-3">
        <form
          className="flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            submitAnswer(inputValue);
          }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder={conversationDone ? text.chatComplete : text.chatPlaceholder}
            disabled={conversationDone || isTyping}
            className="flex-1 rounded-lg bg-[var(--input-background)] px-4 py-2.5 text-sm outline-none disabled:opacity-50"
          />
          {onboardingSteps[currentStepIndex]?.skippable && !conversationDone ? (
            <button
              type="button"
              onClick={skipCurrentStep}
              className="flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-xs text-muted-foreground transition hover:bg-muted/50 hover:text-foreground"
            >
              <SkipForward className="h-3.5 w-3.5" />
              {text.chatSkip}
            </button>
          ) : null}
          <button
            type="submit"
            disabled={!inputValue.trim() || conversationDone || isTyping}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
