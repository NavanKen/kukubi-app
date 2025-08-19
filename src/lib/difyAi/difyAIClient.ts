import axios from "axios";

export async function sendMessageToDify(
  message: string,
  conversationId?: string
) {
  try {
    const res = await axios.post(
      process.env.NEXT_PUBLIC_DIFY_API_URL!,
      {
        inputs: {},
        query: message,
        conversation_id: conversationId || null,
        user: "kukubi-customer",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DIFY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Dify API error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw new Error("Gagal terhubung ke Dify API");
  }
}
