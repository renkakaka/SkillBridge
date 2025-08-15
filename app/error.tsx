'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, RefreshCw, AlertTriangle, ArrowLeft } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Логируем ошибку в консоль
    console.error('Error occurred:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12">
            {/* Иконка ошибки */}
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertTriangle className="h-12 w-12 text-red-600" />
            </div>
            
            {/* Заголовок */}
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              Սխալ է տեղի ունեցել
            </h1>
            
            {/* Описание */}
            <p className="text-lg text-neutral-600 mb-6 leading-relaxed">
              Խնդրում ենք ներողություն, տեխնիկական խնդիր է տեղի ունեցել: 
              Մեր թիմը արդեն տեղյակ է այս խնդրի մասին և աշխատում է դրա լուծման վրա:
            </p>
            
            {/* Детали ошибки (только в разработке) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-red-50 rounded-xl p-4 mb-6 border border-red-200 text-left">
                <h3 className="font-semibold text-red-800 mb-2">Մանրամասներ (միայն զարգացման համար)</h3>
                <p className="text-sm text-red-700 font-mono break-all">
                  {error.message || 'Unknown error'}
                </p>
                {error.digest && (
                  <p className="text-xs text-red-600 mt-2">
                    Digest: {error.digest}
                  </p>
                )}
              </div>
            )}
            
            {/* Действия */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button 
                onClick={reset}
                size="lg" 
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Կրկին փորձել
              </Button>
              
              <Link href="/">
                <Button variant="outline" size="lg" className="border-2 hover:bg-neutral-50">
                  <Home className="h-5 w-5 mr-2" />
                  Գլխավոր էջ
                </Button>
              </Link>
            </div>
            
            {/* Дополнительная помощь */}
            <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
              <h3 className="font-semibold text-neutral-800 mb-3">
                Ինչ կարող եք անել
              </h3>
              <ul className="text-sm text-neutral-600 space-y-2 text-left max-w-md mx-auto">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  Կրկին փորձեք էջը բեռնել
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  Ստուգեք ձեր ինտերնետ կապը
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  Մաքրեք ձեր բրաուզերի քեշը
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  Վերադառնաք գլխավոր էջ
                </li>
              </ul>
            </div>
            
            {/* Кнопка назад */}
            <div className="mt-8">
              <Button 
                variant="ghost" 
                onClick={() => window.history.back()}
                className="text-neutral-600 hover:text-neutral-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Վերադառնալ հետ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
