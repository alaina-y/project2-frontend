// StatCard — displays a single metric
// Props: title (string), value (string|number), subtitle (string), color ('blue'|'green'|'orange'|'purple')

const colorMap = {
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-200',  icon: 'bg-blue-500',   text: 'text-blue-700'   },
  green:  { bg: 'bg-green-50',  border: 'border-green-200', icon: 'bg-green-500',  text: 'text-green-700'  },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200',icon: 'bg-orange-500', text: 'text-orange-700' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200',icon: 'bg-purple-500', text: 'text-purple-700' },
};

export default function StatCard({ title, value, subtitle, color = 'blue' }) {
  const c = colorMap[color] || colorMap.blue;
  return (
    <div className={`rounded-lg border ${c.border} ${c.bg} p-5 shadow-sm`}>
      <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
      <p className={`mt-1 text-3xl font-bold ${c.text}`}>{value}</p>
      {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
    </div>
  );
}
