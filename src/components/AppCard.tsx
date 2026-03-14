type AppCardProps = {
  title: string;
  description: string;
  onClick: () => void;
};

export default function AppCard({ title, description, onClick }: AppCardProps) {
  return (
    <button className="app-card" onClick={onClick}>
      <div className="app-card-top">
        <div className="app-card-icon">◼</div>
        <div className="app-card-arrow">→</div>
      </div>

      <h2>{title}</h2>
      <p>{description}</p>
    </button>
  );
}
