export function Topbar({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="text-sm text-slate-500">
          Manage your real estate operations efficiently
        </p>
      </div>
    </div>
  );
}