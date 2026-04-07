import QuantityPage from "./QuantityPage";

function Length() {
  return (
    <QuantityPage
      title="Length"
      measurementType="LengthUnit"
      units={["FEET", "INCHES", "YARDS", "CENTIMETERS"]}
    />
  );
}

export default Length;