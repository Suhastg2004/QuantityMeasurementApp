import QuantityPage from "./QuantityPage";

function Weight() {
  return (
    <QuantityPage
      title="Weight"
      measurementType="WeightUnit"
      units={["MILLIGRAM", "GRAM", "KILOGRAM", "POUND", "TONNE"]}
    />
  );
}

export default Weight;