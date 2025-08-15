'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, 
  Users, 
  CheckCircle, 
  XCircle, 
  Download,
  Trash2,
  RefreshCw,
  Search
} from 'lucide-react'

interface NewsletterSubscription {
  id: string
  email: string
  consent: boolean
  subscribedAt: string
  isActive: boolean
  unsubscribedAt?: string
}

export default function NewsletterAdminPage() {
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterActive, setFilterActive] = useState(true)

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('/api/newsletter')
      if (response.ok) {
        const data = await response.json()
        setSubscriptions(data.subscriptions || [])
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const deactivateSubscription = async (id: string) => {
    try {
      const response = await fetch(`/api/newsletter/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: false, unsubscribedAt: new Date().toISOString() }),
      })

      if (response.ok) {
        setSubscriptions(prev => 
          prev.map(sub => 
            sub.id === id 
              ? { ...sub, isActive: false, unsubscribedAt: new Date().toISOString() }
              : sub
          )
        )
      }
    } catch (error) {
      console.error('Error deactivating subscription:', error)
    }
  }

  const exportSubscriptions = () => {
    const activeSubs = subscriptions.filter(sub => sub.isActive)
    const csvContent = [
      'Email,Consent,Subscribed At',
      ...activeSubs.map(sub => 
        `${sub.email},${sub.consent ? 'Yes' : 'No'},${new Date(sub.subscribedAt).toLocaleDateString()}`
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'newsletter_subscriptions.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterActive ? sub.isActive : !sub.isActive
    return matchesSearch && matchesFilter
  })

  const activeCount = subscriptions.filter(sub => sub.isActive).length
  const totalCount = subscriptions.length

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Նորությունների Բաժանորդագրություններ</h1>
        <p className="text-neutral-600">Կառավարեք բաժանորդագրությունները և հետևեք ձեր համայնքի աճին</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Ընդհանուր բաժանորդներ</p>
                <p className="text-2xl font-bold text-neutral-900">{totalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Ակտիվ բաժանորդներ</p>
                <p className="text-2xl font-bold text-neutral-900">{activeCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Համաձայնություն</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {subscriptions.filter(sub => sub.consent).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Фильтры и действия */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Որոնել email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant={filterActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterActive(true)}
                >
                  Ակտիվ
                </Button>
                <Button
                  variant={!filterActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterActive(false)}
                >
                  Անակտիվ
                </Button>
              </div>
            </div>
            
            <Button
              onClick={exportSubscriptions}
              className="bg-green-600 hover:bg-green-700"
              leftIcon={<Download className="h-4 w-4" />}
            >
              Էքսպորտ CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Список подписок */}
      <Card>
        <CardHeader>
          <CardTitle>Բաժանորդագրություններ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Համաձայնություն</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Բաժանորդագրվել է</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Վիճակ</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Գործողություններ</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscriptions.map((subscription) => (
                  <tr key={subscription.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-neutral-900">{subscription.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={subscription.consent ? "success" : "secondary"}>
                        {subscription.consent ? 'Այո' : 'Ոչ'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral-600">
                      {new Date(subscription.subscribedAt).toLocaleDateString('hy-AM')}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={subscription.isActive ? "default" : "secondary"}>
                        {subscription.isActive ? 'Ակտիվ' : 'Անակտիվ'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {subscription.isActive ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deactivateSubscription(subscription.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          leftIcon={<XCircle className="h-4 w-4" />}
                        >
                          Ապաակտիվացնել
                        </Button>
                      ) : (
                        <span className="text-sm text-neutral-500">
                          Ապաակտիվացված է {subscription.unsubscribedAt && 
                            new Date(subscription.unsubscribedAt).toLocaleDateString('hy-AM')
                          }
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredSubscriptions.length === 0 && (
              <div className="text-center py-12 text-neutral-500">
                Բաժանորդագրություններ չեն գտնվել
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
