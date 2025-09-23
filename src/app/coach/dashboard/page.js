export default function DashboardHome() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="p-6 bg-white rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-2">Total Earnings</h3>
        <p className="text-2xl font-bold">$1,250</p>
      </div>
      <div className="p-6 bg-white rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-2">Upcoming Bookings</h3>
        <p className="text-2xl font-bold">3</p>
      </div>
      <div className="p-6 bg-white rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-2">Next Payout</h3>
        <p className="text-2xl font-bold">Sept 15</p>
      </div>
    </div>
  );
}
