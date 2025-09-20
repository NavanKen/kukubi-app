interface Transaction {
  id: string;
  type: "order" | "payment";
  title: string;
  description: string;
  amount: string;
  date: string;
  status: "completed" | "pending" | "cancelled";
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "order",
    title: "Siomay Ayam",
    description: "2x Siomay Ayam + Saus Kacang",
    amount: "Rp 25.000",
    date: "Hari ini, 14:30",
    status: "completed",
  },
  {
    id: "2",
    type: "order",
    title: "Hakao Udang",
    description: "4x Hakao Udang Premium",
    amount: "Rp 45.000",
    date: "Kemarin, 19:15",
    status: "completed",
  },
  {
    id: "3",
    type: "order",
    title: "Lumpia Shanghai",
    description: "3x Lumpia Shanghai + Saus Asam Manis",
    amount: "Rp 30.000",
    date: "2 hari lalu, 12:45",
    status: "completed",
  },
  {
    id: "4",
    type: "order",
    title: "Pangsit Rebus",
    description: "1x Pangsit Rebus Kuah Kaldu",
    amount: "Rp 18.000",
    date: "3 hari lalu, 20:00",
    status: "pending",
  },
];

const RecentTransactions = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Transaksi Terakhir
        </h3>
        <button className="text-orange-600 text-sm font-medium hover:text-orange-700 transition-colors">
          Lihat Semua
        </button>
      </div>

      <div className="space-y-4">
        {mockTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 truncate">
                  {transaction.title}
                </h4>
                <span className="text-gray-900 font-semibold">
                  {transaction.amount}
                </span>
              </div>
              <p className="text-sm text-gray-500 truncate">
                {transaction.description}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-gray-400">{transaction.date}</p>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    transaction.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : transaction.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {transaction.status === "completed"
                    ? "Selesai"
                    : transaction.status === "pending"
                    ? "Menunggu"
                    : "Dibatalkan"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
