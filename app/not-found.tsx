import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, Search, ArrowLeft, AlertTriangle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12">
            {/* Иконка ошибки */}
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertTriangle className="h-12 w-12 text-red-600" />
            </div>
            
            {/* Заголовок */}
            <h1 className="text-6xl font-bold text-neutral-900 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
              Էջը չի գտնվել
            </h2>
            
            {/* Описание */}
            <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
              Խնդրում ենք ներողություն, էջը, որը դուք փնտրում եք, գոյություն չունի կամ տեղափոխվել է: 
              Ստուգեք URL-ը կամ օգտագործեք նավիգացիան:
            </p>
            
            {/* Действия */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/">
                <Button size="lg" className="bg-gradient-primary hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                  <Home className="h-5 w-5 mr-2" />
                  Գլխավոր էջ
                </Button>
              </Link>
              
              <Link href="/projects">
                <Button variant="outline" size="lg" className="border-2 hover:bg-primary-50">
                  <Search className="h-5 w-5 mr-2" />
                  Դիտել նախագծեր
                </Button>
              </Link>
            </div>
            
            {/* Дополнительная информация */}
            <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
              <h3 className="font-semibold text-neutral-800 mb-3">
                Հնարավոր պատճառներ
              </h3>
              <ul className="text-sm text-neutral-600 space-y-2 text-left max-w-md mx-auto">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                  URL-ը սխալ է կամ տառասխալ
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                  Էջը տեղափոխվել է կամ ջնջվել
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                  Դուք գրել եք հին հղում
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
