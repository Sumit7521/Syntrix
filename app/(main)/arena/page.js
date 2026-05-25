import ModelArena from "@/components/predict/ModelArena";

export const metadata = {
  title: "Model Arena | SyntriX",
  description: "Race 9 Machine Learning models concurrently to benchmark accuracy and latency.",
};

export default function ArenaPage() {
  return <ModelArena />;
}
