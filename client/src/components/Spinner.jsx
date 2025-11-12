export default function Spinner({ fullScreen = false }) {
  return (
    <div className={`${fullScreen ? "fixed inset-0 z-50 bg-base-100/70 backdrop-blur-sm" : "min-h-[40vh]"} grid place-items-center`}>
      <div className="flex flex-col items-center gap-3">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-sm text-base-content/70">Loading, please wait...</p>
      </div>
    </div>
  );
}
