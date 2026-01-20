interface Props {
  title: string;
  color?: string;
  children?: React.ReactNode;
}

export default function Panel({ title, color = "cyan", children }: Props) {
  return (
    <div className={`panel ${color}`}>
      <div className="panel-gradient" />
      <div className="panel-content">
        <h3 className="panel-title">{title}</h3>
        <div className="panel-body">
          {children || <span className="no-data">[ NO DATA ]</span>}
        </div>
      </div>
      <div className="scan-line" />
    </div>
  );
}