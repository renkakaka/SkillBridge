import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Sparkles } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12">
            {/* Анимированная иконка загрузки */}
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
              <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
            </div>
            
            {/* Заголовок */}
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">
              Բեռնվում է...
            </h1>
            
            {/* Описание */}
            <p className="text-neutral-600 mb-6 leading-relaxed">
              Խնդրում ենք սպասեք, մենք պատրաստում ենք ձեր փորձառությունը
            </p>
            
            {/* Анимированные точки */}
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-secondary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            
            {/* Дополнительная информация */}
            <div className="mt-8 pt-6 border-t border-neutral-200">
              <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
                <Sparkles className="h-4 w-4 text-primary-500" />
                <span>SkillBridge - Ձեր կարիերայի զարգացման հարթակ</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
