export default function Spinner({ fullScreen = false }) {
  return (
    <div
      className={`${
        fullScreen
          ? "fixed inset-0 flex items-center justify-center bg-base-100/70 backdrop-blur-sm z-50"
          : "min-h-[40vh] grid place-items-center"
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        {/* DaisyUI spinner */}
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-sm text-base-content/70 font-medium tracking-wide">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
}
