export default function PromoBanner() {
  return (
    <div className="rounded-xl bg-indigo-50 p-6 border">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <div className="font-semibold">Free shipping plus 5% rewards</div>
          <div className="text-sm text-gray-600">Savings that really add up.</div>
        </div>
        <button className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">
          Start free trial
        </button>
      </div>
    </div>
  );
}
