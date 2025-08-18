import type React from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

interface ChatCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  status: {
    type: "online" | "offline";
    text: string;
  };
  avatarBg: string;
}

const ChatCard = ({
  href,
  icon,
  title,
  subtitle,
  status,
  avatarBg,
}: ChatCardProps) => {
  return (
    <>
      <div className="border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-md transition-all duration-200">
        <div className="p-6">
          <Link href={href} className="block">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div
                    className={`w-12 h-12 ${avatarBg} rounded-full flex items-center justify-center`}
                  >
                    {icon}
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 ${
                      status.type === "online" ? "bg-green-500" : "bg-gray-400"
                    } rounded-full border-2 border-white`}
                  ></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-600">{subtitle}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {status.type === "online" && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                    <span
                      className={`text-xs font-medium ${
                        status.type === "online"
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {status.text}
                    </span>
                  </div>
                </div>
              </div>
              <MessageCircle className="h-5 w-5 text-gray-400" />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};
export default ChatCard;
