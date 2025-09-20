const roommates = [
  { name: "Rahul", msg: "Looking for 1 roommate in Wakad PG. Rent 6k." },
  { name: "Priya", msg: "Need 2 flatmates in Kothrud. Rent 10k per head." },
];

export default function Roommates() {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Roommate Finder</h1>
      {roommates.map((r, i) => (
        <div key={i} className="border rounded p-4 mb-4 shadow">
          <h2 className="font-semibold">{r.name}</h2>
          <p className="text-gray-700">{r.msg}</p>
        </div>
      ))}
    </main>
  );
}
