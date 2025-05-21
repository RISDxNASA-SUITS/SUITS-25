import WarningCard from "@/app/components/ui/Cards/WarningCard";
import { useEffect, useState } from "react";
import axios from "axios";


const coolantLimit = 40
const batteryLimit = 30
const oxygenLimit = 25
interface ErrorState {
  fan_error: ErrorItem;
  oxy_error: ErrorItem;
  pump_error: ErrorItem;
  power_error: ErrorItem;

}

interface ErrorItem {
  isErr: boolean;
  desc: string;
  name: string;
}

export default function WarningSection() {
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<ErrorState>({
    fan_error: { isErr: false, desc: "", name: "" },
    oxy_error: { isErr: false, desc: "", name: "" },
    pump_error: { isErr: false, desc: "", name: "" },
    power_error : {isErr : false, desc: "", name: ""}
  });

  const [battery, setBattery] = useState<number>(100);
  const [coolant, setCoolant] = useState<number>(100);
  const [oxygen, setOxygen] = useState<number>(100);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const { data } = await axios.get<ErrorState>("/api/warnings");
        if (isMounted) {
          setWarnings(data);
        }

        
      } catch (err) {
        console.error("Failed to fetch system failures:", err);
        if (isMounted) {
          setError("Unable to load system failures");
        }
      }
    };
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => {
      clearInterval(interval);
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const fetchWarnings = async () => {
      const data = await fetch('/api/warning-stats');
      const res = await data.json();
      setBattery(res["batteryLevel"])
      setCoolant(res["prCoolantLevel"])
      setOxygen(res["oxygenLevels"])
    };
    fetchWarnings();
    const interval = setInterval(fetchWarnings, 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Convert the object into an array of only the active errors:
  const activeWarnings = Object.values(warnings)
    .filter((item) => item.isErr)
    .map((item) => ({
      message: item.name,
      description: item.desc,
    }));

  return (
    <div>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : activeWarnings.length > 0 ? (
        activeWarnings.map((w, idx) => (
          <div key={w.message}>
            <WarningCard warningName={w.message} description={w.description} />
            {idx < activeWarnings.length - 1 && <hr />}
          </div>
        ))
      ) : (
        <p>No System Failures</p>
      )}
      <hr className = "m-2" />
      {battery < batteryLimit && (
        <WarningCard warningName="Battery Level Low" description = "Abort now: Point of no Return" />
      )}
      {coolant < coolantLimit && (
        <WarningCard warningName="Coolant Level Low" description = "Abort now: Point of no Return" />
      )}
      {oxygen < oxygenLimit && (
        <WarningCard warningName="Oxygen Level Low" description = "Abort now: Point of no Return" />
      )}
    </div>
  );
}
