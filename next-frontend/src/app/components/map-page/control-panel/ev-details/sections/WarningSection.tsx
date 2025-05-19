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

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const { data } = await axios.get<ErrorState>("/api/warnings");
        console.log(data)
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
    </div>
  );
}
