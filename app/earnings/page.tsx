'use client'

import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, DollarSign, Calendar, CreditCard, Wallet, Download, Filter, BarChart3, PieChart } from 'lucide-react'
import dynamic from 'next/dynamic'

// Динамический импорт Chart.js для избежания SSR проблем
const Chart = dynamic(() => import('chart.js/auto').then(mod => ({ default: mod.default || mod })), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-64">Loading chart...</div>
})

interface Transaction {
  id: string
  project: string
  client: string
  amount: number
  type: 'income' | 'withdrawal' | 'refund'
  status: 'completed' | 'pending' | 'failed'
  date: string
  description: string
}

interface EarningStats {
  totalEarnings: number
  monthlyEarnings: number
  pendingAmount: number
  availableBalance: number
  growthRate: number
  projectCount: number
}

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
    fill?: boolean
    tension?: number
  }[]
}

export default function EarningsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState<EarningStats>({
    totalEarnings: 0,
    monthlyEarnings: 0,
    pendingAmount: 0,
    availableBalance: 0,
    growthRate: 0,
    projectCount: 0
  })
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [loading, setLoading] = useState(true)
  const [activeChart, setActiveChart] = useState<'earnings' | 'category' | 'monthly'>('earnings')
  const [chartData, setChartData] = useState<{ monthly: { labels: string[]; data: number[] }; category: { labels: string[]; data: number[] } }>({ monthly: { labels: [], data: [] }, category: { labels: [], data: [] } })
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  
  const earningsChartRef = useRef<HTMLCanvasElement>(null)
  const categoryChartRef = useRef<HTMLCanvasElement>(null)
  const monthlyChartRef = useRef<HTMLCanvasElement>(null)
  const chartInstances = useRef<{ [key: string]: any }>({})

  useEffect(() => {
    const load = async () => {
      try {
        const meRes = await fetch('/api/users/me')
        if (!meRes.ok) return setLoading(false)
        const me = await meRes.json()
        const r = await fetch(`/api/earnings?period=${selectedPeriod}`)
        if (!r.ok) return setLoading(false)
        const data = await r.json()
        // Map stats
        setStats({
          totalEarnings: data.stats?.totalEarnings || 0,
          monthlyEarnings: data.stats?.monthlyEarnings || 0,
          pendingAmount: data.stats?.pendingAmount || 0,
          availableBalance: data.stats?.availableBalance || 0,
          growthRate: data.stats?.growthRate || 0,
          projectCount: data.stats?.projectCount || 0,
        })
        // Map transactions (fallback to mock if missing)
        const tx = Array.isArray(data.transactions) ? data.transactions.map((t: any) => ({
          id: t.id, project: t.project?.title || '-', client: t.project?.client?.name || '-', amount: t.amount,
          type: t.type, status: t.status, date: new Date(t.createdAt).toISOString().slice(0,10), description: t.description
        })) : []
        setTransactions(tx)
        // Prepare charts
        setChartData({
          monthly: data.charts?.monthly || { labels: [], data: [] },
          category: data.charts?.category || { labels: [], data: [] }
        })
        setLoading(false)
      } catch {
        setLoading(false)
      }
    }
    load()
  }, [selectedPeriod])

  useEffect(() => {
    if (!loading && Chart) {
      createCharts()
    }
    
    return () => {
      // Очищаем графики при размонтировании
      Object.values(chartInstances.current).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
          chart.destroy()
        }
      })
    }
  }, [loading, selectedPeriod])

  const loadEarningsData = () => {
    // Симулируем загрузку данных о заработках
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        project: 'Էլեկտրոնային առևտրի կայք',
        client: 'TechCorp',
        amount: 2500,
        type: 'income',
        status: 'completed',
        date: '2025-01-15',
        description: 'Նախագիծ ավարտված'
      },
      {
        id: '2',
        project: 'Մոբայլ հավելված iOS-ի համար',
        client: 'SocialApp Inc',
        amount: 1800,
        type: 'income',
        status: 'completed',
        date: '2025-01-10',
        description: 'Նախագիծ ավարտված'
      },
      {
        id: '3',
        project: 'Լոգո և բրենդինգ',
        client: 'StartupXYZ',
        amount: 800,
        type: 'income',
        status: 'completed',
        date: '2025-01-05',
        description: 'Նախագիծ ավարտված'
      },
      {
        id: '4',
        project: 'Վեբ կայքի վերանորոգում',
        client: 'BusinessCorp',
        amount: 1200,
        type: 'income',
        status: 'pending',
        date: '2025-01-20',
        description: 'Նախագիծ ընթացքում'
      },
      {
        id: '5',
        project: 'Մարքեթինգային արշավ',
        client: 'MarketingPro',
        amount: 600,
        type: 'income',
        status: 'pending',
        date: '2025-01-18',
        description: 'Նախագիծ ընթացքում'
      }
    ]

    const mockStats: EarningStats = {
      totalEarnings: 7800,
      monthlyEarnings: 5100,
      pendingAmount: 1800,
      availableBalance: 6000,
      growthRate: 15.5,
      projectCount: 5
    }

    setTransactions(mockTransactions)
    setStats(mockStats)
    setLoading(false)
  }

  const createCharts = () => {
    if (!Chart) return

    // График доходов по месяцам
    if (earningsChartRef.current && !chartInstances.current.earnings) {
      const ctx = earningsChartRef.current.getContext('2d')
      if (ctx) {
        const earningsData = getEarningsData()
        chartInstances.current.earnings = new (Chart as any)(ctx, {
          type: 'line',
          data: {
            labels: earningsData.labels,
            datasets: [{
              label: 'Եկամուտներ ($)',
              data: earningsData.data,
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: 'rgb(59, 130, 246)',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 8
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                  label: function(context: any) {
                    return `Եկամուտ: $${context.parsed.y.toLocaleString()}`
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)',
                  drawBorder: false
                },
                ticks: {
                  callback: function(value: any) {
                    return '$' + value.toLocaleString()
                  }
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            },
            interaction: {
              intersect: false,
              mode: 'index'
            }
          }
        })
      }
    }

    // График доходов по категориям
    if (categoryChartRef.current && !chartInstances.current.category) {
      const ctx = categoryChartRef.current.getContext('2d')
      if (ctx) {
        const categoryData = getCategoryData()
        chartInstances.current.category = new (Chart as any)(ctx, {
          type: 'doughnut',
          data: {
            labels: categoryData.labels,
            datasets: [{
              data: categoryData.data,
              backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)',
                'rgba(139, 92, 246, 0.8)'
              ],
              borderColor: '#fff',
              borderWidth: 2,
              hoverOffset: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 20,
                  usePointStyle: true,
                  font: {
                    size: 12
                  }
                }
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(59, 130, 246, 0.5)',
                borderWidth: 1,
                cornerRadius: 8,
                callbacks: {
                  label: function(context: any) {
                    const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
                    const percentage = ((context.parsed / total) * 100).toFixed(1)
                    return `${context.label}: $${context.parsed.toLocaleString()} (${percentage}%)`
                  }
                }
              }
            }
          }
        })
      }
    }

    // График доходов по месяцам (столбчатый)
    if (monthlyChartRef.current && !chartInstances.current.monthly) {
      const ctx = monthlyChartRef.current.getContext('2d')
      if (ctx) {
        const monthlyData = getMonthlyData()
        chartInstances.current.monthly = new (Chart as any)(ctx, {
          type: 'bar',
          data: {
            labels: monthlyData.labels,
            datasets: [{
              label: 'Եկամուտներ ($)',
              data: monthlyData.data,
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 1,
              borderRadius: 6,
              borderSkipped: false
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                  label: function(context: any) {
                    return `Եկամուտ: $${context.parsed.y.toLocaleString()}`
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)',
                  drawBorder: false
                },
                ticks: {
                  callback: function(value: any) {
                    return '$' + value.toLocaleString()
                  }
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            }
          }
        })
      }
    }
  }

  const getEarningsData = () => chartData.monthly

  const getCategoryData = () => chartData.category

  const getMonthlyData = () => chartData.monthly

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'withdrawal':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case 'refund':
        return <TrendingDown className="h-4 w-4 text-orange-600" />
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />
    }
  }

  const handleWithdraw = () => {
    if (stats.availableBalance > 0) {
      setToast({ message: `Հանում ենք $${stats.availableBalance.toLocaleString()} ձեր հաշվից`, type: 'success' })
      setTimeout(() => setToast(null), 2500)
    }
  }

  const handleExport = () => {
    setToast({ message: 'Ներբեռնվում է եկամուտների հաշվետվությունը...', type: 'success' })
    setTimeout(() => setToast(null), 2500)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Եկամուտներ</h1>
            <p className="text-neutral-600">Հետևեք ձեր եկամուտներին և ֆինանսական առաջընթացին</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleWithdraw} disabled={stats.availableBalance <= 0}>
              <Wallet className="h-4 w-4 mr-2" />
              Հանել գումար
            </Button>
          </div>
        </div>

        {/* Период */}
        <div className="flex gap-2 mb-6">
          {['week', 'month', 'quarter', 'year'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period === 'week' && 'Շաբաթ'}
              {period === 'month' && 'Ամիս'}
              {period === 'quarter' && 'Եռամսյակ'}
              {period === 'year' && 'Տարի'}
            </Button>
          ))}
        </div>
      </div>

      {/* Основная статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Ընդհանուր եկամուտ</p>
                <p className="text-2xl font-bold text-neutral-900">${stats.totalEarnings.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  +{stats.growthRate}%
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Ամսական եկամուտ</p>
                <p className="text-2xl font-bold text-neutral-900">${stats.monthlyEarnings.toLocaleString()}</p>
                <p className="text-sm text-neutral-500">Այս ամիս</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Սպասող գումար</p>
                <p className="text-2xl font-bold text-neutral-900">${stats.pendingAmount.toLocaleString()}</p>
                <p className="text-sm text-neutral-500">Ընթացիկ նախագծեր</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Հասանելի մնացորդ</p>
                <p className="text-2xl font-bold text-neutral-900">${stats.availableBalance.toLocaleString()}</p>
                <p className="text-sm text-neutral-500">Հանման համար</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Переключатель графиков */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeChart === 'earnings' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveChart('earnings')}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Եկամուտների դինամիկա
        </Button>
        <Button
          variant={activeChart === 'category' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveChart('category')}
        >
          <PieChart className="h-4 w-4 mr-2" />
          Կատեգորիաներ
        </Button>
        <Button
          variant={activeChart === 'monthly' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveChart('monthly')}
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Ամսական վերլուծություն
        </Button>
      </div>

      {/* Графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Основной график */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {activeChart === 'earnings' && <TrendingUp className="h-5 w-5" />}
              {activeChart === 'category' && <PieChart className="h-5 w-5" />}
              {activeChart === 'monthly' && <BarChart3 className="h-5 w-5" />}
              {activeChart === 'earnings' && 'Եկամուտների դինամիկա'}
              {activeChart === 'category' && 'Եկամուտներ ըստ կատեգորիաների'}
              {activeChart === 'monthly' && 'Ամսական եկամուտներ'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 relative">
              {activeChart === 'earnings' && (
                <canvas ref={earningsChartRef} className="w-full h-full" />
              )}
              {activeChart === 'category' && (
                <canvas ref={categoryChartRef} className="w-full h-full" />
              )}
              {activeChart === 'monthly' && (
                <canvas ref={monthlyChartRef} className="w-full h-full" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Дополнительная статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Առավելագույն եկամուտ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">
              ${Math.max(...getEarningsData().data).toLocaleString()}
            </div>
            <p className="text-sm text-neutral-600">Ամենաբարձր ամսական եկամուտ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Միջին եկամուտ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              ${Math.round(getEarningsData().data.reduce((a, b) => a + b, 0) / getEarningsData().data.length).toLocaleString()}
            </div>
            <p className="text-sm text-neutral-600">Ամսական միջին եկամուտ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Աճի տեմպ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              +{stats.growthRate}%
            </div>
            <p className="text-sm text-neutral-600">Նախորդ ամսվա համեմատ</p>
          </CardContent>
        </Card>
      </div>

      {/* Транзакции */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Գործարքների պատմություն</h2>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Ֆիլտրեր
          </Button>
        </div>

        <div className="space-y-4">
          {transactions.map((transaction) => (
            <Card key={transaction.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-neutral-100 rounded-lg">
                      {getTypeIcon(transaction.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">{transaction.project}</h3>
                      <p className="text-sm text-neutral-600">{transaction.client}</p>
                      <p className="text-xs text-neutral-500">{transaction.description}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-lg font-bold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                      </span>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status === 'completed' && 'Ավարտված'}
                        {transaction.status === 'pending' && 'Սպասում'}
                        {transaction.status === 'failed' && 'Ձախողված'}
                      </Badge>
                    </div>
                    <p className="text-sm text-neutral-500">{transaction.date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {transactions.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <DollarSign className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-600">Գործարքներ չեն գտնվել</p>
            </CardContent>
          </Card>
        )}
      </div>

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}
    </div>
  )
}
