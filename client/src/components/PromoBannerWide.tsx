export default function PromoBannerWide() {
  return (
    <div className="rounded-xl overflow-hidden border bg-gradient-to-r from-blue-600 to-indigo-600">
      <div className="p-4 md:p-6 text-white flex items-center justify-between gap-4">
        <div>
          <div className="text-xl font-semibold">40% off</div>
          <div className="text-sm opacity-90">on your first Autoship order of select in-line prevention meds.</div>
        </div>
        <button className="px-4 py-2 rounded bg-white text-blue-700 font-medium hover:opacity-90">Shop now</button>
      </div>
    </div>
  );
}
