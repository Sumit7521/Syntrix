
import AccuracyBar from "@/components/Charts/AccuracyBar";
import { F1Line } from "@/components/Charts/F1Line";
import { PrecisionLine } from "@/components/Charts/PrecisionLine";
import { RecallLine } from "@/components/Charts/RecallLine";

export default function ModelsPage() {
  return (
    <>
      <AccuracyBar />
      <PrecisionLine />
      <RecallLine />
      <F1Line />
    </>
  );
}
