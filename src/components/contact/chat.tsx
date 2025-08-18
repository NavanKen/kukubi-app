import { User, Bot } from "lucide-react";
import ChatCard from "./ui/chat_card";

const Chat = () => {
  return (
    <>
      <div className="space-y-8 bg-white rounded-2xl p-8 shadow-lg">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Chat Langsung
          </h2>
          <p className="text-gray-600 mb-6">
            Butuh bantuan cepat? Chat langsung dengan tim kami untuk mendapatkan
            respon yang lebih cepat.
          </p>

          <div className="space-y-4">
            <ChatCard
              href="/message?type=ai"
              icon={<Bot className="h-6 w-6 text-orange-500" />}
              title="Kukubi Assistant"
              subtitle="Asisten AI siap membantu Anda kapan saja"
              status={{ type: "online", text: "Online" }}
              avatarBg="bg-orange-100"
            />

            <ChatCard
              href="/message?type=dev1"
              icon={<User className="h-6 w-6 text-blue-500" />}
              title="Naufal Afandi"
              subtitle="Lead Developer"
              status={{
                type: "offline",
                text: "Terakhir dilihat 2 jam yang lalu",
              }}
              avatarBg="bg-blue-100"
            />
            <ChatCard
              href="/message?type=dev2"
              icon={<User className="h-6 w-6 text-purple-500" />}
              title="Amru Savero"
              subtitle="Frontend Developer"
              status={{
                type: "offline",
                text: "Terakhir dilihat 5 jam yang lalu",
              }}
              avatarBg="bg-purple-100"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
