import cn from "~/lib/cn";

export type RadioProps = {
  active?: boolean;
};

export default function Radio({ active }: RadioProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center w-5 h-5 border border-zinc-200 rounded-full transition-colors",
        active ? "border-black" : "group-hover:border-zinc-400"
      )}
    >
      <div
        className={cn(
          "w-3 h-3 bg-transparent rounded-full transition-colors",
          active && "bg-black"
        )}
      ></div>
    </div>
  );
}
