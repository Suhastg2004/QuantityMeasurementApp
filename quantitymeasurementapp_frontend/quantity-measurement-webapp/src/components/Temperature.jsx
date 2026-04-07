import QuantityPage from "./QuantityPage";

function Temperature() {
  return (
    <QuantityPage
      title="Temperature"
      measurementType="TemperatureUnit"
      units={["CELSIUS", "FAHRENHEIT"]}
    />
  );
}

export default Temperature;