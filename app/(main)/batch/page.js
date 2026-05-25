import BatchPredict from "@/components/predict/BatchPredict";

export const metadata = {
  title: "Batch Analysis | SyntriX",
  description: "Upload and analyze bulk CSV network traffic data using Hybrid Machine Learning models.",
};

export default function BatchPredictPage() {
  return <BatchPredict />;
}
