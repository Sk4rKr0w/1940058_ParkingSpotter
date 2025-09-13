import { useEffect, useState } from "react";

const Tickets = () => {
    const [tickets, setTickets] = useState([]);
    const [stats, setStats] = useState({ totalTickets: 0, todayTickets: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetching Tickets
    const fetchTickets = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:4003/tickets", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch tickets");
            const data = await res.json();
            setTickets(data);
        } catch (err) {
            setError(err.message);
        }
    };

    // Fetching Stats
    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:4003/tickets/stats", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch stats");
            const data = await res.json();
            setStats(data);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchTickets(), fetchStats()]);
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error)
        return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <h1 className="text-4xl font-extrabold mb-8 text-center text-orange-500">
                Tickets Management
            </h1>

            <div className="mb-8 flex justify-center gap-8">
                <div className="bg-gray-800 text-white px-6 py-4 rounded-lg shadow-md flex flex-col items-center">
                    <span className="text-gray-400 text-sm">Total Tickets</span>
                    <span className="text-xl font-bold text-blue-400">
                        {stats.totalTickets}
                    </span>
                </div>
                <div className="bg-gray-800 text-white px-6 py-4 rounded-lg shadow-md flex flex-col items-center">
                    <span className="text-gray-400 text-sm">
                        Today's Tickets
                    </span>
                    <span className="text-xl font-bold text-orange-400">
                        {stats.todayTickets}
                    </span>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tickets.map((ticket) => (
                    <div
                        key={ticket.id}
                        className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-white p-5 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                    >
                        <p>
                            <strong className="text-orange-400">Name:</strong>{" "}
                            {ticket.name}
                        </p>
                        <p>
                            <strong className="text-blue-400">Email:</strong>{" "}
                            {ticket.email}
                        </p>
                        <p className="overflow-y-auto min-h-32 max-h-32">
                            <strong className="text-gray-300">Message:</strong>{" "}
                            {ticket.message}
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                            Created At:{" "}
                            {new Date(ticket.createdAt).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tickets;
