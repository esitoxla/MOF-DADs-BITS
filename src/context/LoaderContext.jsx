import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import Loader from "../components/ui/Loader";

const LoaderContext = createContext(null);

export function LoaderProvider({ children }) {
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState("Loading...");
  const countRef = useRef(0);

  const showLoader = useCallback((nextLabel) => {
    countRef.current += 1;
    if (typeof nextLabel === "string") {
      setLabel(nextLabel);
    } else if (countRef.current === 1) {
      setLabel("Loading...");
    }
    setVisible(true);
  }, []);

  const hideLoader = useCallback(() => {
    countRef.current = Math.max(0, countRef.current - 1);
    if (countRef.current === 0) {
      setVisible(false);
      setLabel("Loading...");
    }
  }, []);

  const value = useMemo(
    () => ({ showLoader, hideLoader }),
    [showLoader, hideLoader]
  );

  return (
    <LoaderContext.Provider value={value}>
      {children}
      {visible && <Loader fullScreen size={40} label={label} />}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  const ctx = useContext(LoaderContext);
  if (!ctx) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return ctx;
}
