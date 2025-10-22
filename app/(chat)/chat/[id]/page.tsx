import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/app/(auth)/auth";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { getChatById, getMessagesByChatId } from "@/lib/db/queries";
import { convertToUIMessages } from "@/lib/utils";
import ChatLayout from "./ChatClient"; 

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  //  fetch chat and messages
  const chat = await getChatById({ id });
  if (!chat) notFound();

  const session = await auth();
  if (!session) redirect("/api/auth/guest");

  if (chat.visibility === "private") {
    if (!session.user || session.user.id !== chat.userId) notFound();
  }

  const messagesFromDb = await getMessagesByChatId({ id });
  const uiMessages = convertToUIMessages(messagesFromDb);

  const cookieStore = await cookies();
  const chatModelFromCookie = cookieStore.get("chat-model");
  const selectedModel = chatModelFromCookie?.value || DEFAULT_CHAT_MODEL;

  // pass data to client layout
  return (
    <ChatLayout
      chat={chat}
      uiMessages={uiMessages}
      model={selectedModel}
      session={session}
    />
  );
}

