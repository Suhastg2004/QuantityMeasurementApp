import QuantityPage from "./QuantityPage";

function Volume() {
  return (
    <QuantityPage
      title="Volume"
      measurementType="VolumeUnit"
      units={["LITRE", "MILLILITER", "GALLON"]}
    />
  );
}

export default Volume;