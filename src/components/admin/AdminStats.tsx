'use client';

import React from 'react';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Utensils, 
  Bus, 
  Home, 
  Music
} from 'lucide-react';

interface AdminStatsType {
    total: number;
    attending: number;
    notAttending: number;
    pending: number;
    menu: {
        meat: number;
        fish: number;
        vegetarian: number;
        kids: number;
        none: number;
    };
    alcohol: {
        wine: number;
        champagne: number;
        spirits: number;
        none: number;
    };
    logistics: {
        transferNeeded: number;
        accommodationNeeded: number;
    };
    music: string[];
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  subValue?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, subValue }) => (
  <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/20 hover:shadow-md transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
        {icon}
      </div>
      {subValue && (
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{subValue}</span>
      )}
    </div>
    <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
    <p className="text-3xl font-bold text-charcoal">{value}</p>
  </div>
);

interface ProgressBarProps {
  label: string;
  value: number;
  total: number;
  color: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, total, color }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium text-charcoal">{label}</span>
        <span className="text-sm font-semibold text-charcoal">{value} <span className="text-muted-foreground font-normal">({percentage.toFixed(1)}%)</span></span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div 
          className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

interface AdminStatsProps {
  stats: AdminStatsType;
}

export default function AdminStats({ stats }: AdminStatsProps) {
  if (!stats) return null;

  return (
    <div className="space-y-8">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Записано" 
          value={stats.total} 
          icon={<Users size={24} />} 
          color="bg-blue-500" 
          subValue="Всего"
        />
        <StatCard 
          title="Подтвердили" 
          value={stats.attending} 
          icon={<CheckCircle size={24} />} 
          color="bg-green-500" 
          subValue="Придут"
        />
        <StatCard 
          title="Отказались" 
          value={stats.notAttending} 
          icon={<XCircle size={24} />} 
          color="bg-rose-500" 
          subValue="Не придут"
        />
        <StatCard 
          title="В ожидании" 
          value={stats.pending} 
          icon={<Clock size={24} />} 
          color="bg-amber-500" 
          subValue="Не ответили"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Menu & Drinks Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-white/20">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-blush/20 rounded-xl text-blush">
              <Utensils size={22} />
            </div>
            <h2 className="text-xl font-bold text-charcoal">Меню и Напитки</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-10">
            <div>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">Выбор блюда</h3>
              <ProgressBar label="Мясное" value={stats.menu.meat} total={stats.attending} color="bg-rose-400" />
              <ProgressBar label="Рыбное" value={stats.menu.fish} total={stats.attending} color="bg-blue-400" />
              <ProgressBar label="Вегетарианское" value={stats.menu.vegetarian} total={stats.attending} color="bg-sage" />
              <ProgressBar label="Детское" value={stats.menu.kids} total={stats.attending} color="bg-amber-400" />
            </div>
            
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6 mt-2">Предпочтения по алкоголю</h3>
              <ProgressBar label="Вино" value={stats.alcohol.wine} total={stats.attending} color="bg-purple-400" />
              <ProgressBar label="Шампанское" value={stats.alcohol.champagne} total={stats.attending} color="bg-yellow-300" />
              <ProgressBar label="Крепкие напитки" value={stats.alcohol.spirits} total={stats.attending} color="bg-orange-400" />
              <ProgressBar label="Не пью" value={stats.alcohol.none} total={stats.attending} color="bg-slate-400" />
            </div>
          </div>
        </div>

        {/* Logistics & Music Section */}
        <div className="space-y-8">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-white/20">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-gold/20 rounded-xl text-gold">
                <Bus size={22} />
              </div>
              <h2 className="text-xl font-bold text-charcoal">Логистика</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Bus size={18} />
                  <span className="text-sm font-medium">Трансфер</span>
                </div>
                <p className="text-2xl font-bold text-charcoal">{stats.logistics.transferNeeded}</p>
                <p className="text-xs text-muted-foreground mt-1">человек нуждается</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Home size={18} />
                  <span className="text-sm font-medium">Проживание</span>
                </div>
                <p className="text-2xl font-bold text-charcoal">{stats.logistics.accommodationNeeded}</p>
                <p className="text-xs text-muted-foreground mt-1">человек нуждается</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-white/20 max-h-[400px] flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-500">
                <Music size={22} />
              </div>
              <h2 className="text-xl font-bold text-charcoal">Плейлист (Предложения)</h2>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {stats.music && stats.music.length > 0 ? (
                stats.music.map((track: string, index: number) => (
                  <div key={index} className="p-3 bg-slate-50 rounded-xl text-sm text-charcoal flex items-center gap-3 border border-slate-100">
                    <span className="w-6 h-6 flex items-center justify-center bg-white rounded-full text-[10px] font-bold text-muted-foreground shadow-sm">
                      {index + 1}
                    </span>
                    <span className="font-medium">{track}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic text-center py-8">Пока предложений нет</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
