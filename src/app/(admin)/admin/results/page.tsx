'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminStats from '@/components/admin/AdminStats';
import { 
  Search, 
  Download, 
  AlertCircle,
  Loader2,
  Calendar
} from 'lucide-react';

interface DetailedResponse {
    id: string;
    name: string;
    isAttending: boolean | null;
    gender: 'male' | 'female';
    menuChoice: string | null;
    allergies: string[];
    allergiesOther: string;
    alcohol: string[];
    needsTransfer: boolean | null;
    hasAccommodation: boolean | null;
    tracks: string[];
    updatedAt: string;
}

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

interface AdminData {
    stats: AdminStatsType;
    detailedResponses: DetailedResponse[];
}

export default function AdminResultsPage() {
    const searchParams = useSearchParams();
    const key = searchParams.get('key');
    const [data, setData] = useState<AdminData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        if (!key) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch(`/api/admin/results?key=${key}`);
                if (!response.ok) {
                    throw new Error('Некорректный ключ или ошибка сервера');
                }
                const result = await response.json();
                setData(result);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Некорректный ключ или ошибка сервера');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [key]);

    if (!key) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream p-6">
                <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center animate-fade-in-up">
                    <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gold">
                        <AlertCircle size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-charcoal mb-2">Доступ запрещен</h1>
                    <p className="text-muted-foreground mb-8">Для просмотра статистики необходимо использовать специальный ключ администратора в ссылке.</p>
                    <div className="p-4 bg-slate-50 rounded-xl text-sm text-charcoal border border-slate-100">
                        Пожалуйста, проверьте URL еще раз или свяжитесь с разработчиком.
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-gold animate-spin" />
                    <p className="text-gold font-medium animate-pulse">Загружаем данные...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream p-6">
                <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-rose-100 text-center">
                    <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-500">
                        <AlertCircle size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-charcoal mb-2">Ошибка доступа</h1>
                    <p className="text-muted-foreground mb-8 text-sm">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full py-3 bg-charcoal text-white rounded-xl font-bold hover:bg-black transition-colors"
                    >
                        Попробовать снова
                    </button>
                </div>
            </div>
        );
    }

    // Filter logic
    const filteredResponses = data?.detailedResponses?.filter((res: DetailedResponse) => {
        const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' 
            ? true 
            : filterStatus === 'attending' 
                ? res.isAttending === true 
                : filterStatus === 'notAttending'
                    ? res.isAttending === false
                    : res.isAttending === null;
        
        return matchesSearch && matchesStatus;
    }) || [];

    const handleExport = () => {
        if (!data?.detailedResponses) return;

        const headers = ['Имя', 'Статус', 'Меню', 'Аллергии', 'Алкоголь', 'Трансфер', 'Отель', 'Музыка'];
        const rows = data.detailedResponses.map((res: DetailedResponse) => [
            res.name,
            res.isAttending === true ? 'Придет' : res.isAttending === false ? 'Отказ' : 'Ожидание',
            res.menuChoice || '-',
            res.allergies.join(', ') || '-',
            res.alcohol.join(', ') || '-',
            res.needsTransfer ? 'Да' : 'Нет',
            res.hasAccommodation ? 'Да' : 'Нет',
            res.tracks.join('; ') || '-'
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map((row) => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `wedding_guests_results_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-[#FDFBF9] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-3 py-1 bg-gold/10 text-gold text-xs font-bold rounded-full tracking-wider uppercase">Админ Панель</span>
                            <span className="text-muted-foreground text-sm">•</span>
                            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                                <Calendar size={14} />
                                <span>{new Date().toLocaleDateString('ru-RU')}</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-charcoal tracking-tight font-great-vibes">Результаты опросов</h1>
                        <p className="text-muted-foreground mt-2 max-w-xl">
                            Статистика ответов и детальная информация о предпочтениях гостей в реальном времени.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleExport}
                            className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl text-charcoal font-semibold text-sm hover:shadow-sm transition-all group active:scale-95"
                        >
                            <Download size={18} className="text-muted-foreground group-hover:text-charcoal" />
                            Экспорт CSV
                        </button>
                    </div>
                </div>

                {/* Stats Dashboard */}
                {data && <AdminStats stats={data.stats} />}

                {/* Detailed Table Section */}
                <div className="mt-16 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-50 bg-[#FDFBF9]/50">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div>
                                <h2 className="text-xl font-bold text-charcoal">Список гостей</h2>
                                <p className="text-sm text-muted-foreground mt-1">Детальные ответы каждого гостя</p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="Поиск по имени..." 
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <select 
                                        className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-gold/20 outline-none pr-10 relative cursor-pointer"
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                    >
                                        <option value="all">Все статусы</option>
                                        <option value="attending">Придут</option>
                                        <option value="notAttending">Не придут</option>
                                        <option value="pending">Ожидают</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest border-b border-slate-100">Гость</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest border-b border-slate-100">Статус</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest border-b border-slate-100">Меню</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest border-b border-slate-100">Алкоголь</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest border-b border-slate-100">Логистика</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest border-b border-slate-100">Музыка</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredResponses && filteredResponses.length > 0 ? filteredResponses.map((res: DetailedResponse) => (
                                    <tr key={res.id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div>
                                                <p className="font-bold text-charcoal">{res.name}</p>
                                                <p className="text-[10px] text-muted-foreground mt-0.5">{res.gender === 'male' ? 'Мужчина' : 'Женщина'}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            {res.isAttending === true ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-50 text-green-600 border border-green-100">ПРИДЕТ</span>
                                            ) : res.isAttending === false ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-500 border border-rose-100">ОТКАЗ</span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-50 text-muted-foreground border border-slate-100">ОЖИДАНИЕ</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5">
                                            {res.isAttending ? (
                                                <span className="text-sm text-charcoal flex flex-col">
                                                    {res.menuChoice === 'meat' && '🥩 Мясо'}
                                                    {res.menuChoice === 'fish' && '🐟 Рыба'}
                                                    {res.menuChoice === 'vegetarian' && '🥗 Вегетарианское'}
                                                    {res.menuChoice === 'kids' && '🍟 Детское'}
                                                    {!res.menuChoice && <span className="text-muted-foreground italic">Не выбрано</span>}
                                                    {res.allergies.length > 0 && (
                                                        <span className="text-[10px] text-rose-400 mt-1 font-medium">⚠️ {res.allergies.join(', ')}</span>
                                                    )}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-5">
                                            {res.isAttending ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {res.alcohol.length > 0 ? res.alcohol.map((a: string) => (
                                                        <span key={a} className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-charcoal">
                                                            {a === 'wine' && '🍷 Вино'}
                                                            {a === 'champagne' && '🥂 Шампань'}
                                                            {a === 'spirits' && '🥃 Крепкое'}
                                                            {a === 'none' && '💧 Трезв'}
                                                        </span>
                                                    )) : <span className="text-muted-foreground italic text-xs">Не указано</span>}
                                                </div>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-5">
                                            {res.isAttending ? (
                                                <div className="flex flex-col gap-1">
                                                    {res.needsTransfer && <span className="text-[10px] text-blue-500 font-bold underline decoration-blue-200 underline-offset-2">🚌 ТРАНСФЕР</span>}
                                                    {res.hasAccommodation && <span className="text-[10px] text-orange-500 font-bold underline decoration-orange-200 underline-offset-2">🏠 ОТЕЛЬ</span>}
                                                    {!res.needsTransfer && !res.hasAccommodation && <span className="text-xs text-muted-foreground">Не нужно</span>}
                                                </div>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-5">
                                            {res.tracks.length > 0 ? (
                                                <div className="max-w-[150px] truncate text-[10px] text-charcoal font-medium" title={res.tracks.join(', ')}>
                                                    🎵 {res.tracks[0]}{res.tracks.length > 1 && ` (+${res.tracks.length - 1})`}
                                                </div>
                                            ) : '-'}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center text-muted-foreground italic">
                                            Гости не найдены по заданным критериям
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-8 flex justify-center text-xs text-muted-foreground">
                    Всего найдено: {filteredResponses?.length || 0} записей
                </div>
            </div>
        </div>
    );
}
