type Props = {
  value: 'all'|'completed'|'pending';
  onChange: (v: 'all'|'completed'|'pending') => void;
};
export default function TaskFilter({ value, onChange }: Props) {
  return (
    <div className="filters">
      {(['all','completed','pending'] as const).map(v=>(
        <button key={v} className={value===v?'active':''} onClick={()=>onChange(v)}>{v}</button>
      ))}
    </div>
  );
}
