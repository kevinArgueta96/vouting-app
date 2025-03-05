'use client';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: string;
}

export function StatCard({ title, value, subtitle, icon }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-500">{title}</h3>
          <p className="mt-2 text-3xl font-semibold text-[#334798]">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="text-3xl">{icon}</div>
        )}
      </div>
    </div>
  );
}
