"use client";

import { useEffect, useRef, useState } from "react";
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
  quickReplies?: string[];
  skippable?: boolean;
}

interface ChatAssistantProps {
  locale: Locale;
  userName: string;
  onAnswer: (field: ProfileField, value: string) => void;
  onProgressChange: (current: number, total: number) => void;
  onFinished: () => void;
}

function createMessage(sender: Message["sender"], text: string, options?: Pick<Message, "quickReplies" | "skippable">): Message {
  return {
    id: `${sender}-${Date.now()}-${Math.random()}`,
    sender,
    text,
    quickReplies: options?.quickReplies,
    skippable: options?.skippable,
  };
}

function localizeQuickReplies(values: string[] | undefined, locale: Locale) {
  return values?.map((value) => quickReplyLabels[value]?.[locale] ?? value);
}

export function ChatAssistant({
  locale,
  userName,
  onAnswer,
  onProgressChange,
  onFinished,
}: ChatAssistantProps) {
  const text = copy[locale];
  const welcomeText = text.chatWelcome.replace("{name}", userName);
  const [messages, setMessages] = useState<Message[]>(() => [createMessage("bot", welcomeText)]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [conversationDone, setConversationDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const firstStep = onboardingSteps[0];

    onProgressChange(0, onboardingSteps.length);

    const timeoutId = window.setTimeout(() => {
      setIsTyping(false);
      setMessages([
        createMessage("bot", welcomeText),
        createMessage("bot", firstStep.prompts[locale], {
          quickReplies: localizeQuickReplies(firstStep.quickReplies?.en, locale),
          skippable: firstStep.skippable,
        }),
      ]);
    }, 700);

    return () => window.clearTimeout(timeoutId);
  }, [locale, onProgressChange, userName, welcomeText]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function queueNextStep(nextIndex: number) {
    const nextStep = onboardingSteps[nextIndex];

    if (!nextStep) {
      setConversationDone(true);
      setIsTyping(true);
      onProgressChange(onboardingSteps.length, onboardingSteps.length);

      window.setTimeout(() => {
        setIsTyping(false);
        setMessages((existing) => [...existing, createMessage("bot", text.chatDone)]);
        onFinished();
      }, 700);
      return;
    }

    setIsTyping(true);
    window.setTimeout(() => {
      setIsTyping(false);
      setCurrentStepIndex(nextIndex);
      setMessages((existing) => [
        ...existing,
        createMessage("bot", nextStep.prompts[locale], {
          quickReplies: localizeQuickReplies(nextStep.quickReplies?.en, locale),
          skippable: nextStep.skippable,
        }),
      ]);
      onProgressChange(nextIndex, onboardingSteps.length);
    }, 700);
  }

  function submitAnswer(answer: string) {
    const step = onboardingSteps[currentStepIndex];

    if (!step || !answer.trim() || conversationDone || isTyping) {
      return;
    }

    setMessages((existing) => [...existing, createMessage("user", answer.trim())]);
    onAnswer(step.key, answer.trim());
    setInputValue("");
    queueNextStep(currentStepIndex + 1);
  }

  function skipCurrentStep() {
    const step = onboardingSteps[currentStepIndex];

    if (!step?.skippable || conversationDone || isTyping) {
      return;
    }

    setMessages((existing) => [...existing, createMessage("user", text.chatSkipped)]);
    queueNextStep(currentStepIndex + 1);
  }

  const lastBotMessage = [...messages].reverse().find((message) => message.sender === "bot");

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex items-center gap-3 border-b border-border bg-card px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Compass className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm text-foreground">{text.chatTitle}</h3>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">{text.chatActive}</span>
          </div>
        </div>
        <div className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
          {Math.min(currentStepIndex + 1, onboardingSteps.length)}/{onboardingSteps.length}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex max-w-[85%] gap-2 ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
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

          {lastBotMessage?.quickReplies && !conversationDone && lastBotMessage === messages[messages.length - 1] ? (
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
