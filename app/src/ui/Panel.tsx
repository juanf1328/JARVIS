interface Props {
  title: string;
  color?: string;
  children?: React.ReactNode;
  identity?: string;
}

const IDENTITY_COLORS: Record<string, string> = {
  jarvis: "cyan",
  zero: "purple",
  alfred: "pink",
  horus: "yellow",
};

export default function Panel({ title, color, children, identity = "jarvis" }: Props) {
  const finalColor = color || IDENTITY_COLORS[identity] || "cyan";
  const isHorus = identity === "horus";

  return (
    <div className={`panel ${finalColor} ${isHorus ? "horus-panel" : ""}`}>
      <div className="panel-gradient" />
      <div className="panel-content">
        <h3 className={`panel-title ${isHorus ? "horus-text" : ""}`}>
          {isHorus && "⟨ "}
          {title}
          {isHorus && " ⟩"}
        </h3>
        <div className="panel-body">
          {children || <span className="no-data">[ NO DATA ]</span>}
        </div>
      </div>
      <div className={`scan-line ${isHorus ? "horus-scan" : ""}`} />
    </div>
  );
}