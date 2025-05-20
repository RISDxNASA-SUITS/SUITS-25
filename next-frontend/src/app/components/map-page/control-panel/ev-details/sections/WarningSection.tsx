import WarningCard from "@/app/components/ui/Cards/WarningCard";
import { useEffect, useState } from "react";
import axios from "axios";

interface ErrorState {
  fan_error: ErrorItem;
  oxy_error: ErrorItem;
  pump_error: ErrorItem;

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
  });

  const [battery, setBattery] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const { data } = await axios.get<ErrorState>("/api/warnings");
        
        if (isMounted) {
          setWarnings(data);
        }

        
      } catch (err) {
        console.error("Failed to fetch warnings:", err);
        if (isMounted) {
          setError("Unable to load warnings");
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
    const fetchBattery = async () => {
      const data = await fetch('/api/warning-stats');
      const res = await data.json();
      setBattery(res.batteryLevel);
    };
    fetchBattery();
    const interval = setInterval(fetchBattery, 1000);
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
        <p>No warnings</p>
      )}
      {battery < 99 && (
        <WarningCard warningName="Battery Failure" description = "Abort now: Point of No Return" />
      )}
    </div>
  );
}
